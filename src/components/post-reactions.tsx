import * as React from "react"

interface PostReactionsProps {
  slug: string
}

interface LikesResponse {
  count?: number
  liked?: boolean
}

const fetchLikesState = async (slug: string): Promise<LikesResponse> => {
  const response = await fetch(`/api/likes?slug=${encodeURIComponent(slug)}`, {
    credentials: "same-origin",
  })

  if (!response.ok) {
    throw new Error("추천 정보를 불러오지 못했습니다.")
  }

  return response.json()
}

const PostReactions = ({ slug }: PostReactionsProps) => {
  const [count, setCount] = React.useState(0)
  const [liked, setLiked] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let active = true

    fetchLikesState(slug)
      .then(data => {
        if (!active) return
        setCount(data.count ?? 0)
        setLiked(data.liked === true)
        setLoading(false)
      })
      .catch(() => {
        if (!active) return
        setError("아직 추천 기능이 연결되지 않았습니다.")
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [slug])

  const handleLike = async () => {
    if (liked || submitting) return

    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/likes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({ slug }),
      })

      if (!response.ok) {
        throw new Error("추천 저장에 실패했습니다.")
      }

      const data: LikesResponse = await response.json()
      setCount(data.count ?? count)
      setLiked(data.liked === true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "추천 저장에 실패했습니다.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mb-8 rounded-2xl border border-gray-100 bg-gray-50/80 px-5 py-4 dark:border-gray-800 dark:bg-gray-900/60">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="m-0 text-sm font-semibold text-gray-900 dark:text-gray-100">이 글이 도움이 되었나요?</p>
          <p className="mt-1 mb-0 text-sm text-gray-500 dark:text-gray-400">
            {loading ? "추천 수를 불러오는 중..." : `${count}명이 이 글을 추천했어요.`}
          </p>
        </div>

        <button
          type="button"
          onClick={handleLike}
          disabled={loading || liked || submitting}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            liked
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-800 ring-1 ring-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-100 dark:ring-gray-700 dark:hover:bg-gray-700"
          } disabled:cursor-not-allowed disabled:opacity-80`}
        >
          <span aria-hidden="true">{liked ? "♥" : "♡"}</span>
          {liked ? "추천 완료" : submitting ? "저장 중..." : "추천하기"}
        </button>
      </div>

      {error && <p className="mt-3 mb-0 text-xs text-amber-600 dark:text-amber-400">{error}</p>}
    </section>
  )
}

export default PostReactions
