import "./global.css"
import React from "react"
import { ThemeProvider } from "./src/context/ThemeContext"
import type { GatsbyBrowser } from "gatsby"

export const onClientEntry: GatsbyBrowser["onClientEntry"] = () => {
  const stored = localStorage.getItem("theme") || "light"
  document.documentElement.setAttribute("data-theme", stored)
}

export const wrapRootElement: GatsbyBrowser["wrapRootElement"] = ({ element }) => (
  <ThemeProvider>{element}</ThemeProvider>
)
