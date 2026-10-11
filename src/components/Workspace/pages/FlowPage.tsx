import { useState } from 'react';
import type { Project } from '../../../types';
import './pages.css';

interface FlowPageProps {
  project: Project;
}

const FlowPage = ({ project }: FlowPageProps) => {
  const [activeIndex, setActiveIndex] = useState(1);
  const nodes = ['启动', '首页', '列表', '详情', '操作', '完成'];

  return (
    <div className="page-container">
      <div className="page-container__header">
        <div className="page-container__label">03 / User Flow</div>
        <h2 className="page-container__title">页面流程</h2>
        <p className="page-container__subtitle">
          {project.name}的核心用户操作路径 · 点击节点查看
        </p>
      </div>
      <div className="page-container__content">
        <div className="flow-page__diagram">
          {nodes.map((node, i) => (
            <div key={i} className="flow-page__node-wrapper">
              <button
                className={`flow-page__node ${
                  i === activeIndex ? 'flow-page__node--active' : ''
                }`}
                onClick={() => setActiveIndex(i)}
              >
                {node}
              </button>
              {i < nodes.length - 1 && <div className="flow-page__arrow" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlowPage;
