// Extracto de Beta3M (código fuente privado). Mostrado con fines de portfolio. © 2026 Marc Gálvez & Ignasi Palau.
//
// Lienzo de escritura a mano. Dos capas superpuestas:
//   · <canvas> "overlay": pinta SOLO el trazo en curso, repintado como mucho una vez por frame (RAF).
//   · <svg>: trazos ya confirmados, suavizados con curvas cuadráticas.
// Los puntos del trazo viven en refs: mover el lápiz no provoca ningún render de React.
//
// Versión resumida: se han omitido la regla, el texto libre y la autocompletación de bocetos.

import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useMultiTouch } from '../hooks/useMultiTouch';
import {
  getBoundingBox, getStrokeBbox, hexOrRgbaWithOpacity, looksLikeMath,
  mergeBboxes, normalizeSvgData, renderBufferToCanvas, smoothPoints,
} from './inkGeometry';
import type { Point, Stroke } from './inkGeometry';
import type { FloatingObject } from '../types/models';

type DrawTool = 'pencil' | 'fountain' | 'marker' | 'eraser';
type OcrMode = 'math' | 'handwriting';
type OcrResult = { type: 'text' | 'latex'; content: string } | null;

/** Agrupación de trazos que forman una misma línea de texto, a la espera de OCR. */
interface LineBuffer {
  id: string;
  strokes: Stroke[];
  lastStrokeTime: number;
  debounceTimer: ReturnType<typeof setTimeout> | null;
  boundingBox: { minX: number; minY: number; width: number; height: number };
}

type Props = {
  active: boolean;
  strokeWidth?: number;
  strokeColor?: string;
  drawTool?: DrawTool;
  drawOpacity?: number;
  /** Si es false, los toques con el dedo no dibujan (palm rejection básico por pointerType). */
  drawWithFinger?: boolean;
  editorScrollRef?: React.RefObject<HTMLDivElement | null>;
  /** Reconocimiento (texto o LaTeX) de una línea manuscrita. Inyectado: el lienzo no conoce la API. */
  recognize?: (pngBase64: string, mode: OcrMode) => Promise<OcrResult>;
  onStrokeObject?: (obj: FloatingObject) => void;
  onOcrText?: (text: string, cx: number, cy: number) => void;
};

export type InkCanvasRef = {
  clearStrokes: () => void;
  getSvgElement: () => SVGSVGElement | null;
};

const LINE_TOLERANCE_PX = 60;   // distancia vertical para considerar que un trazo es de la misma línea
const LINE_IDLE_MS = 1000;      // pausa tras la que se reconoce una línea
const COMMIT_IDLE_MS = 1200;    // pausa tras la que los trazos sueltos pasan a ser un objeto movible

const InkCanvas = forwardRef<InkCanvasRef, Props>(({
  active,
  strokeWidth = 2,
  strokeColor = '#1f2937',
  drawTool = 'pencil',
  drawOpacity = 1,
  drawWithFinger = false,
  editorScrollRef,
  recognize,
  onStrokeObject,
  onOcrText,
}, ref) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const currentPointsRef = useRef<Point[]>([]);
  const strokesRef = useRef<Stroke[]>([]);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const commitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lineBuffersRef = useRef<LineBuffer[]>([]);
  const [lineBuffers, setLineBuffers] = useState<LineBuffer[]>([]);

  // Dos o más dedos = desplazamiento; el lápiz sigue dibujando.
  const { isPanning, onDown: panDown, onMove: panMove, onUp: panUp } =
    useMultiTouch(editorScrollRef as React.RefObject<HTMLElement | null>);

  // Refs "espejo" de las props: el callback de RAF y los temporizadores siempre leen el valor actual
  const styleRef = useRef({ strokeColor, strokeWidth, drawOpacity });
  useEffect(() => { styleRef.current = { strokeColor, strokeWidth, drawOpacity }; },
    [strokeColor, strokeWidth, drawOpacity]);
  const callbacksRef = useRef({ recognize, onStrokeObject, onOcrText });
  useEffect(() => { callbacksRef.current = { recognize, onStrokeObject, onOcrText }; },
    [recognize, onStrokeObject, onOcrText]);

  // ── Resolución nítida en pantallas HiDPI ───────────────────────────────────
  useEffect(() => {
    const canvas = overlayRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  const clearOverlay = () => {
    if (rafRef.current !== null) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    const canvas = overlayRef.current;
    canvas?.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
  };

  // ── Trazo en curso: como mucho un repintado por frame ──────────────────────
  const scheduleRedraw = () => {
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const canvas = overlayRef.current;
      const ctx = canvas?.getContext('2d');
      const pts = currentPointsRef.current;
      if (!canvas || !ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const { strokeColor, strokeWidth, drawOpacity } = styleRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (pts.length < 2) return;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = drawOpacity;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length - 1; i++) {
        // Punto medio como extremo y el punto real como control: curva continua sin picos
        const mx = (pts[i].x + pts[i + 1].x) / 2;
        const my = (pts[i].y + pts[i + 1].y) / 2;
        ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
      }
      ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
      ctx.stroke();
      ctx.restore();
    });
  };

  useImperativeHandle(ref, () => ({
    clearStrokes: () => {
      if (commitTimerRef.current) clearTimeout(commitTimerRef.current);
      lineBuffersRef.current.forEach(b => b.debounceTimer && clearTimeout(b.debounceTimer));
      lineBuffersRef.current = [];
      setLineBuffers([]);
      strokesRef.current = [];
      setStrokes([]);
      currentPointsRef.current = [];
      clearOverlay();
    },
    getSvgElement: () => svgRef.current,
  }));

  // ── Trazos → objeto flotante (movible, redimensionable) ────────────────────
  const toStrokeObject = (group: Stroke[]): FloatingObject | null => {
    const bbox = getBoundingBox(group);
    const svgData = normalizeSvgData(group, bbox.minX, bbox.minY);
    if (!svgData) return null;
    return {
      id: crypto.randomUUID(),
      type: 'stroke',
      position: { x: bbox.minX, y: bbox.minY },
      dimensions: { width: Math.max(bbox.width, 40), height: Math.max(bbox.height, 40) },
      svgData,
      stroke: group[0].color,
      strokeWidth: group[0].width,
      isSelected: false,
      rotation: 0,
    };
  };

  const scheduleCommit = useCallback(() => {
    if (commitTimerRef.current) clearTimeout(commitTimerRef.current);
    commitTimerRef.current = setTimeout(() => {
      const obj = strokesRef.current.length ? toStrokeObject(strokesRef.current) : null;
      if (!obj) return;
      callbacksRef.current.onStrokeObject?.(obj);
      strokesRef.current = [];
      setStrokes([]);
    }, COMMIT_IDLE_MS);
  }, []);

  // ── Reconocimiento por líneas ──────────────────────────────────────────────
  const fireBuffer = useCallback(async (bufferId: string) => {
    const buf = lineBuffersRef.current.find(b => b.id === bufferId);
    if (!buf) return;
    const consumed = new Set(buf.strokes.map(s => s.timestamp));

    lineBuffersRef.current = lineBuffersRef.current.filter(b => b.id !== bufferId);
    setLineBuffers([...lineBuffersRef.current]);
    strokesRef.current = strokesRef.current.filter(s => !consumed.has(s.timestamp));
    setStrokes([...strokesRef.current]);

    const rendered = renderBufferToCanvas(buf.strokes);
    const { recognize, onStrokeObject, onOcrText } = callbacksRef.current;
    if (!rendered || !recognize) return;

    // Una heurística geométrica decide si la línea parece una fórmula (→ LaTeX) o texto
    const isMath = looksLikeMath(buf.strokes);
    const keepAsDrawing = () => {
      const obj = toStrokeObject(buf.strokes);
      if (obj) onStrokeObject?.(obj);
    };

    try {
      const result = await recognize(rendered.base64, isMath ? 'math' : 'handwriting');
      if (isMath && result?.type === 'latex' && result.content) {
        const { minX, minY, width, height } = buf.boundingBox;
        onStrokeObject?.({
          id: crypto.randomUUID(),
          type: 'equation',
          position: { x: minX, y: minY },
          dimensions: { width: Math.max(width, 120), height: Math.max(height, 60) },
          latexSource: result.content.trim(),
          isSelected: false,
          rotation: 0,
        });
      } else if (result?.content?.trim()) {
        onOcrText?.(result.content.trim() + ' ', rendered.cx, rendered.cy);
      } else {
        keepAsDrawing();
      }
    } catch {
      // Sin red o error de la IA: nunca se pierde lo escrito, queda como dibujo
      keepAsDrawing();
    }
  }, []);

  const addStrokeToBuffer = useCallback((stroke: Stroke) => {
    const bbox = getStrokeBbox(stroke);
    const centerY = bbox.minY + bbox.height / 2;
    const buffers = lineBuffersRef.current;
    const idx = buffers.findIndex(b =>
      Math.abs(b.boundingBox.minY + b.boundingBox.height / 2 - centerY) < LINE_TOLERANCE_PX);

    if (idx >= 0) {
      const buf = buffers[idx];
      if (buf.debounceTimer) clearTimeout(buf.debounceTimer);
      buffers[idx] = {
        ...buf,
        strokes: [...buf.strokes, stroke],
        lastStrokeTime: stroke.timestamp,
        boundingBox: mergeBboxes(buf.boundingBox, bbox),
        debounceTimer: setTimeout(() => fireBuffer(buf.id), LINE_IDLE_MS),
      };
    } else {
      const id = crypto.randomUUID();
      buffers.push({
        id,
        strokes: [stroke],
        lastStrokeTime: stroke.timestamp,
        boundingBox: bbox,
        debounceTimer: setTimeout(() => fireBuffer(id), LINE_IDLE_MS),
      });
    }
    lineBuffersRef.current = [...buffers];
    setLineBuffers(lineBuffersRef.current);
  }, [fireBuffer]);

  // ── Pointer Events ─────────────────────────────────────────────────────────
  const ignoreTouch = (e: React.PointerEvent) => e.pointerType === 'touch' && !drawWithFinger;

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!active || panDown(e) || ignoreTouch(e)) return;
    (e.target as SVGElement).setPointerCapture(e.pointerId);
    if (commitTimerRef.current) clearTimeout(commitTimerRef.current);
    const rect = svgRef.current!.getBoundingClientRect();
    currentPointsRef.current = [{ x: e.clientX - rect.left, y: e.clientY - rect.top, pressure: e.pressure || 0.5 }];
    clearOverlay();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!active || panMove(e)) return;
    if (currentPointsRef.current.length === 0 || ignoreTouch(e)) return;

    // Un stylus reporta a 120–240 Hz, pero el navegador entrega un pointermove por frame.
    // getCoalescedEvents recupera las muestras intermedias: curvas fieles a la escritura rápida.
    const native = e.nativeEvent as PointerEvent;
    const samples = native.getCoalescedEvents?.() ?? [native];
    const rect = svgRef.current!.getBoundingClientRect();
    for (const s of samples) {
      currentPointsRef.current.push({ x: s.clientX - rect.left, y: s.clientY - rect.top, pressure: s.pressure || 0.5 });
    }
    scheduleRedraw();
  };

  const finishStroke = () => {
    const pts = currentPointsRef.current;
    currentPointsRef.current = [];
    clearOverlay();
    if (pts.length < 2 || drawTool === 'eraser') return;

    // Grosor según la velocidad del trazo: la pluma adelgaza al ir rápido, como la tinta real
    const now = Date.now();
    const dist = Math.hypot(pts[0].x - pts[pts.length - 1].x, pts[0].y - pts[pts.length - 1].y);
    const elapsed = now - (strokesRef.current.at(-1)?.timestamp ?? now - 100);
    const speed = elapsed > 0 ? dist / elapsed : 1;
    const width =
      drawTool === 'fountain' ? Math.max(1, Math.min(10, (strokeWidth * 2) / (speed * 0.8 + 0.5))) :
      drawTool === 'pencil'   ? Math.max(1, Math.min(8, strokeWidth / (speed + 0.1))) :
      strokeWidth;
    const opacity = drawTool === 'marker' ? Math.min(drawOpacity, 0.45) : drawOpacity;

    const stroke: Stroke = { points: pts, width, color: hexOrRgbaWithOpacity(strokeColor, opacity), timestamp: now };
    strokesRef.current = [...strokesRef.current, stroke];
    setStrokes(strokesRef.current);

    if (onOcrText) addStrokeToBuffer(stroke);
    else scheduleCommit();
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!active) return;
    panUp(e);
    if (ignoreTouch(e)) return;
    (e.target as SVGElement).releasePointerCapture(e.pointerId);
    finishStroke();
  };

  return (
    <>
      {/* Indicador de cada línea pendiente de reconocimiento */}
      {lineBuffers.map(buf => (
        <div
          key={buf.id}
          className="ink-line-buffer"
          style={{
            left: buf.boundingBox.minX,
            top: buf.boundingBox.minY,
            width: Math.max(buf.boundingBox.width, 4),
            height: Math.max(buf.boundingBox.height, 4),
          }}
        />
      ))}

      {isPanning && <div className="ink-pan-indicator">Desplazando</div>}

      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        style={{
          position: 'absolute', inset: 0, zIndex: 3,
          pointerEvents: active ? 'all' : 'none',
          touchAction: 'none', // sin esto, el navegador se queda el gesto para hacer scroll
          cursor: drawTool === 'eraser' ? 'cell' : active ? 'crosshair' : 'default',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={() => active && finishStroke()}
      >
        {strokes.map(s => (
          <path key={s.timestamp} d={smoothPoints(s.points)} stroke={s.color} strokeWidth={s.width}
            fill="none" strokeLinecap="round" strokeLinejoin="round" />
        ))}
      </svg>

      <canvas
        ref={overlayRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 4, pointerEvents: 'none' }}
      />
    </>
  );
});

export default InkCanvas;
