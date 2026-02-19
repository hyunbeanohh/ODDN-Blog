import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface ThemeContextValue {
  theme: "light" | "dark"
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  toggleTheme: () => {},
})

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    const stored = (localStorage.getItem("theme") as "light" | "dark") || "light"
    setTheme(stored)
    document.documentElement.setAttribute("data-theme", stored)
  }, [])

  const toggleTheme = () => {
    const next: "light" | "dark" = theme === "light" ? "dark" : "light"
    document.documentElement.classList.add("is-theme-transitioning")
    setTheme(next)
    localStorage.setItem("theme", next)
    document.documentElement.setAttribute("data-theme", next)
    setTimeout(() => {
      document.documentElement.classList.remove("is-theme-transitioning")
    }, 250)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
