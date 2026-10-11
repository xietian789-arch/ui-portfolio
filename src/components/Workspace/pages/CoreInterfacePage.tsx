import type { Project } from '../../../types';
import type { CanvasItem } from '../ContentArea/DesignCanvas';
import DesignCanvas from '../ContentArea/DesignCanvas';
import './pages.css';

interface CoreInterfacePageProps {
  project: Project;
}

/* ============ App 形态：手机 mockup ============ */
const PhoneMockup = ({ label }: { label: string }) => (
  <div className="app-mockup">
    <div className="app-mockup__notch" />
    <div className="app-mockup__screen">
      <div className="app-mockup__status" />
      <div className="app-mockup__bar" />
      <div className="app-mockup__card" />
      <div className="app-mockup__card app-mockup__card--sm" />
    </div>
    <div className="app-mockup__home" />
    <span className="app-mockup__label">{label}</span>
  </div>
);

/* ============ Web 形态：浏览器窗口 mockup ============ */
const WebMockup = ({ label }: { label: string }) => (
  <div className="web-mockup">
    <div className="web-mockup__topbar">
      <span className="web-mockup__dot" />
      <span className="web-mockup__dot" />
      <span className="web-mockup__dot" />
      <div className="web-mockup__url">{label}</div>
    </div>
    <div className="web-mockup__body">
      <div className="web-mockup__hero" />
      <div className="web-mockup__row">
        <div className="web-mockup__col" />
        <div className="web-mockup__col" />
        <div className="web-mockup__col" />
      </div>
      <div className="web-mockup__text" />
    </div>
  </div>
);

/* ============ Video 形态：播放器 + 分镜 ============ */
const VideoMockup = ({ label }: { label: string }) => (
  <div className="video-mockup">
    <div className="video-mockup__screen">
      <div className="video-mockup__play">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
      <div className="video-mockup__progress" />
      <span className="video-mockup__label">{label}</span>
    </div>
    <div className="video-mockup__timeline">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="video-mockup__frame" />
      ))}
    </div>
  </div>
);

/* ============ Gallery 形态：小作品卡片 ============ */
const GalleryMockup = ({ label, hue }: { label: string; hue: number }) => (
  <div className="gallery-mockup" style={{ background: `hsl(${hue}, 30%, 92%)` }}>
    <div
      className="gallery-mockup__thumb"
      style={{ background: `hsl(${hue}, 50%, 70%)` }}
    />
    <span className="gallery-mockup__label">{label}</span>
  </div>
);

const CoreInterfacePage = ({ project }: CoreInterfacePageProps) => {
  const items: CanvasItem[] = (() => {
    switch (project.showcase) {
      case 'app': {
        const labels = ['首页', '声音广场', '播客详情', '个人中心'];
        return labels.map((l, i) => ({
          id: `app-${i}`,
          width: 180,
          height: 360,
          label: l,
          initialX: (i - 1.5) * 210,
          initialY: (i % 2 === 0 ? -1 : 1) * 24,
          render: () => <PhoneMockup label={l} />,
        }));
      }
      case 'web': {
        const labels = ['stellar.space', 'stellar.space/explore', 'stellar.space/about'];
        return labels.map((l, i) => ({
          id: `web-${i}`,
          width: 420,
          height: 280,
          label: l,
          initialX: (i - 1) * 460,
          initialY: (i - 1) * 30,
          render: () => <WebMockup label={l} />,
        }));
      }
      case 'video': {
        const labels = ['预告片', '分镜 01-04'];
        return [
          {
            id: 'video-main',
            width: 520,
            height: 300,
            label: labels[0],
            initialX: -40,
            initialY: -30,
            render: () => <VideoMockup label={labels[0]} />,
          },
        ];
      }
      case 'gallery': {
        const items = [
          { name: '海报 A', hue: 20 },
          { name: '图标集', hue: 200 },
          { name: '字体实验', hue: 280 },
          { name: '插画', hue: 140 },
          { name: '动效', hue: 0 },
          { name: '包装', hue: 45 },
        ];
        return items.map((it, i) => ({
          id: `g-${i}`,
          width: 150,
          height: 150,
          label: it.name,
          initialX: ((i % 3) - 1) * 180,
          initialY: (Math.floor(i / 3) - 0.5) * 180,
          render: () => <GalleryMockup label={it.name} hue={it.hue} />,
        }));
      }
      default:
        return [];
    }
  })();

  const showcaseLabel: Record<string, string> = {
    app: 'App Interface',
    web: 'Web Page',
    video: 'Video Storyboard',
    gallery: 'Mini Works',
  };

  return (
    <div className="page-container">
      <div className="page-container__header">
        <div className="page-container__label">02 / Core Interface</div>
        <h2 className="page-container__title">
          核心界面
          <span className="page-container__showcase-tag">{showcaseLabel[project.showcase]}</span>
        </h2>
        <p className="page-container__subtitle">
          {project.name} · 拖动元素可重新排版，点击选中后用方向键微调
        </p>
      </div>
      <div className="page-container__content page-container__content--canvas">
        <DesignCanvas items={items} padding={40} />
      </div>
    </div>
  );
};

export default CoreInterfacePage;
