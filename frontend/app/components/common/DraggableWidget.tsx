import { Rnd } from 'react-rnd';
import { motion } from 'framer-motion';

interface DraggableWidgetProps {
  children: React.ReactNode;
  defaultPosition?: { x: number; y: number };
  defaultSize?: { width: number; height: number };
  minWidth?: number;
  minHeight?: number;
  className?: string;
}

export default function DraggableWidget({
  children,
  defaultPosition = { x: 50, y: 50 },
  defaultSize = { width: 200, height: 200 },
  minWidth = 100,
  minHeight = 100,
  className = ''
}: DraggableWidgetProps) {
  return (
    <Rnd
      default={{
        x: defaultPosition.x,
        y: defaultPosition.y,
        width: defaultSize.width,
        height: defaultSize.height,
      }}
      minWidth={minWidth}
      minHeight={minHeight}
      bounds="window"
      dragHandleClassName="drag-handle"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`
          bg-white dark:bg-gray-800 
          rounded-lg shadow-lg 
          overflow-hidden
          ${className}
        `}
      >
        <div className="drag-handle p-2 bg-gray-100 dark:bg-gray-700 cursor-move">
          <div className="w-16 h-1 bg-gray-300 dark:bg-gray-500 mx-auto rounded-full" />
        </div>
        <div className="p-4">
          {children}
        </div>
      </motion.div>
    </Rnd>
  );
}
