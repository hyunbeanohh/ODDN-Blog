/**
 * Netlify Function: recent-comments
 * GitHub Discussions 댓글을 서버 사이드에서 가져와 반환합니다.
 * GITHUB_TOKEN은 서버에서만 사용되므로 브라우저에 노출되지 않습니다.
 */

const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql"

const QUERY = `
  query RecentComments($owner: String!, $repo: String!, $categoryId: ID!) {
    repository(owner: $owner, name: $repo) {
      discussions(
        first: 10
        categoryId: $categoryId
        orderBy: { field: UPDATED_AT, direction: DESC }
      ) {
        nodes {
          title
          url
          comments(last: 3) {
            nodes {
              author {
                login
                avatarUrl
              }
              body
              createdAt
              url
            }
          }
        }
      }
    }
  }
`

exports.handler = async () => {
  const token = process.env.GITHUB_TOKEN
  const repoFull = process.env.GATSBY_GISCUS_REPO || ""
  const categoryId = process.env.GATSBY_GISCUS_CATEGORY_ID || ""

  if (!token || !repoFull || !categoryId) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "환경변수가 설정되지 않았습니다." }),
    }
  }

  const [owner, repo] = repoFull.split("/")

  try {
    const response = await fetch(GITHUB_GRAPHQL_URL, {
      method: "POST",
      headers: {
        Authorization: `bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: QUERY,
        variables: { owner, repo, categoryId },
      }),
    })

    const data = await response.json()

    if (data.errors) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: data.errors[0].message }),
      }
    }

    const discussions = data?.data?.repository?.discussions?.nodes ?? []

    /* 모든 discussion의 댓글을 평탄화하고 최신순 정렬 후 최대 5개 반환 */
    const comments = discussions
      .flatMap(discussion =>
        discussion.comments.nodes.map(comment => ({
          author: comment.author?.login ?? "익명",
          avatarUrl: comment.author?.avatarUrl ?? "",
          body: comment.body.slice(0, 80).replace(/\n/g, " "),
          postTitle: discussion.title,
          postUrl: discussion.url,
          commentUrl: comment.url,
          createdAt: comment.createdAt,
        }))
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=120", // 2분 캐시
      },
      body: JSON.stringify({ comments }),
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    }
  }
}
