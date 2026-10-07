// Extracto de Beta3M (código fuente privado). Mostrado con fines de portfolio. © 2026 Marc Gálvez & Ignasi Palau.
//
// Utilidades puras del lienzo de tinta: geometría de trazos, render para OCR
// y heurística para distinguir fórmulas de texto.

export interface Point {
  x: number;
  y: number;
  pressure: number;
}

export interface Stroke {
  points: Point[];
  width: number;
  color: string;
  timestamp: number;
}

/** Puntos → path SVG suavizado con curvas cuadráticas (control = punto real, extremo = punto medio). */
export function smoothPoints(points: { x: number; y: number }[]): string {
  if (points.length < 2) return '';
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length - 1; i++) {
    const mx = (points[i].x + points[i + 1].x) / 2;
    const my = (points[i].y + points[i + 1].y) / 2;
    path += ` Q ${points[i].x} ${points[i].y} ${mx} ${my}`;
  }
  return path;
}
// ── Cajas envolventes ─────────────────────────────────────────────────────────

export function getStrokeBbox(stroke: Stroke) {
  const xs = stroke.points.map(p => p.x);
  const ys = stroke.points.map(p => p.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  return { minX, minY, width: Math.max(...xs) - minX, height: Math.max(...ys) - minY };
}

export function mergeBboxes(
  a: { minX: number; minY: number; width: number; height: number },
  b: { minX: number; minY: number; width: number; height: number }
) {
  const minX = Math.min(a.minX, b.minX);
  const minY = Math.min(a.minY, b.minY);
  const maxX = Math.max(a.minX + a.width, b.minX + b.width);
  const maxY = Math.max(a.minY + a.height, b.minY + b.height);
  return { minX, minY, width: maxX - minX, height: maxY - minY };
}

export function renderBufferToCanvas(strokes: Stroke[], padding = 20): {
  base64: string; cx: number; cy: number;
} | null {
  const allPts = strokes.flatMap(s => s.points);
  if (allPts.length === 0) return null;
  const xs = allPts.map(p => p.x), ys = allPts.map(p => p.y);
  const mnX = Math.min(...xs) - padding;
  const mnY = Math.min(...ys) - padding;
  const cw = Math.max(Math.max(...xs) - mnX + padding, 32);
  const ch = Math.max(Math.max(...ys) - mnY + padding, 32);
  const canvas = document.createElement('canvas');
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, cw, ch);
  ctx.strokeStyle = '#fff';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  for (const stroke of strokes) {
    const pts = stroke.points;
    if (pts.length < 2) continue;
    ctx.lineWidth = stroke.width;
    ctx.beginPath();
    ctx.moveTo(pts[0].x - mnX, pts[0].y - mnY);
    for (let i = 1; i < pts.length - 1; i++) {
      const mx = (pts[i].x + pts[i + 1].x) / 2 - mnX;
      const my = (pts[i].y + pts[i + 1].y) / 2 - mnY;
      ctx.quadraticCurveTo(pts[i].x - mnX, pts[i].y - mnY, mx, my);
    }
    ctx.lineTo(pts[pts.length - 1].x - mnX, pts[pts.length - 1].y - mnY);
    ctx.stroke();
  }
  return {
    base64: canvas.toDataURL('image/png').replace(/^data:image\/\w+;base64,/, ''),
    cx: mnX + cw / 2,
    cy: mnY + ch / 2,
  };
}

export function looksLikeMath(strokes: Stroke[]): boolean {
  if (strokes.length === 0) return false;

  const allPts = strokes.flatMap(s => s.points);
  const xs = allPts.map(p => p.x), ys = allPts.map(p => p.y);
  const totalW = Math.max(...xs) - Math.min(...xs) + 0.1;
  const totalH = Math.max(...ys) - Math.min(...ys) + 0.1;

  let horizontalCount = 0;
  let smallCircleCount = 0;
  let verticalCount = 0;

  for (const s of strokes) {
    const sxs = s.points.map(p => p.x);
    const sys = s.points.map(p => p.y);
    const sw = Math.max(...sxs) - Math.min(...sxs);
    const sh = Math.max(...sys) - Math.min(...sys) + 0.1;
    const aspect = sw / sh;

    if (aspect > 5 && sh < 20) horizontalCount++;
    if (aspect > 0.5 && aspect < 2 && sw < totalW * 0.3 && sh < totalH * 0.5) smallCircleCount++;
    if (aspect < 0.3 && sh > 20) verticalCount++;
  }

  if (horizontalCount >= 2) return true;
  if (strokes.length >= 4 && smallCircleCount >= 2) return true;
  if (totalH / totalW > 1.5 && strokes.length >= 3) return true;

  if (strokes.length === 1) {
    const pts = strokes[0].points;
    let equalSignPattern = 0;
    for (let i = 5; i < pts.length - 5; i++) {
      const dy = Math.abs(pts[i].y - pts[i - 5].y);
      const dx = Math.abs(pts[i].x - pts[i - 5].x);
      if (dx > dy * 3) equalSignPattern++;
    }
    if (equalSignPattern > pts.length * 0.6) return true;
  }

  return false;
}

export function getBoundingBox(strokes: Stroke[]) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const s of strokes) {
    for (const p of s.points) {
      if (p.x < minX) minX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.x > maxX) maxX = p.x;
      if (p.y > maxY) maxY = p.y;
    }
  }
  const PAD = 8;
  return {
    minX: minX - PAD,
    minY: minY - PAD,
    width: (maxX - minX) + PAD * 2,
    height: (maxY - minY) + PAD * 2,
  };
}

export function normalizeSvgData(strokes: Stroke[], offsetX: number, offsetY: number): string {
  return strokes
    .map(s => {
      const normalized = s.points.map(p => ({ x: p.x - offsetX, y: p.y - offsetY }));
      return smoothPoints(normalized);
    })
    .filter(Boolean)
    .join(' ');
}

// ── Color ─────────────────────────────────────────────────────────────────────

export function hexOrRgbaWithOpacity(color: string, opacity: number): string {
  if (opacity >= 1) return color;
  if (color.startsWith('rgba')) {
    return color.replace(/rgba\(([^,]+),([^,]+),([^,]+),[^)]+\)/, (_, r, g, b) =>
      `rgba(${r},${g},${b},${opacity})`
    );
  }
  if (color.startsWith('#') && color.length === 7) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${opacity})`;
  }
  return color;
}
