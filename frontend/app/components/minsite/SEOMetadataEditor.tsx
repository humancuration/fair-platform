import { useState } from "react";
import { motion } from "framer-motion";
import type { Json } from "~/types/models";

interface SEOMetadataEditorProps {
  metadata: Json;
  onChange: (metadata: Json) => void;
}

export function SEOMetadataEditor({ metadata, onChange }: SEOMetadataEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const seoMetadata = metadata as {
    title?: string;
    description?: string;
    keywords?: string;
    ogImage?: string;
    twitterCard?: string;
  };

  return (
    <div className="seo-metadata-editor my-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
      >
        <span className="material-icons">
          {isOpen ? "expand_less" : "expand_more"}
        </span>
        SEO Settings
      </button>

      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0 }}
        className="overflow-hidden"
      >
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg mt-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Meta Title
            </label>
            <input
              type="text"
              value={seoMetadata.title || ""}
              onChange={(e) =>
                onChange({ ...seoMetadata, title: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Meta Description
            </label>
            <textarea
              value={seoMetadata.description || ""}
              onChange={(e) =>
                onChange({ ...seoMetadata, description: e.target.value })
              }
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Keywords
            </label>
            <input
              type="text"
              value={seoMetadata.keywords || ""}
              onChange={(e) =>
                onChange({ ...seoMetadata, keywords: e.target.value })
              }
              placeholder="Separate keywords with commas"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              OG Image URL
            </label>
            <input
              type="text"
              value={seoMetadata.ogImage || ""}
              onChange={(e) =>
                onChange({ ...seoMetadata, ogImage: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
