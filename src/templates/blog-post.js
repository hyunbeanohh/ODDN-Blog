import * as React from "react"
import { graphql, Link } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import Comments from "../components/comments"

/* ── Social links ──────────────────────────────────── */
const SOCIAL_LINKS = {
  github: "https://github.com/hyunbeanohh",
  portfolio: "https://exultant-fuel-232.notion.site/8a98b3b88c4c46b69305ea48e9ba9c26",
  linkedin: "https://www.linkedin.com/in/dev-bean",
}

/* ── Category badge color map ──────────────────────── */
const categoryStyle = {
  Engineering: "bg-blue-50 text-blue-600",
  Design: "bg-emerald-50 text-emerald-600",
  Product: "bg-orange-50 text-orange-600",
  일상: "bg-purple-50 text-purple-600",
  블로그: "bg-purple-50 text-purple-600",
}

const badgeClass = tag =>
  `text-xs px-3 py-1 rounded-full font-medium ${
    categoryStyle[tag] ?? "bg-gray-100 text-gray-600"
  }`

/* ── Profile Popover ───────────────────────────────── */
const ProfilePopover = ({ onClose }) => {
  React.useEffect(() => {
    const handler = e => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [onClose])

  const socialIconBase = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "var(--color-surface, #f3f4f6)",
    color: "var(--color-text, #111)",
    textDecoration: "none",
    transition: "background 0.15s ease, color 0.15s ease, transform 0.15s ease",
  }

  return (
    <>
      {/* 투명 클릭 배경 */}
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, zIndex: 99 }}
      />
      {/* 팝오버 카드 */}
      <div
        style={{
          position: "absolute",
          bottom: "calc(100% + 12px)",
          left: 0,
          zIndex: 100,
          backgroundColor: "var(--color-bg, #fff)",
          border: "1px solid var(--color-border, #e5e7eb)",
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
          padding: "12px 20px",
          minWidth: "280px",
          whiteSpace: "nowrap",
        }}
      >
        {/* 아래 화살표 */}
        <div style={{
          position: "absolute",
          bottom: "-7px",
          left: "18px",
          width: "12px",
          height: "12px",
          backgroundColor: "var(--color-bg, #fff)",
          border: "1px solid var(--color-border, #e5e7eb)",
          borderTop: "none",
          borderLeft: "none",
          transform: "rotate(45deg)",
        }} />

        {/* 프로필 이미지 + 이름 (왼쪽) + 소셜 아이콘 (오른쪽) */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img
              src="/profile.jpeg"
              alt="프로필"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                objectFit: "cover",
                flexShrink: 0,
              }}
            />
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: "0.9375rem", color: "var(--color-text, #111)" }}>
                오또니
              </p>
            </div>
          </div>

        <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
          {/* GitHub */}
          <a
            href={SOCIAL_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub"
            style={socialIconBase}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = "#24292e"
              e.currentTarget.style.color = "#fff"
              e.currentTarget.style.transform = "scale(1.1)"
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = "var(--color-surface, #f3f4f6)"
              e.currentTarget.style.color = "var(--color-text, #111)"
              e.currentTarget.style.transform = "scale(1)"
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23A11.52 11.52 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.807 5.625-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.694.825.576C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
          </a>

          {/* Portfolio */}
          <a
            href={SOCIAL_LINKS.portfolio || "#"}
            target="_blank"
            rel="noopener noreferrer"
            title="Portfolio"
            style={{ ...socialIconBase, opacity: SOCIAL_LINKS.portfolio ? 1 : 0.35, pointerEvents: SOCIAL_LINKS.portfolio ? "auto" : "none" }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = "#6366f1"
              e.currentTarget.style.color = "#fff"
              e.currentTarget.style.transform = "scale(1.1)"
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = "var(--color-surface, #f3f4f6)"
              e.currentTarget.style.color = "var(--color-text, #111)"
              e.currentTarget.style.transform = "scale(1)"
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
          </a>

          {/* LinkedIn */}
          <a
            href={SOCIAL_LINKS.linkedin || "#"}
            target="_blank"
            rel="noopener noreferrer"
            title="LinkedIn"
            style={{ ...socialIconBase, opacity: SOCIAL_LINKS.linkedin ? 1 : 0.35, pointerEvents: SOCIAL_LINKS.linkedin ? "auto" : "none" }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = "#0a66c2"
              e.currentTarget.style.color = "#fff"
              e.currentTarget.style.transform = "scale(1.1)"
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = "var(--color-surface, #f3f4f6)"
              e.currentTarget.style.color = "var(--color-text, #111)"
              e.currentTarget.style.transform = "scale(1)"
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
        </div>
        </div>
      </div>
    </>
  )
}

/* ── Blog post template ────────────────────────────── */
const BlogPost = ({ data, children, location }) => {
  const { title, date, description, tags, author } = data.mdx.frontmatter
  const [popoverOpen, setPopoverOpen] = React.useState(false)

  return (
    <Layout location={location}>
      <div className="py-10">
        <div className="max-w-2xl mx-auto">
          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-10 transition-colors group"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
            목록으로 돌아가기
          </Link>

          {/* Header */}
          <header className="mb-10 pb-8 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {tags?.map(tag => (
                <span key={tag} className={badgeClass(tag)}>
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-3 tracking-tight">
              {title}
            </h1>
            {description && (
              <p className="text-gray-500 text-base leading-relaxed mb-4">
                {description}
              </p>
            )}
            {/* Author info */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "16px" }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                {popoverOpen && <ProfilePopover onClose={() => setPopoverOpen(false)} />}
              <button
                onClick={() => setPopoverOpen(prev => !prev)}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  borderRadius: "50%",
                  transition: "transform 0.15s ease, opacity 0.15s ease",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.08)"; e.currentTarget.style.opacity = "0.85" }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.opacity = "1" }}
                title="프로필 보기"
              >
                <img
                  src="/profile.jpeg"
                  alt="프로필"
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </button>
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 600, fontSize: "0.9375rem", color: "var(--color-text, #111)" }}>
                  {author || "오또니"}
                </p>
                {date && (
                  <p style={{ margin: 0, fontSize: "0.8125rem", color: "#9ca3af" }}>
                    {date}
                  </p>
                )}
              </div>
            </div>
          </header>

          {/* MDX Content */}
          <div className="prose prose-gray max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-blue-600 prose-code:text-purple-700 prose-code:bg-purple-50 prose-code:rounded prose-code:px-1 prose-code:py-0.5 prose-pre:bg-gray-900 prose-blockquote:border-purple-300">
            {children}
          </div>

          <hr className="my-14 border-gray-100" />

          {/* Giscus Comments */}
          <Comments />
        </div>
      </div>
    </Layout>
  )
}

export const Head = ({ data }) => (
  <Seo
    title={data.mdx.frontmatter.title}
    description={data.mdx.frontmatter.description}
  />
)

export const query = graphql`
  query BlogPost($id: String!) {
    mdx(id: { eq: $id }) {
      frontmatter {
        title
        date(formatString: "YYYY년 M월 D일")
        description
        tags
        author
      }
    }
  }
`

export default BlogPost
