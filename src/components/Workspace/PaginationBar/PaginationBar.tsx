import type { ProjectPage } from '../../../types';
import './PaginationBar.css';

interface PaginationBarProps {
  pages: ProjectPage[];
  currentPageIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onJump: (index: number) => void;
}

const PaginationBar = ({
  pages,
  currentPageIndex,
  onPrev,
  onNext,
  onJump,
}: PaginationBarProps) => {
  const isFirst = currentPageIndex === 0;
  const isLast = currentPageIndex === pages.length - 1;

  return (
    <footer className="pagination-bar">
      <button
        className="pagination-bar__btn pagination-bar__btn--prev"
        onClick={onPrev}
        disabled={isFirst}
        aria-label="上一页"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
        <span>上一页</span>
      </button>

      <div className="pagination-bar__progress">
        <div className="pagination-bar__dots">
          {pages.map((page, index) => (
            <button
              key={page.id}
              className={`pagination-bar__dot ${
                index === currentPageIndex ? 'is-active' : ''
              } ${index < currentPageIndex ? 'is-passed' : ''}`}
              onClick={() => onJump(index)}
              aria-label={`跳转到第 ${index + 1} 页：${page.title}`}
              title={page.title}
            />
          ))}
        </div>
        <div className="pagination-bar__numbers">
          <span className="pagination-bar__current">
            {String(currentPageIndex + 1).padStart(2, '0')}
          </span>
          <span className="pagination-bar__divider">/</span>
          <span className="pagination-bar__total">
            {String(pages.length).padStart(2, '0')}
          </span>
          <span className="pagination-bar__title">
            {pages[currentPageIndex]?.title}
          </span>
        </div>
      </div>

      <button
        className="pagination-bar__btn pagination-bar__btn--next"
        onClick={onNext}
        disabled={isLast}
        aria-label="下一页"
      >
        <span>下一页</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>
    </footer>
  );
};

export default PaginationBar;
