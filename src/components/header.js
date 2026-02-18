import * as React from "react"
import { Link, navigate, useStaticQuery, graphql } from "gatsby"

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

/* ── Header ─────────────────────────────────────────── */
const Header = ({ siteTitle, location }) => {
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
          backgroundColor: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          borderBottom: "1px solid #f3f4f6",
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
              gap: "8px",
              fontWeight: 700,
              fontSize: "0.9375rem",
              color: "#111827",
              letterSpacing: "-0.01em",
              textDecoration: "none",
            }}
          >
            <span
              style={{
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #7026b9, #9b5de5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="5" cy="5" r="3" fill="white" />
              </svg>
            </span>
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
                  color: activeCategory === cat ? "#ffffff" : "#4b5563",
                }}
                onMouseEnter={e => {
                  if (activeCategory !== cat) {
                    e.currentTarget.style.backgroundColor = "#f3f4f6"
                    e.currentTarget.style.color = "#111827"
                  }
                }}
                onMouseLeave={e => {
                  if (activeCategory !== cat) {
                    e.currentTarget.style.backgroundColor = "transparent"
                    e.currentTarget.style.color = "#4b5563"
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
                backgroundColor: "#e5e7eb",
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
                color: "#6b7280",
                cursor: "pointer",
                transition: "background 0.15s ease, color 0.15s ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = "#f3f4f6"
                e.currentTarget.style.color = "#111827"
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = "transparent"
                e.currentTarget.style.color = "#6b7280"
              }}
            >
              <SearchIcon />
            </button>
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
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.08)",
              width: "100%",
              maxWidth: "540px",
              overflow: "hidden",
            }}
          >
            {/* Search input row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "16px 20px",
                borderBottom: "1px solid #f3f4f6",
              }}
            >
              <SearchIcon className="" style={{ color: "#9ca3af", flexShrink: 0 }} />
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
                  color: "#111827",
                  backgroundColor: "transparent",
                }}
              />
              <button
                onClick={closeSearch}
                style={{
                  border: "none",
                  background: "none",
                  color: "#9ca3af",
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
                        (e.currentTarget.style.backgroundColor = "#f9fafb")
                      }
                      onMouseLeave={e =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      <p
                        style={{
                          fontSize: "0.9375rem",
                          fontWeight: 600,
                          color: "#111827",
                          margin: 0,
                        }}
                      >
                        {post.frontmatter.title}
                      </p>
                      {post.excerpt && (
                        <p
                          style={{
                            fontSize: "0.8125rem",
                            color: "#6b7280",
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
                  color: "#9ca3af",
                }}
              >
                <span style={{ color: "#374151", fontWeight: 600 }}>
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
                  color: "#9ca3af",
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
