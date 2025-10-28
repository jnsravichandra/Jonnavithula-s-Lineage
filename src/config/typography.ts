// src/config/typography.ts

/**
 * 1. FONT STACKS
 * Define the font families used across the site.
 */
export const FONTS = {
  // Primary font for headings and prominent text.
  heading:
    'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',

  // Secondary font for body text, ensuring high readability.
  body: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',

  // Monospace font for code blocks, terminal output, etc.
  code: 'Fira Code, SFMono-Regular, Consolas, "Liberation Mono", Menlo, Courier, monospace',
} as const;

export type FontStack = keyof typeof FONTS;

/**
 * 2. FONT SIZES (Typographic Scale)
 * Define a consistent set of font sizes using 'rem' for accessibility.
 * Standard body text (base) is 1rem (default 16px).
 */
export const FONT_SIZES = {
  // Extra Small (e.g., footnotes, legal text)
  xs: "0.75rem",
  // Small (e.g., captions, metadata)
  sm: "0.875rem",
  // Base Body Text
  base: "1rem",
  // Large Text
  lg: "1.125rem",
  // Extra Large Text
  xl: "1.25rem",
  // Headings
  "2xl": "1.5rem",
  "3xl": "1.875rem",
  "4xl": "2.25rem",
  "5xl": "3rem",
  "6xl": "3.75rem",
} as const;

export type FontSize = keyof typeof FONT_SIZES;

/**
 * 3. FONT WEIGHTS
 * Define common weights that match your font files.
 */
export const FONT_WEIGHTS = {
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const;

export type FontWeight = keyof typeof FONT_WEIGHTS;
