export interface ActionData {
  error?: string;
  success?: boolean;
  fields?: Record<string, string>;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

export interface MediaItem {
  type: 'music' | 'video' | 'social' | 'podcast';
  title: string;
  url: string;
}
