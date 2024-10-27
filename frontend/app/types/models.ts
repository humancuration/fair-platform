import type { Prisma } from "@prisma/client";

// Utility type to get the return type of Prisma includes
type GetIncludeType<T extends (...args: any) => any> = Awaited<ReturnType<T>>;

// Define base Prisma types with their relations
export type User = Prisma.UserGetPayload<{
  include: {
    minsites: true;
    uploads: true;
    templates: true;
  }
}>;

export type Minsite = Prisma.MinsiteGetPayload<{
  include: {
    versions: true;
    uploads: true;
    affiliateLinks: true;
    analytics: true;
  }
}>;

export type MinsiteVersion = Prisma.MinsiteVersionGetPayload<{
  include: { minsite: true }
}>;

export type Upload = Prisma.UploadGetPayload<{
  include: { minsite: true; user: true }
}>;

export type Template = Prisma.TemplateGetPayload<{
  include: { user: true }
}>;

export type AffiliateLink = Prisma.AffiliateLinkGetPayload<{
  include: { minsite: true; user: true }
}>;

export type Analytics = Prisma.AnalyticsGetPayload<{
  include: { minsite: true }
}>;

// Common types used across components
export type Json = Prisma.JsonValue;

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

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category?: string;
}
