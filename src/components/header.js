import * as React from "react"
import { Link, navigate, useStaticQuery, graphql } from "gatsby"
import { useTheme } from "../context/ThemeContext"

const CATEGORIES = ["Engineering", "Design", "Product"]

/* ── SVG icons ─────────────────────────────────────── */
const SearchIcon = ({ className = "" }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const CloseIcon = () => (
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
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="17"
    height="17"
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

const GitHubIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.341-3.369-1.341-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
)

const MoonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="17"
    height="17"
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

/* ── Header ─────────────────────────────────────────── */
const Header = ({ siteTitle, location }) => {
  const { theme, toggleTheme } = useTheme()

  /* Posts data for search */
  const data = useStaticQuery(graphql`
    query HeaderSearchQuery {
      allMdx {
        nodes {
          id
          frontmatter {
            title
            tags
          }
          excerpt(pruneLength: 80)
        }
      }
    }
  `)
  const allPosts = data?.allMdx?.nodes ?? []

  /* Search state */
  const [searchOpen, setSearchOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const inputRef = React.useRef(null)

  /* Active category from URL */
  const activeCategory = React.useMemo(() => {
    if (!location?.search) return null
    return new URLSearchParams(location.search).get("category")
  }, [location?.search])

  /* Search results */
  const searchResults = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return []
    return allPosts.filter(
      p =>
        p.frontmatter.title?.toLowerCase().includes(q) ||
        p.excerpt?.toLowerCase().includes(q)
    )
  }, [searchQuery, allPosts])

  /* Keyboard shortcuts */
  React.useEffect(() => {
    if (!searchOpen) return
    const handler = e => {
      if (e.key === "Escape") closeSearch()
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [searchOpen])

  const openSearch = () => {
    setSearchOpen(true)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const closeSearch = () => {
    setSearchOpen(false)
    setSearchQuery("")
  }

  const handleCategoryClick = cat => {
    navigate(activeCategory === cat ? "/" : `/?category=${cat}`)
  }

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backgroundColor: "var(--color-header-bg)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          borderBottom: "1px solid var(--color-header-border)",
          transition: "background-color 0.2s ease, border-color 0.2s ease",
        }}
      >
        <div
          style={{
            maxWidth: "72rem",
            margin: "0 auto",
            padding: "0 1.5rem",
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* ── Left: Logo ── */}
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontWeight: 700,
              fontSize: "0.9375rem",
              color: "var(--color-text)",
              letterSpacing: "-0.01em",
              textDecoration: "none",
            }}
          >
            <img
              src="/profile.jpeg"
              alt="프로필"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                objectFit: "cover",
                flexShrink: 0,
              }}
            />
            {siteTitle}
          </Link>

          {/* ── Right: Category nav + Search ── */}
          <nav
            style={{ display: "flex", alignItems: "center", gap: "2px" }}
          >
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                style={{
                  padding: "6px 16px",
                  borderRadius: "9999px",
                  fontSize: "0.875rem",
                  fontWeight: activeCategory === cat ? 600 : 500,
                  border: "none",
                  cursor: "pointer",
                  transition: "background 0.15s ease, color 0.15s ease",
                  backgroundColor:
                    activeCategory === cat ? "#3b82f6" : "transparent",
                  color: activeCategory === cat ? "#ffffff" : "var(--color-text-secondary)",
                }}
                onMouseEnter={e => {
                  if (activeCategory !== cat) {
                    e.currentTarget.style.backgroundColor = "var(--color-surface)"
                    e.currentTarget.style.color = "var(--color-text)"
                  }
                }}
                onMouseLeave={e => {
                  if (activeCategory !== cat) {
                    e.currentTarget.style.backgroundColor = "transparent"
                    e.currentTarget.style.color = "var(--color-text-secondary)"
                  }
                }}
              >
                {cat}
              </button>
            ))}

            {/* Divider */}
            <span
              style={{
                width: "1px",
                height: "18px",
                backgroundColor: "var(--color-border)",
                margin: "0 6px",
              }}
            />

            {/* Search button */}
            <button
              onClick={openSearch}
              aria-label="검색"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                border: "none",
                backgroundColor: "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-text-muted)",
                cursor: "pointer",
                transition: "background 0.15s ease, color 0.15s ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = "var(--color-surface)"
                e.currentTarget.style.color = "var(--color-text)"
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = "transparent"
                e.currentTarget.style.color = "var(--color-text-muted)"
              }}
            >
              <SearchIcon />
            </button>

            {/* Theme toggle button */}
            <button
              onClick={toggleTheme}
              aria-label={theme === "light" ? "다크 모드로 전환" : "라이트 모드로 전환"}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                border: "none",
                backgroundColor: "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-text-muted)",
                cursor: "pointer",
                transition: "background 0.15s ease, color 0.15s ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = "var(--color-surface)"
                e.currentTarget.style.color = "var(--color-text)"
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = "transparent"
                e.currentTarget.style.color = "var(--color-text-muted)"
              }}
            >
              {theme === "light" ? <MoonIcon /> : <SunIcon />}
            </button>

            {/* Divider */}
            <span
              style={{
                width: "1px",
                height: "18px",
                backgroundColor: "var(--color-border)",
                margin: "0 6px",
              }}
            />

            {/* GitHub link */}
            <a
              href="https://github.com/hyunbeanohh/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub 저장소"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-text-muted)",
                textDecoration: "none",
                transition: "background 0.15s ease, color 0.15s ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = "var(--color-surface)"
                e.currentTarget.style.color = "var(--color-text)"
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = "transparent"
                e.currentTarget.style.color = "var(--color-text-muted)"
              }}
            >
              <GitHubIcon />
            </a>
          </nav>
        </div>
      </header>

      {/* ── Search overlay ────────────────────────────── */}
      {searchOpen && (
        <div
          onClick={closeSearch}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            backgroundColor: "rgba(0,0,0,0.3)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: "5rem",
            paddingLeft: "1rem",
            paddingRight: "1rem",
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: "var(--color-bg)",
              borderRadius: "16px",
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.08)",
              width: "100%",
              maxWidth: "540px",
              overflow: "hidden",
              border: "1px solid var(--color-border)",
            }}
          >
            {/* Search input row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "16px 20px",
                borderBottom: "1px solid var(--color-border-light)",
              }}
            >
              <SearchIcon className="" style={{ color: "var(--color-text-muted)", flexShrink: 0 }} />
              <input
                ref={inputRef}
                type="text"
                placeholder="검색어를 입력하세요..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  fontSize: "1rem",
                  border: "none",
                  outline: "none",
                  color: "var(--color-text)",
                  backgroundColor: "transparent",
                }}
              />
              <button
                onClick={closeSearch}
                style={{
                  border: "none",
                  background: "none",
                  color: "var(--color-text-muted)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  padding: "4px",
                  borderRadius: "4px",
                  flexShrink: 0,
                }}
              >
                <CloseIcon />
              </button>
            </div>

            {/* Search results */}
            {searchResults.length > 0 ? (
              <ul
                style={{
                  maxHeight: "18rem",
                  overflowY: "auto",
                  padding: "8px 0",
                  margin: 0,
                  listStyle: "none",
                }}
              >
                {searchResults.map(post => (
                  <li key={post.id}>
                    <button
                      onClick={closeSearch}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "12px 20px",
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        display: "block",
                      }}
                      onMouseEnter={e =>
                        (e.currentTarget.style.backgroundColor = "var(--color-surface)")
                      }
                      onMouseLeave={e =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      <p
                        style={{
                          fontSize: "0.9375rem",
                          fontWeight: 600,
                          color: "var(--color-text)",
                          margin: 0,
                        }}
                      >
                        {post.frontmatter.title}
                      </p>
                      {post.excerpt && (
                        <p
                          style={{
                            fontSize: "0.8125rem",
                            color: "var(--color-text-secondary)",
                            marginTop: "2px",
                            marginBottom: 0,
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {post.excerpt}
                        </p>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            ) : searchQuery.trim() ? (
              <div
                style={{
                  padding: "2.5rem 1.5rem",
                  textAlign: "center",
                  fontSize: "0.875rem",
                  color: "var(--color-text-muted)",
                }}
              >
                <span style={{ color: "var(--color-text)", fontWeight: 600 }}>
                  "{searchQuery}"
                </span>
                에 대한 결과가 없습니다.
              </div>
            ) : (
              <div
                style={{
                  padding: "2.5rem 1.5rem",
                  textAlign: "center",
                  fontSize: "0.875rem",
                  color: "var(--color-text-muted)",
                }}
              >
                검색어를 입력하면 글을 찾아드려요.
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default Header
