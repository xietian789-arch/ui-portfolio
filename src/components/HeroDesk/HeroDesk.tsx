import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import './HeroDesk.css';

interface HeroDeskProps {
  onEnter: () => void;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * Hero 3D 办公桌场景
 *
 * 进入工作台的过渡是一条连续的"镜头推进"曲线：
 * - 滚轮向下滚动：进度累积（阻尼平滑），镜头逐步向显示器推进
 * - 点击屏幕：以同一条曲线自动播放到终点
 * - 所有元素淡出/边框收敛均按进度插值，无任何硬切
 */
const HeroDesk = ({ onEnter }: HeroDeskProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const reducedMotion = useReducedMotion();

  const onEnterRef = useRef(onEnter);
  useEffect(() => {
    onEnterRef.current = onEnter;
  }, [onEnter]);

  // 缩放进度（当前值向目标值阻尼趋近）
  const progress = useRef(0);
  const target = useRef(0);
  const entered = useRef(false);
  // 点击进入：由主循环按固定速率推进目标值
  const clickRamp = useRef(false);
  // 视差目标旋转（度）
  const rotTarget = useRef({ x: 0, y: 0 });
  // 屏幕度量：中心相对视口中心的偏移、尺寸、铺满所需的缩放倍数
  const metrics = useRef({ cx: 0, cy: 0, sT: 1.2 });

  // 度量屏幕位置（挂载后与窗口变化时，且尚未开始推进）
  useEffect(() => {
    const measure = () => {
      if (progress.current > 0.01) return;
      const screen = screenRef.current;
      if (!screen) return;
      const r = screen.getBoundingClientRect();
      const cx = r.left + r.width / 2 - window.innerWidth / 2;
      const cy = r.top + r.height / 2 - window.innerHeight / 2;
      const sT = Math.max(window.innerWidth / r.width, window.innerHeight / r.height) * 1.06;
      metrics.current = { cx, cy, sT };
    };
    const id = window.setTimeout(measure, 60);
    window.addEventListener('resize', measure);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener('resize', measure);
    };
  }, []);

  // 缓存需要按进度淡出的元素
  const els = useRef<{
    footer: HTMLElement[];
    props: HTMLElement[];
    parts: HTMLElement[];
    content: HTMLElement | null;
    body: HTMLElement | null;
    screen: HTMLElement | null;
  }>({ footer: [], props: [], parts: [], content: null, body: null, screen: null });

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    els.current = {
      footer: Array.from(
        root.querySelectorAll<HTMLElement>('.hero-desk__footer, .hero-desk__ambient')
      ),
      props: Array.from(
        root.querySelectorAll<HTMLElement>(
          '.room, .desk, .keyboard, .lamp, .plant, .notebook, .mug, .sticky-notes'
        )
      ),
      parts: Array.from(
        root.querySelectorAll<HTMLElement>('.monitor__stand, .monitor__neck, .monitor__camera')
      ),
      content: root.querySelector<HTMLElement>('.monitor__screen-content'),
      body: root.querySelector<HTMLElement>('.monitor__body'),
      screen: root.querySelector<HTMLElement>('.monitor__screen'),
    };
  }, []);

  // 主循环：rAF 驱动；若环境节流 rAF 则用 interval 兜底推进（帧率无关阻尼）
  useEffect(() => {
    if (reducedMotion) return;
    const zoom = zoomRef.current;
    const scene = sceneRef.current;
    if (!zoom || !scene) return;

    const rot = { x: 0, y: 0 };
    let last = performance.now();
    let stopped = false;
    let rafId = 0;

    const update = (dt: number) => {
      // 点击自动播放：目标值匀速推向 1（约 1.2s 走完）
      if (clickRamp.current) {
        target.current = Math.min(1, target.current + dt / 1200);
      }

      // 进度阻尼（帧率无关，时间常数 160ms）
      const k = 1 - Math.exp(-dt / 160);
      const diff = target.current - progress.current;
      progress.current =
        Math.abs(diff) < 0.001 ? target.current : progress.current + diff * k;
      const p = progress.current;

      // 视差阻尼（推进时旋转逐渐归零，保证终点精确居中）
      const k2 = 1 - Math.exp(-dt / 200);
      rot.y += (rotTarget.current.y - rot.y) * k2;
      rot.x += (rotTarget.current.x - rot.x) * k2;
      const rotScale = 1 - p;

      const { cx, cy, sT } = metrics.current;
      const s = 1 + (sT - 1) * p;

      gsap.set(zoom, { scale: s, x: -s * cx, y: -s * cy });
      gsap.set(scene, { rotationY: rot.y * rotScale, rotationX: rot.x * rotScale });

      // 按进度插值淡出：环境文字 → 桌面杂物 → 显示器支架 → 屏幕预览内容
      const oFooter = 1 - clamp01(p / 0.3);
      const oProps = 1 - clamp01((p - 0.1) / 0.4);
      const oParts = 1 - clamp01((p - 0.35) / 0.3);
      const oContent = 1 - clamp01((p - 0.82) / 0.15);

      els.current.footer.forEach((el) => {
        el.style.opacity = String(oFooter);
      });
      els.current.props.forEach((el) => {
        el.style.opacity = String(oProps);
      });
      els.current.parts.forEach((el) => {
        el.style.opacity = String(oParts);
      });
      if (els.current.content) els.current.content.style.opacity = String(oContent);

      // 显示器边框随推进收敛（边框"熔化"进屏幕）
      const kb = clamp01((p - 0.3) / 0.5);
      if (els.current.body) {
        els.current.body.style.padding = `${12 * (1 - kb)}px`;
        els.current.body.style.borderRadius = `${8 * (1 - kb)}px`;
        els.current.body.style.boxShadow = `0 ${10 * (1 - kb)}px ${30 * (1 - kb)}px rgba(0, 0, 0, ${
          0.25 * (1 - kb)
        })`;
      }
      if (els.current.screen) {
        els.current.screen.style.borderRadius = `${3 * (1 - kb)}px`;
      }

      if (p >= 0.995 && !entered.current) {
        entered.current = true;
        onEnterRef.current();
      }
    };

    const step = (now: number) => {
      if (stopped) return;
      const dt = Math.min(now - last, 100);
      last = now;
      update(dt);
      rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);

    // 兜底：rAF 被节流的环境（自动化/后台标签）中由 interval 推进
    const iv = window.setInterval(() => {
      if (stopped) return;
      const now = performance.now();
      if (now - last > 60) {
        const dt = Math.min(now - last, 100);
        last = now;
        update(dt);
      }
    }, 50);

    return () => {
      stopped = true;
      cancelAnimationFrame(rafId);
      window.clearInterval(iv);
    };
  }, [reducedMotion]);

  // 滚轮：累积推进进度
  useEffect(() => {
    if (reducedMotion) return;
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (entered.current) return;
      const dy = e.deltaMode === 1 ? e.deltaY * 33 : e.deltaY;
      target.current = Math.min(1, Math.max(0, target.current + dy * 0.0014));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [reducedMotion]);

  // 鼠标视差（只写目标值，由主循环阻尼应用）
  useEffect(() => {
    if (reducedMotion) return;
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      rotTarget.current = { y: x * 3, x: -y * 2 };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [reducedMotion]);

  const handleScreenClick = () => {
    if (reducedMotion) {
      onEnter();
      return;
    }
    if (entered.current) return;
    // 点击 = 沿同一条曲线自动播放到终点（由主循环匀速推进，约 1.2s）
    clickRamp.current = true;
  };

  return (
    <div className="hero-desk" ref={containerRef}>
      {/* 环境光 */}
      <div className="hero-desk__ambient" />

      {/* 3D 场景 */}
      <div className="hero-desk__scene-wrapper">
        <div className="hero-desk__zoom" ref={zoomRef}>
          <div className="hero-desk__scene" ref={sceneRef}>
            {/* 房间背景 */}
            <div className="room">
              <div className="room__wall room__wall--back" />
              <div className="room__wall room__wall--left" />
              <div className="room__wall room__wall--right" />
              <div className="room__floor" />
            </div>

            {/* 桌子 */}
            <div className="desk">
              <div className="desk__top" />
              <div className="desk__leg desk__leg--fl" />
              <div className="desk__leg desk__leg--fr" />
              <div className="desk__leg desk__leg--bl" />
              <div className="desk__leg desk__leg--br" />
            </div>

            {/* 电脑显示器 */}
            <div className="monitor">
              <div className="monitor__stand" />
              <div className="monitor__neck" />
              <div className="monitor__body">
                <button
                  ref={screenRef}
                  className={`monitor__screen ${isHovered ? 'is-hovered' : ''}`}
                  onClick={handleScreenClick}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  aria-label="滚动滚轮靠近，或点击进入作品集"
                >
                  <div className="monitor__screen-content">
                    <div className="monitor__screen-glow" />
                    <div className="monitor__screen-text">
                      <span className="monitor__screen-title">UI Portfolio</span>
                      <span className="monitor__screen-hint">
                        {isHovered ? '点击进入 →' : '滚动滚轮靠近'}
                      </span>
                    </div>
                    <div className="monitor__screen-preview">
                      <div className="preview__sidebar">
                        <div className="preview__item" />
                        <div className="preview__item preview__item--active" />
                        <div className="preview__item" />
                      </div>
                      <div className="preview__canvas">
                        <div className="preview__card preview__card--1" />
                        <div className="preview__card preview__card--2" />
                        <div className="preview__card preview__card--3" />
                      </div>
                    </div>
                  </div>
                </button>
                <div className="monitor__camera" />
              </div>
            </div>

            {/* 键盘 */}
            <div className="keyboard">
              <div className="keyboard__keys">
                {Array.from({ length: 52 }).map((_, i) => (
                  <div key={i} className="keyboard__key" />
                ))}
              </div>
            </div>

            {/* 台灯 */}
            <div className="lamp">
              <div className="lamp__base" />
              <div className="lamp__arm lamp__arm--lower">
                <div className="lamp__joint lamp__joint--1" />
                <div className="lamp__arm lamp__arm--upper">
                  <div className="lamp__joint lamp__joint--2" />
                  <div className="lamp__head">
                    <div className="lamp__light" />
                  </div>
                </div>
              </div>
            </div>

            {/* 盆栽 */}
            <div className="plant">
              <div className="plant__pot">
                <div className="plant__pot-rim" />
                <div className="plant__pot-body" />
              </div>
              <div className="plant__stem plant__stem--1">
                <div className="plant__leaf plant__leaf--l plant__leaf--1" />
                <div className="plant__leaf plant__leaf--r plant__leaf--2" />
              </div>
              <div className="plant__stem plant__stem--2">
                <div className="plant__leaf plant__leaf--l plant__leaf--3" />
                <div className="plant__leaf plant__leaf--r plant__leaf--4" />
              </div>
              <div className="plant__stem plant__stem--3">
                <div className="plant__leaf plant__leaf--l plant__leaf--5" />
              </div>
            </div>

            {/* 书/笔记本 */}
            <div className="notebook">
              <div className="notebook__cover" />
              <div className="notebook__pages" />
              <div className="notebook__band" />
            </div>

            {/* 咖啡杯 */}
            <div className="mug">
              <div className="mug__body" />
              <div className="mug__handle" />
              <div className="mug__steam mug__steam--1" />
              <div className="mug__steam mug__steam--2" />
              <div className="mug__steam mug__steam--3" />
            </div>

            {/* 便签纸 */}
            <div className="sticky-notes">
              <div className="sticky-note sticky-note--1">
                <div className="sticky-note__line" />
                <div className="sticky-note__line" />
                <div className="sticky-note__line sticky-note__line--short" />
              </div>
              <div className="sticky-note sticky-note--2">
                <div className="sticky-note__line" />
                <div className="sticky-note__line sticky-note__line--short" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部文字 */}
      <div className="hero-desk__footer">
        <p className="hero-desk__name">Design Portfolio</p>
        <div className="hero-desk__scroll-hint">
          <span className="hero-desk__mouse" aria-hidden="true" />
          <p className="hero-desk__instruction">滚动滚轮靠近屏幕 · 点击进入作品集</p>
        </div>
      </div>
    </div>
  );
};

export default HeroDesk;
