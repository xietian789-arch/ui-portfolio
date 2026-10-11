import './TopBar.css';

interface TopBarProps {
  projectName: string;
  onBack: () => void;
}

const TopBar = ({ projectName, onBack }: TopBarProps) => {
  return (
    <header className="top-bar">
      <div className="top-bar__left">
        <button
          className="top-bar__back"
          onClick={onBack}
          aria-label="返回办公桌"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          <span>返回</span>
        </button>
      </div>

      <div className="top-bar__center">
        <span className="top-bar__label">当前项目</span>
        <span className="top-bar__project">{projectName}</span>
      </div>

      <div className="top-bar__right">
        <nav className="top-bar__nav">
          <button className="top-bar__nav-item">About</button>
          <button className="top-bar__nav-item">Resume</button>
        </nav>
        <div className="top-bar__logo">
          <span className="top-bar__logo-text">Portfolio</span>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
