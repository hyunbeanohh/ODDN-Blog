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
        className="flex justify-between items-start gap-6 py-7 group hover:bg-gray-50 -mx-4 px-4 rounded-xl transition-colors"
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
const MOCK_COMMENTS = [
  {
    id: 1,
    emoji: "🐝",
    name: "다정한나비",
    text: "바이브 코딩은 해보고 skills 서브에이전트 mcp는 해보고...",
    post: "Gatsby + GraphQL로 정적 블로그 만들기",
  },
  {
    id: 2,
    emoji: "🌿",
    name: "호석이2마리치킨",
    text: "재밌게 잘 읽었습니다. 비유가 너무 적절했어요. 공감이 많이 갑니다.",
    post: "Tailwind CSS로 빠르게 UI 만들기",
  },
  {
    id: 3,
    emoji: "🦊",
    name: "코딩하는여우",
    text: "덕분에 GraphQL 개념을 확실히 잡았어요. 예제 코드가 특히 도움됐습니다!",
    post: "Gatsby + GraphQL로 정적 블로그 만들기",
  },
  {
    id: 4,
    emoji: "🐳",
    name: "파란고래",
    text: "처음 블로그 시작하시는 거군요. 앞으로 좋은 글 많이 부탁드려요 :)",
    post: "안녕하세요, 오또니 블로그입니다!",
  },
]

const RecentCommentsSidebar = () => (
  <div className="bg-gray-100 rounded-2xl p-6">
    <h3 className="text-sm font-bold text-gray-900 mb-4">최신 댓글</h3>
    <div className="space-y-3">
      {MOCK_COMMENTS.slice(0, 4).map(c => (
        <div
          key={c.id}
          className="bg-white rounded-xl p-4 flex items-start gap-3"
        >
          <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-lg shrink-0">
            {c.emoji}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-700 mb-1">{c.name}</p>
            <p className="text-sm font-medium text-gray-800 leading-snug line-clamp-2">
              {c.text}
            </p>
            <p className="text-xs text-gray-400 mt-2 truncate">{c.post}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
)

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
