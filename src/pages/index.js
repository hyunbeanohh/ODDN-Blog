import * as React from "react"
import { graphql, Link } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

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

/* ── Thumbnail placeholder ─────────────────────────── */
const thumbnailGradient = {
  Engineering: "from-slate-700 to-slate-900",
  Design: "from-emerald-400 to-teal-600",
  Product: "from-orange-400 to-rose-500",
  일상: "from-violet-400 to-purple-600",
  블로그: "from-violet-400 to-purple-600",
}

const ThumbnailPlaceholder = ({ tag }) => {
  const gradient = thumbnailGradient[tag] ?? "from-gray-300 to-gray-400"
  return (
    <div
      className={`w-32 h-24 rounded-xl bg-gradient-to-br ${gradient} flex-shrink-0 flex items-center justify-center overflow-hidden`}
    >
      <span className="text-2xl select-none">
        {tag === "Engineering" ? "⚙️" : tag === "Design" ? "🎨" : "📄"}
      </span>
    </div>
  )
}

/* ── Article card ──────────────────────────────────── */
const ArticleCard = ({ post }) => {
  const { title, date, description, tags, author } = post.frontmatter
  const tag = tags?.[0] ?? "일반"
  const slug = post.parent?.name ? `/blog/${post.parent.name}` : "/"

  return (
    <article className="border-b border-gray-100 last:border-0">
      <Link
        to={slug}
        className="flex justify-between items-start gap-6 py-7 group -mx-4 px-4 rounded-xl transition-colors"
      >
        {/* Text content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={badgeClass(tag)}>{tag}</span>
            {author && (
              <span className="text-xs text-gray-400 font-medium">{author}</span>
            )}
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug tracking-tight group-hover:text-blue-600 transition-colors">
            {title ?? "제목 없음"}
          </h3>
          {(description || post.excerpt) && (
            <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
              {description ?? post.excerpt}
            </p>
          )}
          {date && (
            <span className="text-xs text-gray-400 mt-3 block">{date}</span>
          )}
        </div>

        {/* Thumbnail */}
        <ThumbnailPlaceholder tag={tag} />
      </Link>
    </article>
  )
}

/* ── Empty state ───────────────────────────────────── */
const EmptyState = () => (
  <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
    <p className="text-sm font-semibold text-gray-500">
      아직 작성된 글이 없습니다.
    </p>
  </div>
)

/* ── Popular posts sidebar ─────────────────────────── */
const rankColor = [
  "bg-blue-500 text-white",
  "bg-blue-400 text-white",
  "bg-blue-300 text-white",
]

const PopularSidebar = ({ posts }) => (
  <div className="bg-gray-100 rounded-2xl p-6">
    <h3 className="text-sm font-bold text-gray-900 mb-5">인기 있는 글</h3>
    <ol className="space-y-4 pl-0">
      {posts.slice(0, 3).map((post, i) => (
        <li key={post.id} className="flex items-start gap-3">
          <span
            className={`text-xs font-bold w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${rankColor[i]}`}
          >
            {i + 1}
          </span>
          <div className="min-w-0">
            <Link
              to={post.parent?.name ? `/blog/${post.parent.name}` : "/"}
              className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 hover:text-blue-600 transition-colors"
            >
              {post.frontmatter.title}
            </Link>
            {post.frontmatter.author && (
              <p className="text-xs text-gray-400 mt-1">
                {post.frontmatter.author}
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  </div>
)

/* ── Recent comments sidebar ───────────────────────── */
const RecentCommentsSidebar = () => {
  const [comments, setComments] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetch("/.netlify/functions/recent-comments")
      .then(res => res.json())
      .then(data => {
        setComments(data.comments ?? [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="bg-gray-100 rounded-2xl p-6">
      <h3 className="text-sm font-bold text-gray-900 mb-4">최신 댓글</h3>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl p-4 flex items-start gap-3 animate-pulse">
              <div className="w-9 h-9 rounded-full bg-gray-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-2 bg-gray-200 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && comments.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-4">
          아직 작성된 댓글이 없습니다.
        </p>
      )}

      {!loading && comments.length > 0 && (
        <div className="space-y-3">
          {comments.map((c, i) => (
            <a
              key={i}
              href={c.commentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-xl p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors block"
            >
              {c.avatarUrl ? (
                <img
                  src={c.avatarUrl}
                  alt={c.author}
                  className="w-9 h-9 rounded-full shrink-0 object-cover"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gray-200 shrink-0 flex items-center justify-center text-sm font-bold text-gray-500">
                  {c.author?.[0]?.toUpperCase() ?? "?"}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-700 mb-1">{c.author}</p>
                <p className="text-sm font-medium text-gray-800 leading-snug line-clamp-2">
                  {c.body}
                </p>
                <p className="text-xs text-gray-400 mt-2 truncate">{c.postTitle}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Page ──────────────────────────────────────────── */
const IndexPage = ({ data, location }) => {
  const allPosts = data?.allMdx?.nodes ?? []

  /* Category filter from URL query param */
  const activeCategory = React.useMemo(() => {
    if (!location?.search) return null
    return new URLSearchParams(location.search).get("category")
  }, [location?.search])

  const posts = activeCategory
    ? allPosts.filter(p => p.frontmatter.tags?.includes(activeCategory))
    : allPosts

  const pageTitle = activeCategory ? `${activeCategory}` : "전체 아티클"

  return (
    <Layout location={location}>
      <div className="py-8">
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            {pageTitle}
          </h1>
          {activeCategory && (
            <span className="text-sm text-gray-400 font-normal">
              {posts.length}개의 글
            </span>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── Article list ── col-span-2 */}
          <section className="lg:col-span-2">
            {posts.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="rounded-xl bg-white text-gray-800">
                {posts.map(post => (
                  <ArticleCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </section>

          {/* ── Sidebar ── col-span-1 */}
          <aside className="lg:col-span-1 space-y-4">
            {allPosts.length > 0 && <PopularSidebar posts={allPosts} />}
            <RecentCommentsSidebar />
          </aside>
        </div>
      </div>
    </Layout>
  )
}

export const Head = () => <Seo title="홈" />

export const query = graphql`
  query HomePageQuery {
    allMdx(sort: { frontmatter: { date: DESC } }) {
      nodes {
        id
        parent {
          ... on File {
            name
          }
        }
        frontmatter {
          title
          date(formatString: "YYYY년 M월 D일")
          description
          tags
          author
        }
        excerpt(pruneLength: 120)
      }
    }
  }
`

export default IndexPage
