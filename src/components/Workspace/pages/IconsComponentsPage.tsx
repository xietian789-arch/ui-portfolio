import type { Project } from '../../../types';
import './pages.css';

interface IconsComponentsPageProps {
  project: Project;
}

const IconsComponentsPage = ({ project }: IconsComponentsPageProps) => {
  const iconNames = ['首页', '搜索', '消息', '设置', '用户', '收藏', '通知', '下载'];

  return (
    <div className="page-container">
      <div className="page-container__header">
        <div className="page-container__label">05 / Icons & Components</div>
        <h2 className="page-container__title">图标与组件</h2>
        <p className="page-container__subtitle">
          {project.name}的图标库与常用组件
        </p>
      </div>
      <div className="page-container__content">
        <div className="icons-page__grid">
          {iconNames.map((name, i) => (
            <div key={i} className="icons-page__item">
              <svg className="icons-page__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9"/>
                <path d="M12 8v8M8 12h8"/>
              </svg>
              <span className="icons-page__name">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IconsComponentsPage;
