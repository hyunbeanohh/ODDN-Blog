import * as React from "react"
import Giscus from "@giscus/react"
import { useTheme } from "../context/ThemeContext"

/**
 * Giscus 댓글 컴포넌트 (GitHub Discussions 기반)
 *
 * 설정 방법:
 * 1. https://giscus.app 에서 레포지토리를 연결하고 설정값을 확인
 * 2. 아래 .env.development / .env.production 파일에 환경변수를 입력하거나
 *    직접 이 파일의 GISCUS_CONFIG 값을 채워넣으세요.
 *
 * 환경변수 예시 (.env.development):
 *   GATSBY_GISCUS_REPO=owner/repo-name
 *   GATSBY_GISCUS_REPO_ID=R_xxxxxxxxxxxxxxxx
 *   GATSBY_GISCUS_CATEGORY=Comments
 *   GATSBY_GISCUS_CATEGORY_ID=DIC_xxxxxxxxxxxxxxxx
 */
const GISCUS_CONFIG = {
  repo: process.env.GATSBY_GISCUS_REPO || "owner/repo",
  repoId: process.env.GATSBY_GISCUS_REPO_ID || "",
  category: process.env.GATSBY_GISCUS_CATEGORY || "Comments",
  categoryId: process.env.GATSBY_GISCUS_CATEGORY_ID || "",
}

const Comments = () => {
  const { theme } = useTheme()
  const isConfigured =
    GISCUS_CONFIG.repo !== "owner/repo" &&
    GISCUS_CONFIG.repoId !== "" &&
    GISCUS_CONFIG.categoryId !== ""

  if (!isConfigured) {
    return (
      <section className="mt-8">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">댓글</h2>
        <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            Giscus 댓글이 아직 설정되지 않았습니다.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            <a
              href="https://giscus.app"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-600 dark:hover:text-gray-300"
            >
              giscus.app
            </a>
            에서 설정값을 확인하고{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">.env.development</code>
            에 입력해주세요.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="mt-8">
      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">댓글</h2>
      <Giscus
        repo={GISCUS_CONFIG.repo as `${string}/${string}`}
        repoId={GISCUS_CONFIG.repoId}
        category={GISCUS_CONFIG.category}
        categoryId={GISCUS_CONFIG.categoryId}
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme={theme === "dark" ? "dark" : "light"}
        lang="ko"
        loading="lazy"
      />
    </section>
  )
}

export default Comments
