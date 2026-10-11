import type { Project } from '../../../types';
import './pages.css';

interface CoverPageProps {
  project: Project;
}

const showcaseLabel: Record<string, string> = {
  app: 'App Design',
  web: 'Web Design',
  video: 'Motion & Video',
  gallery: 'Selected Works',
};

const showcaseHint: Record<string, string> = {
  app: '移动端应用界面设计',
  web: '网页与响应式设计',
  video: '动态影像与分镜',
  gallery: '小作品合集',
};

const CoverPage = ({ project }: CoverPageProps) => {
  return (
    <div className="page-container">
      <div className="cover-page">
        <div className="cover-page__deco cover-page__deco--1" />
        <div className="cover-page__deco cover-page__deco--2" />

        <div className="cover-page__badge">{showcaseLabel[project.showcase]}</div>
        <h1 className="cover-page__title">{project.name}</h1>
        <p className="cover-page__description">{project.description}</p>
        <div className={`cover-page__mockup cover-page__mockup--${project.showcase}`}>
          {showcaseHint[project.showcase]}
        </div>
      </div>
    </div>
  );
};

export default CoverPage;
