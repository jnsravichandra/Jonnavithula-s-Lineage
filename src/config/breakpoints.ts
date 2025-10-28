// Define standard screen sizes. These are often based on common CSS frameworks (e.g., Tailwind/Bootstrap).
export const BREAKPOINTS = {
  // Mobile devices
  sm: "640px",
  // Tablets and small desktops
  md: "768px",
  // Large tablets and standard desktops
  lg: "1024px",
  // Larger desktops
  xl: "1280px",
  // Extra large desktops
  "2xl": "1536px",
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

// Utility for use with CSS-in-JS or styled-components (optional but useful)
// Example usage: css`${media.md} { ... }`
export const media = (Object.keys(BREAKPOINTS) as Array<Breakpoint>).reduce(
  (acc, key) => {
    acc[key] = `@media (min-width: ${BREAKPOINTS[key]})`;
    return acc;
  },
  {} as Record<Breakpoint, string>
);
