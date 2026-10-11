import { useState, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { getProjectById } from '../../data/projects';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import TopBar from './TopBar/TopBar';
import Sidebar from './Sidebar/Sidebar';
import ContentArea from './ContentArea/ContentArea';
import PaginationBar from './PaginationBar/PaginationBar';
import MobileProjectSelector from './MobileProjectSelector/MobileProjectSelector';
import './Workspace.css';

interface WorkspaceProps {
  initialProjectId: string;
  onBack: () => void;
}

const Workspace = ({ initialProjectId, onBack }: WorkspaceProps) => {
  const [currentProjectId, setCurrentProjectId] = useState(initialProjectId);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const reducedMotion = useReducedMotion();

  const project = getProjectById(currentProjectId);

  // 检测移动端
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 入场动画
  useEffect(() => {
    if (reducedMotion) return;
    const workspace = document.querySelector('.workspace');
    if (!workspace) return;

    gsap.fromTo(
      workspace,
      { opacity: 0 },
      { opacity: 1, duration: 0.45, ease: 'power1.out' }
    );
  }, [reducedMotion]);

  const goToPage = useCallback(
    (index: number) => {
      if (!project) return;
      if (index < 0 || index >= project.pages.length) return;
      setDirection(index > currentPageIndex ? 'next' : 'prev');
      setCurrentPageIndex(index);
    },
    [project, currentPageIndex]
  );

  const goNext = useCallback(() => {
    if (!project) return;
    if (currentPageIndex < project.pages.length - 1) {
      goToPage(currentPageIndex + 1);
    }
  }, [project, currentPageIndex, goToPage]);

  const goPrev = useCallback(() => {
    if (currentPageIndex > 0) {
      goToPage(currentPageIndex - 1);
    }
  }, [currentPageIndex, goToPage]);

  const handleSelectProject = useCallback((projectId: string) => {
    setCurrentProjectId(projectId);
    setCurrentPageIndex(0);
    setDirection('next');
  }, []);

  const handleBack = useCallback(() => {
    if (reducedMotion) {
      onBack();
      return;
    }

    const workspace = document.querySelector('.workspace');
    if (!workspace) {
      onBack();
      return;
    }

    // 动画兜底：即使 tween 被环境节流，0.8s 内也必须返回
    const fallback = window.setTimeout(onBack, 800);
    gsap.to(workspace, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        window.clearTimeout(fallback);
        onBack();
      },
    });
  }, [onBack, reducedMotion]);

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 忽略输入框中的键盘事件
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // 设计画布中有选中元素时，方向键交给画布微调（Figma 式编辑），不翻页
      if (
        document.querySelector('.design-canvas__item.is-selected') &&
        (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'ArrowDown')
      ) {
        return;
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev, handleBack]);

  if (!project) return null;

  return (
    <div className="workspace">
      <TopBar projectName={project.name} onBack={handleBack} />

      <div className="workspace__body">
        {!isMobile && (
          <Sidebar
            currentProjectId={currentProjectId}
            onSelectProject={handleSelectProject}
          />
        )}

        {/* 移动端侧边栏抽屉 */}
        {isMobile && (
          <Sidebar
            currentProjectId={currentProjectId}
            onSelectProject={handleSelectProject}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        )}

        <div className="workspace__main">
          {isMobile && (
            <MobileProjectSelector
              currentProjectId={currentProjectId}
              onSelectProject={handleSelectProject}
              onOpenMenu={() => setSidebarOpen(true)}
            />
          )}
          <ContentArea
            project={project}
            currentPageIndex={currentPageIndex}
            direction={direction}
          />
          <PaginationBar
            pages={project.pages}
            currentPageIndex={currentPageIndex}
            onPrev={goPrev}
            onNext={goNext}
            onJump={goToPage}
          />
        </div>
      </div>
    </div>
  );
};

export default Workspace;
