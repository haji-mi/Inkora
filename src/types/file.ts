export interface WorkspaceFile {
  id: string;
  name: string;
  content: string;
  updatedAt: number;
  path?: string;
}

export interface HeadingItem {
  id: string;
  level: number;
  text: string;
  index?: number;
}
