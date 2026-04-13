import * as React from "react"
import { useTheme } from "../context/ThemeContext"

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string
          theme?: "light" | "dark" | "auto"
          callback?: (token: string) => void
          "expired-callback"?: () => void
          "error-callback"?: () => void
        }
      ) => string
      reset: (widgetId?: string) => void
      remove: (widgetId?: string) => void
    }
  }
}

interface NativeCommentsProps {
  slug: string
}

interface CommentItem {
  id: number
  authorName: string
  body: string
  createdAt: string
}

const TURNSTILE_SITE_KEY = process.env.GATSBY_TURNSTILE_SITE_KEY || ""

const loadTurnstileScript = () =>
  new Promise<void>((resolve, reject) => {
    if (typeof window === "undefined") {
      resolve()
      return
    }

    if (window.turnstile) {
      resolve()
      return
    }

    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"]'
    )

    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true })
      existing.addEventListener("error", () => reject(new Error("turnstile load failed")), {
        once: true,
      })
      return
    }

    const script = document.createElement("script")
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error("turnstile load failed"))
    document.head.appendChild(script)
  })

const formatDate = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

const NativeComments = ({ slug }: NativeCommentsProps) => {
  const { theme } = useTheme()
  const [comments, setComments] = React.useState<CommentItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [submitting, setSubmitting] = React.useState(false)
  const [authorName, setAuthorName] = React.useState("")
  const [body, setBody] = React.useState("")
  const [statusMessage, setStatusMessage] = React.useState<string | null>(null)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [turnstileToken, setTurnstileToken] = React.useState("")
  const turnstileContainerRef = React.useRef<HTMLDivElement>(null)
  const turnstileWidgetIdRef = React.useRef<string | null>(null)

  React.useEffect(() => {
    let active = true

    setLoading(true)
    fetch(`/api/comments?slug=${encodeURIComponent(slug)}`)
      .then(async response => {
        if (!response.ok) {
          throw new Error("댓글을 불러오지 못했습니다.")
        }

        return response.json()
      })
      .then(data => {
        if (!active) return
        setComments(Array.isArray(data.comments) ? data.comments : [])
        setLoading(false)
      })
      .catch(() => {
        if (!active) return
        setErrorMessage("댓글을 불러오지 못했습니다.")
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [slug])

  React.useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !turnstileContainerRef.current) return

    let disposed = false

    loadTurnstileScript()
      .then(() => {
        if (disposed || !turnstileContainerRef.current || !window.turnstile) return
        turnstileWidgetIdRef.current = window.turnstile.render(turnstileContainerRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          theme: theme === "dark" ? "dark" : "light",
          callback: token => setTurnstileToken(token),
          "expired-callback": () => setTurnstileToken(""),
          "error-callback": () => setTurnstileToken(""),
        })
      })
      .catch(() => {
        if (!disposed) {
          setErrorMessage("스팸 방지 위젯을 불러오지 못했습니다.")
        }
      })

    return () => {
      disposed = true
      if (turnstileWidgetIdRef.current && window.turnstile) {
        window.turnstile.remove(turnstileWidgetIdRef.current)
      }
      turnstileWidgetIdRef.current = null
      setTurnstileToken("")
    }
  }, [theme])

  const resetTurnstile = () => {
    setTurnstileToken("")
    if (turnstileWidgetIdRef.current && window.turnstile) {
      window.turnstile.reset(turnstileWidgetIdRef.current)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedAuthor = authorName.trim()
    const trimmedBody = body.trim()
    if (!trimmedAuthor || trimmedBody.length < 2) {
      setErrorMessage("이름과 댓글 내용을 입력해주세요.")
      return
    }

    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setErrorMessage("스팸 방지 확인을 완료해주세요.")
      return
    }

    setSubmitting(true)
    setErrorMessage(null)
    setStatusMessage(null)

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug,
          authorName: trimmedAuthor,
          body: trimmedBody,
          turnstileToken: turnstileToken || undefined,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(typeof data.error === "string" ? data.error : "댓글 저장에 실패했습니다.")
      }

      setAuthorName("")
      setBody("")
      setStatusMessage("댓글이 접수되었습니다. 승인 후 노출됩니다.")
      resetTurnstile()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "댓글 저장에 실패했습니다.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mt-8">
      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">댓글</h2>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-gray-100 bg-gray-50/80 p-5 dark:border-gray-800 dark:bg-gray-900/60"
      >
        <div className="grid gap-3 sm:grid-cols-[12rem_minmax(0,1fr)]">
          <input
            type="text"
            value={authorName}
            onChange={event => setAuthorName(event.target.value)}
            placeholder="이름"
            maxLength={40}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-500"
          />
          <textarea
            value={body}
            onChange={event => setBody(event.target.value)}
            placeholder="댓글을 남겨주세요."
            rows={4}
            maxLength={2000}
            className="min-h-[7rem] rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-500"
          />
        </div>

        {TURNSTILE_SITE_KEY && <div ref={turnstileContainerRef} className="mt-4" />}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="m-0 text-xs text-gray-500 dark:text-gray-400">
            댓글은 승인 후 공개됩니다. `giscus` 대신 Cloudflare D1에 저장됩니다.
          </p>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "등록 중..." : "댓글 등록"}
          </button>
        </div>

        {statusMessage && <p className="mt-3 mb-0 text-sm text-emerald-600 dark:text-emerald-400">{statusMessage}</p>}
        {errorMessage && <p className="mt-3 mb-0 text-sm text-amber-600 dark:text-amber-400">{errorMessage}</p>}
      </form>

      <div className="mt-6 space-y-4">
        {loading && (
          <p className="text-sm text-gray-500 dark:text-gray-400">댓글을 불러오는 중입니다...</p>
        )}

        {!loading && comments.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
            아직 승인된 댓글이 없습니다.
          </div>
        )}

        {!loading &&
          comments.map(comment => (
            <article
              key={comment.id}
              className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="m-0 text-sm font-semibold text-gray-900 dark:text-gray-100">{comment.authorName}</p>
                <time className="text-xs text-gray-400 dark:text-gray-500">{formatDate(comment.createdAt)}</time>
              </div>
              <p className="mt-3 mb-0 whitespace-pre-wrap text-sm leading-6 text-gray-600 dark:text-gray-300">
                {comment.body}
              </p>
            </article>
          ))}
      </div>
    </section>
  )
}

export default NativeComments
