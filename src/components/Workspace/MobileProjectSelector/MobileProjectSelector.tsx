import { projects } from '../../../data/projects';
import './MobileProjectSelector.css';

interface MobileProjectSelectorProps {
  currentProjectId: string;
  onSelectProject: (projectId: string) => void;
  onOpenMenu: () => void;
}

const MobileProjectSelector = ({
  currentProjectId,
  onSelectProject,
  onOpenMenu,
}: MobileProjectSelectorProps) => {
  return (
    <div className="mobile-project-selector">
      <div className="mobile-project-selector__scroll">
        {projects.map((project) => (
          <button
            key={project.id}
            className={`mobile-project-selector__chip ${
              project.id === currentProjectId ? 'is-active' : ''
            }`}
            onClick={() => onSelectProject(project.id)}
          >
            {project.name}
          </button>
        ))}
        <button
          className="mobile-project-selector__more"
          onClick={onOpenMenu}
          aria-label="更多项目"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1"/>
            <circle cx="19" cy="12" r="1"/>
            <circle cx="5" cy="12" r="1"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MobileProjectSelector;
