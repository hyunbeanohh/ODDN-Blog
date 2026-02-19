import React, { createContext, useContext, useState, useEffect } from "react"

const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
})

export const ThemeProvider = ({ children }) => {
  // SSR 기본값은 "light", 클라이언트 useEffect에서 localStorage와 동기화
  const [theme, setTheme] = useState("light")

  useEffect(() => {
    const stored = localStorage.getItem("theme") || "light"
    setTheme(stored)
    document.documentElement.setAttribute("data-theme", stored)
  }, [])

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light"
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
