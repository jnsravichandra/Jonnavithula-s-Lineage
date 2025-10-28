// src/config/theme.ts
import { LIGHT_COLORS, DARK_COLORS } from "./colors";
import { FONTS, FONT_SIZES, FONT_WEIGHTS } from "./typography";
import { BREAKPOINTS } from "./breakpoints";

// Define Spacing Scale (remains shared between themes)
export const SPACING = {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  "2xl": "64px",
} as const;

// Base theme structure (shared properties)
const baseTheme = {
  typography: {
    fonts: FONTS,
    sizes: FONT_SIZES,
    weights: FONT_WEIGHTS,
  },
  spacing: SPACING,
  breakpoints: BREAKPOINTS,
  borderRadius: "8px",
  transition: "0.3s ease-in-out",
  transitionDuration: "0.3s",
  transitionTimingFunction: "ease-in-out",
  transitionDelay: "0s",
  transitionProperty: "all",
};

// --- Export the complete theme objects ---

export const lightTheme = {
  ...baseTheme,
  name: "light",
  colors: LIGHT_COLORS,
};

export const darkTheme = {
  ...baseTheme,
  name: "dark",
  colors: DARK_COLORS,
};

// Export the Type for use in components and contexts
export type AppTheme = typeof lightTheme;

// Export all available themes
export const themes = {
  light: lightTheme,
  dark: darkTheme,
};
