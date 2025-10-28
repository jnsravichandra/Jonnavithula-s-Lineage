import React, { useState, useMemo, useCallback } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { type AppTheme, lightTheme, darkTheme } from "../config/theme";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<AppTheme>(lightTheme);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) =>
      prevTheme.name === "light" ? darkTheme : lightTheme
    );
  }, []);

  const memoizedContextValue = useMemo(
    () => ({
      theme,
      toggleTheme,
    }),
    [theme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={memoizedContextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
