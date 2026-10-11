import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import type { Project } from '../../../types';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import ContentView from './ContentView';
import './ContentArea.css';

interface ContentAreaProps {
  project: Project;
  currentPageIndex: number;
  direction: 'next' | 'prev';
}

const ContentArea = ({ project, currentPageIndex, direction }: ContentAreaProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const page = project.pages[currentPageIndex];

  useEffect(() => {
    if (reducedMotion || !containerRef.current) return;

    const content = containerRef.current.querySelector('.content-view');
    if (!content) return;

    gsap.fromTo(
      content,
      {
        opacity: 0,
        x: direction === 'next' ? 30 : -30,
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.35,
        ease: 'power2.out',
      }
    );
  }, [currentPageIndex, project.id, direction, reducedMotion]);

  return (
    <main className="content-area" ref={containerRef}>
      <ContentView project={project} page={page} />
    </main>
  );
};

export default ContentArea;
