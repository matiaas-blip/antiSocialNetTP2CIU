import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

type Theme = {
  primary: string;
};

type ThemeContextType = {
  theme: Theme;
  setPrimary: (color: string) => void;
  setThemeFromUser: (theme: Theme) => void;
};

const DEFAULT_THEME: Theme = {
  primary: "#8b5cf6",
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem("theme");
    return stored ? JSON.parse(stored) : DEFAULT_THEME;
  });

  useEffect(() => {
    document.documentElement.style.setProperty("--primary", theme.primary);
  }, [theme.primary]);

  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(theme));
  }, [theme]);

  const setPrimary = (color: string) => {
    setThemeState({ primary: color });
  };

  const setThemeFromUser = (userTheme?: Theme) => {
    const newTheme = {
      primary: userTheme?.primary || DEFAULT_THEME.primary,
    };

    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setPrimary,
        setThemeFromUser,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
};