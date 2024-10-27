import type { Theme } from "~/types/models";

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  
  // Colors
  root.style.setProperty('--color-primary', theme.colors.primary);
  root.style.setProperty('--color-secondary', theme.colors.secondary);
  root.style.setProperty('--color-background', theme.colors.background);
  root.style.setProperty('--color-text', theme.colors.text);
  root.style.setProperty('--color-accent', theme.colors.accent);

  // Typography
  root.style.setProperty('--font-heading', theme.typography.headingFont);
  root.style.setProperty('--font-body', theme.typography.bodyFont);
  root.style.setProperty('--scale', theme.typography.scale.toString());

  // Spacing
  root.style.setProperty('--spacing-unit', `${theme.spacing.unit}px`);
  root.style.setProperty('--spacing-scale', theme.spacing.scale.toString());
}

export function getComputedTheme(): Theme {
  const computedStyle = getComputedStyle(document.documentElement);
  
  return {
    colors: {
      primary: computedStyle.getPropertyValue('--color-primary').trim(),
      secondary: computedStyle.getPropertyValue('--color-secondary').trim(),
      background: computedStyle.getPropertyValue('--color-background').trim(),
      text: computedStyle.getPropertyValue('--color-text').trim(),
      accent: computedStyle.getPropertyValue('--color-accent').trim(),
    },
    typography: {
      headingFont: computedStyle.getPropertyValue('--font-heading').trim(),
      bodyFont: computedStyle.getPropertyValue('--font-body').trim(),
      scale: parseFloat(computedStyle.getPropertyValue('--scale')),
    },
    spacing: {
      unit: parseInt(computedStyle.getPropertyValue('--spacing-unit')),
      scale: parseFloat(computedStyle.getPropertyValue('--spacing-scale')),
    },
  };
}
