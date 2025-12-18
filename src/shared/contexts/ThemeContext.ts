import { createContext } from "react";
import { lightTheme, type AppTheme } from "../../config/theme";

interface ThemeContextType {
  theme: AppTheme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme, // Default theme
  toggleTheme: () => {}, // Default no-op function
});
