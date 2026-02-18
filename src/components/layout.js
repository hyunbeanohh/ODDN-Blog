import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"

import Header from "./header"
import "./layout.css"

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
    </>
  )
}

export default Layout
