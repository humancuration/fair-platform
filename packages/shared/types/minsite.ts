export interface MinsiteBase {
  id: string;
  title: string;
  content: Json;
  template: string;
  customCSS?: string;
  seoMetadata?: Json;
  components: Json;
  settings?: Json;
  isPublished: boolean;
  publishedUrl?: string;
  publishedSlug?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MinsiteResponse extends MinsiteBase {
  versions: MinsiteVersion[];
  uploads: Upload[];
  affiliateLinks: AffiliateLink[];
  analytics: Analytics[];
}

export interface MinsiteCreateInput {
  title: string;
  content: Json;
  template: string;
  customCSS?: string;
  seoMetadata?: Json;
  components: Json;
  settings?: Json;
}

export interface MinsiteUpdateInput extends Partial<MinsiteCreateInput> {
  isPublished?: boolean;
  publishedSlug?: string;
}

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];
