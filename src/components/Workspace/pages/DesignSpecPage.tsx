import type { Project } from '../../../types';
import './pages.css';

interface DesignSpecPageProps {
  project: Project;
}

const DesignSpecPage = ({ project }: DesignSpecPageProps) => {
  const colors = [
    { name: '主色', color: '#1a1a1a' },
    { name: '辅色', color: '#666666' },
    { name: '背景', color: '#fafafa' },
    { name: '边框', color: '#e5e5e5' },
  ];

  return (
    <div className="page-container">
      <div className="page-container__header">
        <div className="page-container__label">04 / Design System</div>
        <h2 className="page-container__title">设计规范</h2>
        <p className="page-container__subtitle">
          {project.name}的视觉设计系统与规范
        </p>
      </div>
      <div className="page-container__content">
        <div className="spec-page__grid">
          <div className="spec-page__section">
            <div className="spec-page__section-title">色彩规范</div>
            <div className="spec-page__colors">
              {colors.map((c, i) => (
                <div key={i} className="spec-page__color">
                  <div
                    className="spec-page__color-swatch"
                    style={{ background: c.color }}
                  />
                  <span className="spec-page__color-name">{c.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="spec-page__section">
            <div className="spec-page__section-title">字体规范</div>
            <div className="spec-page__typography">
              <div>
                <div className="spec-page__type-sample" style={{ fontSize: '24px', fontWeight: 700 }}>
                  标题 24px Bold
                </div>
                <div className="spec-page__type-label">H1 / Display</div>
              </div>
              <div>
                <div className="spec-page__type-sample" style={{ fontSize: '16px', fontWeight: 500 }}>
                  正文 16px Medium
                </div>
                <div className="spec-page__type-label">Body / Regular</div>
              </div>
              <div>
                <div className="spec-page__type-sample" style={{ fontSize: '12px', fontWeight: 400 }}>
                  辅助 12px Regular
                </div>
                <div className="spec-page__type-label">Caption / Small</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignSpecPage;
