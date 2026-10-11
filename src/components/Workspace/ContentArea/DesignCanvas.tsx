import { useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import { useDraggable } from '../../../hooks/useDraggable';
import './DesignCanvas.css';

export interface CanvasItem {
  id: string;
  width: number;
  height: number;
  /** 初始 X（相对画布中心的偏移，可为负） */
  initialX?: number;
  /** 初始 Y */
  initialY?: number;
  label?: string;
  render: (selected: boolean) => ReactNode;
}

interface DesignCanvasProps {
  items: CanvasItem[];
  /** 画布内边距 */
  padding?: number;
}

interface Pos {
  x: number;
  y: number;
}

/**
 * Figma 风格的设计画布
 * - 子元素可拖动、可选中
 * - 选中后显示蓝色描边 + 8 个角点
 * - 方向键微调（Shift 加速）
 * - 右侧浮动属性面板显示 X/Y/W/H，可重置位置
 */
const DesignCanvas = ({ items, padding = 24 }: DesignCanvasProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [positions, setPositions] = useState<Record<string, Pos>>(() =>
    Object.fromEntries(items.map((it) => [it.id, { x: it.initialX ?? 0, y: it.initialY ?? 0 }]))
  );

  const canvasRef = useRef<HTMLDivElement>(null);

  // 当 items 变化时补全新位置
  useEffect(() => {
    setPositions((prev) => {
      const next = { ...prev };
      for (const it of items) {
        if (!(it.id in next)) next[it.id] = { x: it.initialX ?? 0, y: it.initialY ?? 0 };
      }
      return next;
    });
  }, [items]);

  const handleMove = useCallback((id: string, x: number, y: number) => {
    setPositions((prev) => ({ ...prev, [id]: { x, y } }));
  }, []);

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).dataset.canvas === 'true') {
      setSelectedId(null);
    }
  }, []);

  const resetSelected = useCallback(() => {
    if (!selectedId) return;
    const it = items.find((i) => i.id === selectedId);
    if (!it) return;
    setPositions((prev) => ({ ...prev, [selectedId]: { x: it.initialX ?? 0, y: it.initialY ?? 0 } }));
  }, [selectedId, items]);

  // 方向键微调选中元素
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!selectedId) return;
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;

      const step = e.shiftKey ? 10 : 1;
      let dx = 0;
      let dy = 0;
      if (e.key === 'ArrowLeft') dx = -step;
      else if (e.key === 'ArrowRight') dx = step;
      else if (e.key === 'ArrowUp') dy = -step;
      else if (e.key === 'ArrowDown') dy = step;
      else return;

      e.preventDefault();
      setPositions((prev) => {
        const cur = prev[selectedId] ?? { x: 0, y: 0 };
        return { ...prev, [selectedId]: { x: cur.x + dx, y: cur.y + dy } };
      });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedId]);

  const selectedItem = items.find((i) => i.id === selectedId);
  const selectedPos = selectedId ? positions[selectedId] : null;

  return (
    <div
      className="design-canvas"
      ref={canvasRef}
      data-canvas="true"
      onClick={handleCanvasClick}
      style={{ padding }}
    >
      {/* 画布网格背景 */}
      <div className="design-canvas__grid" data-canvas="true" />

      {/* 可编辑元素 */}
      {items.map((item) => {
        const pos = positions[item.id] ?? { x: 0, y: 0 };
        return (
          <CanvasElement
            key={item.id}
            item={item}
            x={pos.x}
            y={pos.y}
            selected={selectedId === item.id}
            onSelect={() => handleSelect(item.id)}
            onMove={(x, y) => handleMove(item.id, x, y)}
          />
        );
      })}

      {/* 属性面板 */}
      {selectedItem && selectedPos && (
        <div className="design-canvas__inspector">
          <div className="design-canvas__inspector-title">
            {selectedItem.label || selectedItem.id}
          </div>
          <div className="design-canvas__inspector-row">
            <label>X</label>
            <input
              type="number"
              value={Math.round(selectedPos.x)}
              onChange={(e) =>
                handleMove(selectedItem.id, Number(e.target.value), selectedPos.y)
              }
            />
            <label>Y</label>
            <input
              type="number"
              value={Math.round(selectedPos.y)}
              onChange={(e) =>
                handleMove(selectedItem.id, selectedPos.x, Number(e.target.value))
              }
            />
          </div>
          <div className="design-canvas__inspector-row">
            <label>W</label>
            <span>{selectedItem.width}</span>
            <label>H</label>
            <span>{selectedItem.height}</span>
          </div>
          <button className="design-canvas__inspector-btn" onClick={resetSelected}>
            重置位置
          </button>
        </div>
      )}
    </div>
  );
};

interface CanvasElementProps {
  item: CanvasItem;
  x: number;
  y: number;
  selected: boolean;
  onSelect: () => void;
  onMove: (x: number, y: number) => void;
}

const CanvasElement = ({ item, x, y, selected, onSelect, onMove }: CanvasElementProps) => {
  const { ref, handlers } = useDraggable<HTMLDivElement>({
    selected,
    onSelect,
    onMove,
    positionX: x,
    positionY: y,
  });

  return (
    <div
      ref={ref}
      className={`design-canvas__item ${selected ? 'is-selected' : ''}`}
      style={{ width: item.width, height: item.height }}
      {...handlers}
    >
      {item.render(selected)}
    </div>
  );
};

export default DesignCanvas;
