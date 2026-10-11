export type PageType =
  | 'cover'
  | 'core-interface'
  | 'flow'
  | 'design-spec'
  | 'icons-components'
  | 'interaction-state'
  | 'summary';

/** 作品展示形态，决定核心界面页的展示方式 */
export type ShowcaseType = 'app' | 'web' | 'video' | 'gallery';

export interface ProjectPage {
  id: string;
  type: PageType;
  title: string;
}

export interface Project {
  id: string;
  name: string;
  category: string;
  description: string;
  showcase: ShowcaseType;
  pages: ProjectPage[];
}

export interface Category {
  id: string;
  name: string;
  projectIds: string[];
}
