export type ColorKey = {
  backgroundPrimary: string;
  backgroundSecondary: string;
  textPrimary: string;
  textSecondary: string;
  accentPrimary: string;
  accentSecondary: string;
  highlight: string;
  success: string;
  error: string;
}

export const LIGHT_COLORS: ColorKey = {
  // Backgrounds
  backgroundPrimary: "#F8F4ED",
  backgroundSecondary: "#E7E1D8",

  // Text
  textPrimary: "#2C3E50",
  textSecondary: "#A19A8C",

  // Accents
  accentPrimary: "#3A5C4F", // Dark Green
  accentSecondary: "#8C6B3B", // Golden Brown
  highlight: "#8CB380", // Light Green/Leaf

  // Feedback/System (can be shared or customized)
  success: "#10b981",
  error: "#ef4444",
};

export const DARK_COLORS: ColorKey = {
  // Backgrounds
  backgroundPrimary: "#2A3F38", // Dark Green
  backgroundSecondary: "#3A3A3A", // Dark Brown/Grey

  // Text
  textPrimary: "#E0E0E0",
  textSecondary: "#8A9A9A", // Cool Grey-Green

  // Accents
  accentPrimary: "#C8A461", // Brighter Gold-Brown
  accentSecondary: "#5E8472", // Softer Green
  highlight: "#A9D19E", // Desaturated Light Green

  // Feedback/System (Shared)
  success: "#10b981",
  error: "#ef4444",
};

// Define a common type for color keys to ensure both palettes share the same structure
// export type ColorKey = keyof typeof LIGHT_COLORS;
