import { motion } from 'framer-motion';

interface CardProps {
  title: string;
  imageUrl?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export default function Card({ 
  title, 
  imageUrl, 
  children, 
  footer,
  className = '' 
}: CardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden ${className}`}
    >
      {imageUrl && (
        <div className="relative aspect-video">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
          {title}
        </h2>
        <div className="text-gray-700 dark:text-gray-400">
          {children}
        </div>
      </div>

      {footer && (
        <div className="p-4 border-t dark:border-gray-700">
          {footer}
        </div>
      )}
    </motion.div>
  );
}
