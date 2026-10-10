export interface WorkspaceFile {
  id: string;
  name: string;
  content: string;
  updatedAt: number;
}

export interface HeadingItem {
  id: string;
  level: number;
  text: string;
  index?: number;
}
