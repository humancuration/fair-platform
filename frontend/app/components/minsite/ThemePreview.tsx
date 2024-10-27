import { motion } from "framer-motion";
import type { Theme } from "~/types/models";

interface ThemePreviewProps {
  theme: Theme;
  onSelect: () => void;
}

export function ThemePreview({ theme, onSelect }: ThemePreviewProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="theme-preview p-4 rounded-lg shadow cursor-pointer"
      onClick={onSelect}
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
        fontFamily: theme.typography.bodyFont,
      }}
    >
      <h3 
        style={{ 
          fontFamily: theme.typography.headingFont,
          color: theme.colors.primary 
        }}
        className="text-lg font-bold mb-4"
      >
        Theme Preview
      </h3>

      <div className="flex gap-2 mb-4">
        {Object.entries(theme.colors).map(([name, color]) => (
          <div
            key={name}
            className="w-8 h-8 rounded-full"
            style={{ backgroundColor: color }}
            title={name}
          />
        ))}
      </div>

      <div className="space-y-2">
        <p style={{ fontSize: `${theme.typography.scale}rem` }}>
          Sample text with scale
        </p>
        <div 
          style={{ 
            padding: `${theme.spacing.unit}px`,
            backgroundColor: theme.colors.secondary,
            color: theme.colors.background,
            borderRadius: '4px'
          }}
        >
          Spacing and colors
        </div>
      </div>
    </motion.div>
  );
}
