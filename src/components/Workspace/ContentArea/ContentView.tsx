import type { Project, ProjectPage } from '../../../types';
import CoverPage from '../pages/CoverPage';
import CoreInterfacePage from '../pages/CoreInterfacePage';
import FlowPage from '../pages/FlowPage';
import DesignSpecPage from '../pages/DesignSpecPage';
import IconsComponentsPage from '../pages/IconsComponentsPage';
import InteractionStatePage from '../pages/InteractionStatePage';
import SummaryPage from '../pages/SummaryPage';

interface ContentViewProps {
  project: Project;
  page: ProjectPage;
}

const ContentView = ({ project, page }: ContentViewProps) => {
  const renderPage = () => {
    switch (page.type) {
      case 'cover':
        return <CoverPage project={project} />;
      case 'core-interface':
        return <CoreInterfacePage project={project} />;
      case 'flow':
        return <FlowPage project={project} />;
      case 'design-spec':
        return <DesignSpecPage project={project} />;
      case 'icons-components':
        return <IconsComponentsPage project={project} />;
      case 'interaction-state':
        return <InteractionStatePage project={project} />;
      case 'summary':
        return <SummaryPage project={project} />;
      default:
        return null;
    }
  };

  return (
    <div className="content-view" key={`${project.id}-${page.id}`}>
      {renderPage()}
    </div>
  );
};

export default ContentView;
