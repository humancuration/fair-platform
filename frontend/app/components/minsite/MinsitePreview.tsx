import { motion } from 'framer-motion';
import DOMPurify from 'dompurify';
import type { Json } from '~/types/models';

interface MinsitePreviewProps {
  title: string;
  content: string;
  customCSS: string;
  components: Json[];
}

export function MinsitePreview({ title, content, customCSS, components }: MinsitePreviewProps) {
  const sanitizedContent = DOMPurify.sanitize(content);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="preview-container border rounded-lg overflow-hidden bg-white shadow-lg"
    >
      <style>{customCSS}</style>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">{title}</h1>
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }} 
        />
        {components.map((component, index) => {
          const { type, content: componentContent, style = {} } = component as {
            type: string;
            content: string;
            style?: Record<string, string>;
          };

          return (
            <div
              key={index}
              className="component-wrapper my-4"
              style={style}
            >
              {type === "product" ? (
                <ProductEmbed product={JSON.parse(componentContent)} />
              ) : (
                componentContent
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
