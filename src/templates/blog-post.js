import * as React from "react"
import { graphql, Link } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import Comments from "../components/comments"

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

/* ── Blog post template ────────────────────────────── */
const BlogPost = ({ data, children, location }) => {
  const { title, date, description, tags, author } = data.mdx.frontmatter

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
              {author && (
                <span className="text-xs text-gray-400 font-medium">{author}</span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-3 tracking-tight">
              {title}
            </h1>
            {description && (
              <p className="text-gray-500 text-base leading-relaxed mb-4">
                {description}
              </p>
            )}
            {date && <span className="text-sm text-gray-400">{date}</span>}
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
