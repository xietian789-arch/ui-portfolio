import { useState } from 'react';
import HeroDesk from './components/HeroDesk/HeroDesk';
import Workspace from './components/Workspace/Workspace';
import './App.css';

type View = 'hero' | 'workspace';

function App() {
  const [view, setView] = useState<View>('hero');
  const [selectedProjectId] = useState('litchi');

  const handleEnterWorkspace = () => {
    setView('workspace');
  };

  const handleBackToHero = () => {
    setView('hero');
  };

  return (
    <div className="app">
      {view === 'hero' && <HeroDesk onEnter={handleEnterWorkspace} />}
      {view === 'workspace' && (
        <Workspace
          initialProjectId={selectedProjectId}
          onBack={handleBackToHero}
        />
      )}
    </div>
  );
}

export default App;
