import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"

import Header from "./header"
import { useTheme } from "../context/ThemeContext"
import "./layout.css"

/* ── Sun icon (라이트 모드 전환 아이콘) ─────────────── */
const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
)

/* ── Moon icon (다크 모드 전환 아이콘) ──────────────── */
const MoonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

/* ── ThemeToggle 버튼 (우측 하단 고정) ──────────────── */
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={theme === "light" ? "다크 모드로 전환" : "라이트 모드로 전환"}
    >
      {theme === "light" ? <MoonIcon /> : <SunIcon />}
    </button>
  )
}

/* ── Layout ─────────────────────────────────────────── */
const Layout = ({ children, location }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <>
      <Header
        siteTitle={data.site.siteMetadata?.title || `Title`}
        location={location}
      />
      <div
        style={{
          maxWidth: "var(--size-content)",
          margin: "0 auto",
          padding: "0 1.5rem",
          minHeight: "calc(100vh - 60px)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <main style={{ flex: 1 }}>{children}</main>
        <footer
          style={{
            marginTop: "var(--space-6)",
            paddingTop: "var(--space-4)",
            paddingBottom: "var(--space-5)",
            borderTop: "1px solid var(--color-border-light)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "var(--font-sm)",
            color: "var(--color-text-muted)",
            flexWrap: "wrap",
            gap: "8px",
            textAlign: "center",
            alignSelf: "center",
          }}
        >
          <span>© {new Date().getFullYear()} 오또니 블로그</span>
        </footer>
      </div>

      {/* 우측 하단 고정 테마 토글 버튼 */}
      <ThemeToggle />
    </>
  )
}

export default Layout
