import "./global.css"
import React from "react"
import { ThemeProvider } from "./src/context/ThemeContext"

export const onClientEntry = () => {
  const stored = localStorage.getItem("theme") || "light"
  document.documentElement.setAttribute("data-theme", stored)
}

export const wrapRootElement = ({ element }) => (
  <ThemeProvider>{element}</ThemeProvider>
)
