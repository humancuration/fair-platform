import type { Theme } from "~/types/models";

const defaultTheme: Theme = {
  colors: {
    primary: "#3B82F6",
    secondary: "#10B981",
    background: "#FFFFFF",
    text: "#1F2937",
    accent: "#F59E0B"
  },
  typography: {
    headingFont: "sans-serif",
    bodyFont: "sans-serif",
    scale: 1.2
  },
  spacing: {
    unit: 4,
    scale: 1.5
  }
};

export function generateThemeCSS(theme: Partial<Theme> = {}): string {
  const mergedTheme = {
    ...defaultTheme,
    ...theme,
    colors: { ...defaultTheme.colors, ...theme.colors },
    typography: { ...defaultTheme.typography, ...theme.typography },
    spacing: { ...defaultTheme.spacing, ...theme.spacing }
  };

  return `
    :root {
      --color-primary: ${mergedTheme.colors.primary};
      --color-secondary: ${mergedTheme.colors.secondary};
      --color-background: ${mergedTheme.colors.background};
      --color-text: ${mergedTheme.colors.text};
      --color-accent: ${mergedTheme.colors.accent};
      
      --font-heading: ${mergedTheme.typography.headingFont};
      --font-body: ${mergedTheme.typography.bodyFont};
      --scale: ${mergedTheme.typography.scale};
      
      --spacing-unit: ${mergedTheme.spacing.unit}px;
      --spacing-scale: ${mergedTheme.spacing.scale};
    }

    body {
      font-family: var(--font-body);
      color: var(--color-text);
      background-color: var(--color-background);
    }

    h1, h2, h3, h4, h5, h6 {
      font-family: var(--font-heading);
    }
  `;
}

export function validateTheme(theme: unknown): theme is Theme {
  if (!theme || typeof theme !== "object") return false;

  const { colors, typography, spacing } = theme as Theme;

  return (
    colors &&
    typeof colors.primary === "string" &&
    typeof colors.secondary === "string" &&
    typeof colors.background === "string" &&
    typeof colors.text === "string" &&
    typeof colors.accent === "string" &&
    typography &&
    typeof typography.headingFont === "string" &&
    typeof typography.bodyFont === "string" &&
    typeof typography.scale === "number" &&
    spacing &&
    typeof spacing.unit === "number" &&
    typeof spacing.scale === "number"
  );
}
