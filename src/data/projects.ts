import type { Project, Category, ProjectPage } from '../types';

const createPages = (projectId: string): ProjectPage[] => [
  { id: `${projectId}-cover`, type: 'cover', title: '项目封面' },
  { id: `${projectId}-core`, type: 'core-interface', title: '核心界面' },
  { id: `${projectId}-flow`, type: 'flow', title: '页面流程' },
  { id: `${projectId}-spec`, type: 'design-spec', title: '设计规范' },
  { id: `${projectId}-icons`, type: 'icons-components', title: '图标与组件' },
  { id: `${projectId}-state`, type: 'interaction-state', title: '交互状态' },
  { id: `${projectId}-summary`, type: 'summary', title: '项目总结' },
];

export const projects: Project[] = [
  {
    id: 'litchi',
    name: '荔枝app出海',
    category: 'app',
    showcase: 'app',
    description: '荔枝音频社交平台的海外版本设计，聚焦声音社交与播客生态，打造全球化听觉社区体验。',
    pages: createPages('litchi'),
  },
  {
    id: 'shunshun',
    name: '顺顺app',
    category: 'app',
    showcase: 'app',
    description: '生活服务类应用，致力于让日常生活中的各项事务变得更顺畅、更高效。',
    pages: createPages('shunshun'),
  },
  {
    id: 'stellar',
    name: '星际探索',
    category: 'exploration',
    showcase: 'web',
    description: '太空探索主题的沉浸式体验设计，带你穿越星系，探索宇宙的无限可能。',
    pages: createPages('stellar'),
  },
  {
    id: 'late-self',
    name: '迟来的自己',
    category: 'emotional',
    showcase: 'video',
    description: '一款关注内心成长与自我对话的情感类产品，在时光中遇见更好的自己。',
    pages: createPages('late-self'),
  },
  {
    id: 'others',
    name: '其他作品',
    category: 'misc',
    showcase: 'gallery',
    description: '各类设计探索与实验性项目集合，记录设计路上的每一次尝试。',
    pages: createPages('others'),
  },
];

export const categories: Category[] = [
  { id: 'app', name: 'App 设计', projectIds: ['litchi', 'shunshun'] },
  { id: 'exploration', name: '探索项目', projectIds: ['stellar'] },
  { id: 'emotional', name: '情感设计', projectIds: ['late-self'] },
  { id: 'misc', name: '其他作品', projectIds: ['others'] },
];

export const getProjectById = (id: string): Project | undefined =>
  projects.find((p) => p.id === id);

export const getProjectsByCategory = (categoryId: string): Project[] =>
  projects.filter((p) => p.category === categoryId);
