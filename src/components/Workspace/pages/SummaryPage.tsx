import type { Project } from '../../../types';
import './pages.css';

interface SummaryPageProps {
  project: Project;
}

const SummaryPage = ({ project }: SummaryPageProps) => {
  return (
    <div className="page-container">
      <div className="page-container__header">
        <div className="page-container__label">07 / Summary</div>
        <h2 className="page-container__title">项目总结</h2>
        <p className="page-container__subtitle">
          {project.name}项目回顾与成果
        </p>
      </div>
      <div className="page-container__content">
        <div className="summary-page__content">
          <div className="summary-page__stats">
            <div className="summary-page__stat">
              <div className="summary-page__stat-number">7</div>
              <div className="summary-page__stat-label">设计页面</div>
            </div>
            <div className="summary-page__stat">
              <div className="summary-page__stat-number">30+</div>
              <div className="summary-page__stat-label">组件设计</div>
            </div>
            <div className="summary-page__stat">
              <div className="summary-page__stat-number">100%</div>
              <div className="summary-page__stat-label">设计交付</div>
            </div>
          </div>

          <div className="summary-page__section">
            <div className="summary-page__section-title">项目概述</div>
            <p className="summary-page__text">
              {project.description} 本项目致力于打造简洁高效的用户体验，
              通过系统化的设计方法确保产品的一致性与可用性。
            </p>
          </div>

          <div className="summary-page__section">
            <div className="summary-page__section-title">设计亮点</div>
            <p className="summary-page__text">
              · 清晰的信息架构与页面层级
              <br />
              · 统一的设计语言与组件体系
              <br />
              · 流畅自然的交互动效体验
              <br />
              · 多端适配的响应式设计方案
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;
