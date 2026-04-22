# Harness Setup Design: E2E Tests, ESLint, Netlify Removal

**Date:** 2026-04-22
**Status:** Approved
**Approach:** Sequential (Foundation First) — Netlify 제거 → ESLint → Playwright E2E

---

## 1. Netlify 제거

### 삭제 대상

| 파일/디렉토리 | 이유 |
|--------------|------|
| `netlify.toml` | 빌드/배포/캐시 설정 전체 |
| `netlify/functions/recent-comments.js` | Cloudflare Worker `/api/recent-comments`로 대체됨 |
| `netlify/edge-functions/tsconfig.json` | 빈 edge function 디렉토리 |
| `netlify/` 디렉토리 | 상위 전체 |

### 의존성 제거 (devDependencies)

- `@netlify/edge-functions`
- `@netlify/plugin-gatsby`

### 유지

- `wrangler.jsonc` — Cloudflare 설정 (D1, Vectorize, AI 바인딩)
- `worker/src/index.ts` — 완성된 Worker 코드
- `migrations/` — D1 마이그레이션

### 영향 범위

소스 코드(`src/`)에 `@netlify` import 없음. 배포 레벨만 변경되므로 안전.

---

## 2. ESLint 구성

### 패키지 (devDependencies)

- `eslint`
- `@typescript-eslint/parser`
- `@typescript-eslint/eslint-plugin`
- `eslint-plugin-react`
- `eslint-plugin-react-hooks`
- `eslint-plugin-import`
- `eslint-plugin-jsx-a11y`
- `eslint-config-prettier`

### 설정: `eslint.config.mjs` (Flat Config)

| 카테고리 | 규칙 수준 |
|---------|----------|
| TypeScript | `recommended` |
| React | `recommended` + hooks |
| Import | 정렬 강제 (builtin → external → internal → sibling) |
| a11y | `recommended` |
| Unused vars | `error` (`_` 접두사 허용) |
| Prettier | `eslint-config-prettier`로 스타일 규칙 비활성화 |

### Ignore 대상

`node_modules`, `public`, `.cache`, `worker/`

### npm scripts

- `"lint": "eslint src/"`
- `"lint:fix": "eslint src/ --fix"`

### 기존 코드 호환 전략

- autofix 가능한 항목은 즉시 수정
- 핵심 규칙(unused vars, hooks rules)만 `error`, 나머지 `warn`으로 시작

---

## 3. Playwright E2E 테스트

### 패키지 (devDependencies)

- `@playwright/test`

### 설정: `playwright.config.ts`

- Base URL: `http://localhost:9000` (gatsby serve)
- 브라우저: Chromium만 (추후 확장 가능)
- `webServer`: `npm run build && npm run serve` 자동 실행
- 스크린샷: 실패 시만
- 타임아웃: 30초

### 테스트 디렉토리: `e2e/`

| 파일 | 테스트 케이스 |
|------|-------------|
| `home.spec.ts` | 홈페이지 로딩, 캐러셀 표시, 최신 글 목록, 히어로 포스트 |
| `navigation.spec.ts` | 글 목록(/articles) 진입, 페이지네이션, 카테고리 필터링, 404 페이지 |
| `blog-post.spec.ts` | 개별 글 진입, 코드 블록 Shiki 렌더링, 이미지 로딩, TOC |
| `dark-mode.spec.ts` | 다크모드 토글, 테마 전환 시 스타일 변경 |
| `search.spec.ts` | 검색 오버레이 열기/닫기, 검색어 입력 시 결과 표시 |
| `seo.spec.ts` | 메타 태그(title, description, og:*), sitemap.xml, robots.txt |
| `external-links.spec.ts` | GitHub/LinkedIn/포트폴리오 링크 href 검증 |
| `comments.spec.ts` | Giscus iframe 로딩 확인 |
| `responsive.spec.ts` | 모바일 뷰포트 햄버거 메뉴, 레이아웃 검증 |

### npm scripts

- `"test": "playwright test"` (placeholder 대체)
- `"test:ui": "playwright test --ui"`
- `"test:headed": "playwright test --headed"`

### 제약사항

- Giscus: 외부 서비스 → iframe 로딩 여부만 확인
- 검색: 정적 빌드 후 클라이언트 검색만 (Vectorize API 호출은 범위 밖)

---

## 4. 추가 하네스 보완

### 4-1. `.gitignore` 보강

추가 항목:
- `test-results/`
- `playwright-report/`
- `playwright/.cache/`
- `.env.local`

### 4-2. `package.json` scripts 정리

- `build:ci`와 `prebuild` 중복 제거
- Netlify 전용 환경변수 의존 제거

### 4-3. CLAUDE.md 워크플로 반영

- `lint: npm run lint` 명시
- Repo commands에 `lint`, `lint:fix`, `test:ui`, `test:headed` 추가
- Netlify 참조 제거, Cloudflare 반영

### 4-4. `.env.example` 생성

```
# Gatsby (build time)
GATSBY_GISCUS_REPO=
GATSBY_GISCUS_REPO_ID=
GATSBY_GISCUS_CATEGORY_ID=

# Cloudflare Worker (runtime)
GITHUB_TOKEN=
TURNSTILE_SECRET_KEY=
SEARCH_SYNC_TOKEN=
ADMIN_API_TOKEN=
```

---

## 범위 외 (별도 작업으로 분리)

- CI/CD (GitHub Actions) 구성
- `puppeteer` devDependency 제거 여부 확인
- Cloudflare Worker 단위 테스트 (vitest/miniflare)
