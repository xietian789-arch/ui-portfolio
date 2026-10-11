import { categories, projects } from '../../../data/projects';
import './Sidebar.css';

interface SidebarProps {
  currentProjectId: string;
  onSelectProject: (projectId: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ currentProjectId, onSelectProject, isOpen, onClose }: SidebarProps) => {
  return (
    <>
      {isOpen !== undefined && (
        <div
          className={`sidebar__overlay ${isOpen ? 'is-open' : ''}`}
          onClick={onClose}
        />
      )}
      <aside className={`sidebar ${isOpen !== undefined ? (isOpen ? 'is-open' : 'is-closed') : ''}`}>
        <div className="sidebar__content">
          {categories.map((category) => (
            <div key={category.id} className="sidebar__category">
              <h3 className="sidebar__category-title">{category.name}</h3>
              <ul className="sidebar__project-list">
                {projects
                  .filter((p) => p.category === category.id)
                  .map((project) => (
                    <li key={project.id}>
                      <button
                        className={`sidebar__project-item ${
                          currentProjectId === project.id ? 'is-active' : ''
                        }`}
                        onClick={() => {
                          onSelectProject(project.id);
                          onClose?.();
                        }}
                      >
                        <span className="sidebar__project-dot" />
                        <span className="sidebar__project-name">
                          {project.name}
                        </span>
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
