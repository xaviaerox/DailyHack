export type ViewType = 'map' | 'archive' | 'editor';

export interface Entry {
  id: string;
  title: string;
  content: string;
  date: string;
  timestamp: number;
  category: string;
  coordinates?: { x: number; y: number };
  quote?: string;
  tags?: string[];
}
