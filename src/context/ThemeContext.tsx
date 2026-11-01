import React, { createContext, useContext, ReactNode } from 'react';
import { theme, Theme } from '../theme';

interface ThemeContextType {
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextType>({ theme });

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => useContext(ThemeContext);

export default ThemeContext;
