"use strict"

const fs = require("fs")
const path = require("path")
const matter = require("gray-matter")

const CONTENT_DIR = path.join(__dirname, "..", "content", "blog")
const OUTPUT_FILE = path.join(__dirname, "..", "static", "search-documents.json")
const CHUNK_TARGET_LENGTH = 420

function collectMdxFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  return entries.flatMap(entry => {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) return collectMdxFiles(fullPath)
    if (/\.(mdx|md)$/.test(entry.name)) return [fullPath]
    return []
  })
}

function stripMarkdown(value) {
  return value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/^[-*+]\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "")
    .replace(/\|/g, " ")
    .replace(/[*_~]/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function splitIntoChunks(text) {
  if (!text) return []

  const sentences = text
    .split(/(?<=[.!?])\s+|\n+/)
    .map(sentence => sentence.trim())
    .filter(Boolean)

  const chunks = []
  let current = ""

  for (const sentence of sentences) {
    const next = current ? `${current} ${sentence}` : sentence
    if (next.length <= CHUNK_TARGET_LENGTH) {
      current = next
      continue
    }

    if (current) chunks.push(current)
    current = sentence
  }

  if (current) chunks.push(current)
  return chunks
}

function createSlug(filePath) {
  const relFromContent = path.relative(CONTENT_DIR, filePath)
  const dir = path.dirname(relFromContent)
  const name = path.basename(relFromContent, path.extname(relFromContent))
  return dir !== "." ? `/blog/${dir}` : `/blog/${name}`
}

function createPostDocument(filePath) {
  const raw = fs.readFileSync(filePath, "utf-8")
  const { data, content } = matter(raw)
  const plainText = stripMarkdown(content)
  const slug = createSlug(filePath)
  const title = String(data.title ?? "").trim()
  const description = String(data.description ?? "").trim()
  const tags = Array.isArray(data.tags) ? data.tags.map(tag => String(tag).trim()).filter(Boolean) : []
  const excerpt = description || plainText.slice(0, 180)

  return {
    slug,
    title,
    tags,
    excerpt,
    chunks: splitIntoChunks(plainText).map((chunk, index) => ({
      id: `${slug}#${index + 1}`,
      slug,
      title,
      excerpt,
      tags,
      content: chunk,
    })),
  }
}

function main() {
  if (!fs.existsSync(CONTENT_DIR)) {
    console.warn("[search-documents] content/blog 디렉토리가 없습니다. 건너뜁니다.")
    return
  }

  const files = collectMdxFiles(CONTENT_DIR)
  const posts = files
    .map(createPostDocument)
    .filter(post => post.title && post.chunks.length > 0)

  const chunks = posts.flatMap(post => post.chunks)
  const payload = {
    generatedAt: new Date().toISOString(),
    totalPosts: posts.length,
    totalChunks: chunks.length,
    chunks,
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(payload, null, 2), "utf-8")
  console.log(
    `[search-documents] ${posts.length}개 포스트, ${chunks.length}개 청크 → ${path.relative(process.cwd(), OUTPUT_FILE)}`
  )
}

main()
