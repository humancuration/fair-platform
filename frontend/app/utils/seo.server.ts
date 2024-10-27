import type { SEOMetadata } from "~/types/models";

export function generateMetaTags(metadata: Partial<SEOMetadata> = {}): Array<{ [key: string]: string }> {
  const defaultMetadata: SEOMetadata = {
    title: "Minsite",
    description: "Create your own mini website",
    keywords: "website builder, minsite, landing page",
    ogImage: "/images/default-og.png",
    twitterCard: "summary_large_image"
  };

  const mergedMetadata = { ...defaultMetadata, ...metadata };

  return [
    { title: mergedMetadata.title },
    { name: "description", content: mergedMetadata.description },
    { name: "keywords", content: mergedMetadata.keywords },
    { property: "og:title", content: mergedMetadata.title },
    { property: "og:description", content: mergedMetadata.description },
    { property: "og:image", content: mergedMetadata.ogImage },
    { name: "twitter:card", content: mergedMetadata.twitterCard },
    { name: "twitter:title", content: mergedMetadata.title },
    { name: "twitter:description", content: mergedMetadata.description },
    { name: "twitter:image", content: mergedMetadata.ogImage }
  ];
}

export function validateSEOMetadata(metadata: unknown): metadata is SEOMetadata {
  if (!metadata || typeof metadata !== "object") return false;

  const { title, description, keywords } = metadata as SEOMetadata;

  return (
    typeof title === "string" &&
    typeof description === "string" &&
    typeof keywords === "string"
  );
}
