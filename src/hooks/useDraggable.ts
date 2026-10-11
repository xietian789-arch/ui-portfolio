import { useRef, useCallback, useEffect } from 'react';
import gsap from 'gsap';

/**
 * 可拖拽元素 Hook（增强版）
 * - 支持外部受控位置（positionX / positionY）
 * - 支持选中态（selected）与选中回调（onSelect）
 * - 拖动过程中通过 onMove 实时上报位置
 * - 点击（非拖动）触发 onSelect
 */
export interface UseDraggableOptions {
  selected?: boolean;
  onSelect?: () => void;
  onMove?: (x: number, y: number) => void;
  positionX?: number;
  positionY?: number;
}

export const useDraggable = <T extends HTMLElement>(
  options: UseDraggableOptions = {}
) => {
  const { selected, onSelect, onMove, positionX = 0, positionY = 0 } = options;
  const elementRef = useRef<T>(null);
  const stateRef = useRef({
    isDragging: false,
    moved: false,
    pointerId: -1,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    rotation: 0,
  });

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      const state = stateRef.current;
      if (!state.isDragging || e.pointerId !== state.pointerId) return;

      const el = elementRef.current;
      if (!el) return;

      const dx = e.clientX - state.startX;
      const dy = e.clientY - state.startY;

      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) state.moved = true;

      const nx = state.originX + dx;
      const ny = state.originY + dy;

      gsap.set(el, {
        x: nx,
        y: ny,
        rotation: state.rotation,
      });
      onMove?.(nx, ny);
    },
    [onMove]
  );

  const endDrag = useCallback(
    (e: PointerEvent) => {
      const state = stateRef.current;
      if (!state.isDragging || e.pointerId !== state.pointerId) return;

      state.isDragging = false;
      state.pointerId = -1;
      elementRef.current?.classList.remove('is-dragging');
      state.moved = false;

      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUpRef.current);
      window.removeEventListener('pointercancel', handlePointerUpRef.current);
    },
    [handlePointerMove]
  );

  const handlePointerUpRef = useRef(endDrag);
  handlePointerUpRef.current = endDrag;

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<T>) => {
      const el = elementRef.current;
      if (!el) return;

      if (e.pointerType === 'mouse' && e.button !== 0) return;

      e.stopPropagation();

      const state = stateRef.current;
      state.isDragging = true;
      state.moved = false;
      state.pointerId = e.pointerId;
      state.startX = e.clientX;
      state.startY = e.clientY;

      // 固化当前位置（外部受控的 positionX/Y 优先，否则读取实际 transform）
      state.originX = positionX;
      state.originY = positionY;
      state.rotation = 0;

      gsap.set(el, { x: positionX, y: positionY });
      el.classList.add('is-dragging');

      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUpRef.current);
      window.addEventListener('pointercancel', handlePointerUpRef.current);
    },
    [handlePointerMove, positionX, positionY]
  );

  // 外部位置变化时同步
  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;
    if (stateRef.current.isDragging) return;
    gsap.set(el, { x: positionX, y: positionY });
  }, [positionX, positionY]);

  useEffect(() => {
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUpRef.current);
      window.removeEventListener('pointercancel', handlePointerUpRef.current);
    };
  }, [handlePointerMove]);

  return {
    ref: elementRef,
    handlers: {
      onPointerDown: handlePointerDown,
      onClick: onSelect
        ? ((e: React.MouseEvent<T>) => {
            e.stopPropagation();
            onSelect();
          })
        : undefined,
    },
    selected,
  };
};
