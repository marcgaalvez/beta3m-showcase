// Extracto de Beta3M (código fuente privado). Mostrado con fines de portfolio. © 2026 Marc Gálvez & Ignasi Palau.
//
// Reconocimiento de figuras dibujadas a mano alzada (círculo, rectángulo, triángulo, línea)
// sin IA: solo geometría. Se usa para "enderezar" la figura al mantener el lápiz quieto.

export interface Point { x: number; y: number; }

export type DetectedShape =
  | { type: 'circle';    cx: number; cy: number; r: number }
  | { type: 'rectangle'; x: number; y: number; w: number; h: number }
  | { type: 'triangle';  p1: Point; p2: Point; p3: Point }
  | { type: 'line';      x1: number; y1: number; x2: number; y2: number }
  | { type: 'unknown' }

function simplify(pts: Point[], step = 4): Point[] {
  const out: Point[] = [];
  for (let i = 0; i < pts.length; i += step) out.push(pts[i]);
  const last = pts[pts.length - 1];
  if (out[out.length - 1] !== last) out.push(last);
  return out;
}

function angleDeg(a: Point, b: Point, c: Point): number {
  const ax = a.x - b.x, ay = a.y - b.y;
  const cx2 = c.x - b.x, cy2 = c.y - b.y;
  const dot = ax * cx2 + ay * cy2;
  const mag = Math.hypot(ax, ay) * Math.hypot(cx2, cy2);
  if (mag === 0) return 180;
  return (Math.acos(Math.max(-1, Math.min(1, dot / mag))) * 180) / Math.PI;
}

function findCorners(pts: Point[], threshold = 42): Point[] {
  const result: Point[] = [];
  for (let i = 1; i < pts.length - 1; i++) {
    if (angleDeg(pts[i - 1], pts[i], pts[i + 1]) < (180 - threshold)) {
      result.push(pts[i]);
    }
  }
  return result;
}

// Área encerrada por el trazo (fórmula del lazo/shoelace), cerrando el último punto con el primero
function polygonArea(pts: Point[]): number {
  let a = 0;
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i], q = pts[(i + 1) % pts.length];
    a += p.x * q.y - q.x * p.y;
  }
  return Math.abs(a) / 2;
}

// Vértices aproximados de un triángulo: el par de puntos más alejados y el punto más lejano a esa recta
function triangleVertices(pts: Point[]): [Point, Point, Point] {
  let a = pts[0], b = pts[0], best = -1;
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
      if (d > best) { best = d; a = pts[i]; b = pts[j]; }
    }
  }
  let c = pts[0], far = -1;
  const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
  for (const p of pts) {
    const d = Math.abs((b.x - a.x) * (a.y - p.y) - (a.x - p.x) * (b.y - a.y)) / len;
    if (d > far) { far = d; c = p; }
  }
  return [a, b, c];
}

export function detectShape(points: Point[]): DetectedShape {
  if (points.length < 8) return { type: 'unknown' };

  const xs = points.map(p => p.x), ys = points.map(p => p.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const w = maxX - minX, h = maxY - minY;
  const cx = minX + w / 2, cy = minY + h / 2;

  const start = points[0], end = points[points.length - 1];
  const diagonal = Math.hypot(w, h);
  const isClosed = diagonal > 20 && Math.hypot(end.x - start.x, end.y - start.y) < diagonal * 0.4;

  // ── Figuras cerradas ─────────────────────────────────────────────────────
  // Se clasifican por la proporción de la caja que ocupan: rectángulo ≈ 1, círculo ≈ π/4
  // (0,785), triángulo ≈ 0,5. Antes se comprobaba primero un criterio de "radios parecidos"
  // que también cumplían cuadrados, rectángulos y triángulos: todo acababa siendo un círculo.
  if (isClosed && w > 20 && h > 20) {
    const fill = polygonArea(points) / (w * h);
    const simp = simplify(points);
    const corners = findCorners(simp).length;

    if (fill >= 0.86) return { type: 'rectangle', x: minX, y: minY, w, h };

    if (fill >= 0.68) {
      // Zona intermedia: un rectángulo algo girado también cae aquí; las esquinas deciden
      if (corners >= 3 && corners <= 5) return { type: 'rectangle', x: minX, y: minY, w, h };
      const r = (w + h) / 4;
      const cirError = points.reduce((acc, p) => acc + Math.abs(Math.hypot(p.x - cx, p.y - cy) - r), 0);
      if (cirError / points.length / (r || 1) < 0.35) return { type: 'circle', cx, cy, r };
      return { type: 'unknown' };
    }

    // Un triángulo ocupa como mucho la mitad de su caja, y el triángulo formado por sus
    // tres vértices cubre casi toda su área (en un rombo o un rectángulo girado, ~la mitad)
    if (fill >= 0.3 && fill <= 0.56) {
      // Con todos los puntos (acotado a ~200) para no perder los vértices al simplificar
      const [p1, p2, p3] = triangleVertices(simplify(points, Math.max(1, Math.ceil(points.length / 200))));
      const triArea = Math.abs((p2.x - p1.x) * (p3.y - p1.y) - (p3.x - p1.x) * (p2.y - p1.y)) / 2;
      if (triArea / polygonArea(points) >= 0.8) return { type: 'triangle', p1, p2, p3 };
    }
    return { type: 'unknown' };
  }

  // ── Línea recta ──────────────────────────────────────────────────────────
  if (!isClosed && diagonal > 30) {
    const A = end.y - start.y, B = start.x - end.x;
    const C = A * start.x + B * start.y;
    const norm = Math.hypot(A, B);
    if (norm > 0) {
      const maxDev = points.reduce((acc, p) => Math.max(acc, Math.abs(A * p.x + B * p.y - C) / norm), 0);
      if (maxDev < diagonal * 0.12) {
        return { type: 'line', x1: start.x, y1: start.y, x2: end.x, y2: end.y };
      }
    }
  }

  return { type: 'unknown' };
}
