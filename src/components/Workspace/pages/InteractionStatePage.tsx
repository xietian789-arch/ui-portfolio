import { useState } from 'react';
import type { Project } from '../../../types';
import './pages.css';

type StateType = 'default' | 'selected' | 'completed';

interface InteractionStatePageProps {
  project: Project;
}

const InteractionStatePage = ({ project }: InteractionStatePageProps) => {
  const [currentState, setCurrentState] = useState<StateType>('default');

  const states: { key: StateType; label: string }[] = [
    { key: 'default', label: '默认' },
    { key: 'selected', label: '选中' },
    { key: 'completed', label: '完成' },
  ];

  const statusLabels: Record<StateType, string> = {
    default: '待处理',
    selected: '进行中',
    completed: '已完成',
  };

  return (
    <div className="page-container">
      <div className="page-container__header">
        <div className="page-container__label">06 / Interaction States</div>
        <h2 className="page-container__title">交互状态</h2>
        <p className="page-container__subtitle">
          {project.name}组件的不同交互状态展示
        </p>
      </div>
      <div className="page-container__content">
        <div className="state-page__demo">
          <div className="state-page__tabs" role="tablist">
            {states.map((state) => (
              <button
                key={state.key}
                role="tab"
                aria-selected={currentState === state.key}
                className={`state-page__tab ${
                  currentState === state.key ? 'is-active' : ''
                }`}
                onClick={() => setCurrentState(state.key)}
              >
                {state.label}
              </button>
            ))}
          </div>

          <div className="state-page__component">
            <div className="state-page__component-title">组件状态演示</div>
            <div className={`state-card state-card--${currentState}`}>
              <div className="state-card__header">
                <span className="state-card__title">任务卡片示例</span>
                <span className="state-card__status">
                  {statusLabels[currentState]}
                </span>
              </div>
              <p className="state-card__desc">
                这是一个可交互的UI组件示例，展示默认、选中和完成三种状态下的视觉表现。
              </p>
              <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                <div className="state-card__check">
                  {currentState === 'completed' && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractionStatePage;
