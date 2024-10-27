import type { Analytics as PrismaAnalytics } from "@prisma/client";

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string;
}

export interface CommerceSettings {
  enableCommerce: boolean;
  commissionRate: number;
  allowAffiliates: boolean;
}

export interface ComponentData {
  type: string;
  content: string;
  style?: Record<string, string>;
}

export interface Version {
  id: string;
  content: Json;
  title: string;
  template?: string;
  customCSS?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category?: string;
}

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    scale: number;
  };
  spacing: {
    unit: number;
    scale: number;
  };
}

export interface Analytics extends PrismaAnalytics {
  data?: {
    sources?: Record<string, number>;
    devices?: Record<string, number>;
    pages?: Record<string, number>;
  };
}

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];
