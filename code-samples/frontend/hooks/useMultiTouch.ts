// Extracto de Beta3M (código fuente privado). Mostrado con fines de portfolio. © 2026 Marc Gálvez & Ignasi Palau.
//
// Mapa de punteros activos: con 2+ dedos en pantalla el gesto pasa a ser desplazamiento
// y el lienzo deja de dibujar. El lápiz (pointerType 'pen') sigue su propio camino.

import React, { useRef, useState, useCallback } from 'react';

export function useMultiTouch(scrollRef?: React.RefObject<HTMLElement | null>) {
  const activePointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const [isPanning, setIsPanning] = useState(false);
  const isPanningRef = useRef(false);

  /** Devuelve true si empieza (o continúa) un desplazamiento con 2+ dedos. */
  const onDown = useCallback((e: React.PointerEvent): boolean => {
    activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (activePointers.current.size >= 2 && !isPanningRef.current) {
      isPanningRef.current = true;
      setIsPanning(true);
      return true;
    }
    return isPanningRef.current;
  }, []);

  /** Devuelve true si el evento lo consume el desplazamiento (el llamador no debe dibujar). */
  const onMove = useCallback((e: React.PointerEvent): boolean => {
    if (!isPanningRef.current || activePointers.current.size < 2) return false;
    const prev = activePointers.current.get(e.pointerId);
    if (prev && scrollRef?.current) {
      scrollRef.current.scrollBy(0, prev.y - e.clientY);
    }
    activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    return true;
  }, [scrollRef]);

  const onUp = useCallback((e: React.PointerEvent) => {
    activePointers.current.delete(e.pointerId);
    if (activePointers.current.size < 2 && isPanningRef.current) {
      isPanningRef.current = false;
      setIsPanning(false);
    }
  }, []);

  return { isPanning, onDown, onMove, onUp };
}
