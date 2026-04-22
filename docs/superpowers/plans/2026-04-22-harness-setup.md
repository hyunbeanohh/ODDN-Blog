# Harness Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Netlify 제거, ESLint 구성, Playwright E2E 테스트 추가로 프로젝트 하네스를 완성한다.

**Architecture:** 3단계 순차 접근 — (1) Netlify 배포 잔재 제거 (2) ESLint flat config + 기존 코드 autofix (3) Playwright E2E 포괄적 테스트 스위트. 각 단계는 독립적으로 커밋.

**Tech Stack:** ESLint 9 (flat config), @typescript-eslint, eslint-plugin-react/hooks/import/jsx-a11y, Playwright, Gatsby 5

---

## File Structure

### Phase 1: Netlify Removal
- Delete: `netlify.toml`
- Delete: `netlify/functions/recent-comments.js`
- Delete: `netlify/edge-functions/tsconfig.json`
- Delete: `netlify/` (directory)
- Modify: `package.json` (remove @netlify deps, clean scripts)
- Modify: `.gitignore` (remove .netlify line)
- Modify: `CLAUDE.md` (remove Netlify references)

### Phase 2: ESLint
- Create: `eslint.config.mjs`
- Modify: `package.json` (add eslint deps + scripts)

### Phase 3: Playwright E2E
- Create: `playwright.config.ts`
- Create: `e2e/home.spec.ts`
- Create: `e2e/navigation.spec.ts`
- Create: `e2e/blog-post.spec.ts`
- Create: `e2e/dark-mode.spec.ts`
- Create: `e2e/search.spec.ts`
- Create: `e2e/seo.spec.ts`
- Create: `e2e/external-links.spec.ts`
- Create: `e2e/comments.spec.ts`
- Create: `e2e/responsive.spec.ts`
- Modify: `package.json` (replace test script, add test:ui/test:headed)
- Modify: `.gitignore` (add playwright artifacts)

### Phase 4: Harness Polish
- Create: `.env.example`
- Modify: `CLAUDE.md` (add lint/test commands, Cloudflare context)

---

## Task 1: Netlify 파일 삭제

**Files:**
- Delete: `netlify.toml`
- Delete: `netlify/functions/recent-comments.js`
- Delete: `netlify/edge-functions/tsconfig.json`
- Delete: `netlify/` (directory)

- [ ] **Step 1: Netlify 디렉토리 및 설정 파일 삭제**

```bash
rm netlify.toml
rm -rf netlify/
```

- [ ] **Step 2: 삭제 확인**

```bash
ls netlify.toml 2>&1  # "No such file or directory"
ls netlify/ 2>&1      # "No such file or directory"
```

---

## Task 2: Netlify 의존성 및 참조 제거

**Files:**
- Modify: `package.json`
- Modify: `.gitignore`

- [ ] **Step 1: package.json에서 Netlify devDependencies 제거**

`package.json`의 devDependencies에서 다음 두 항목을 삭제:

```json
"@netlify/edge-functions": "^3.0.3",
"@netlify/plugin-gatsby": "^3.8.4",
```

- [ ] **Step 2: package.json scripts에서 build:ci 정리**

현재 `build:ci`는 Netlify 빌드 환경을 위한 것. `prebuild`와 중복되므로 제거:

변경 전:
```json
"build:ci": "node scripts/generate-content-index.js && node scripts/generate-search-documents.js && gatsby build",
```

변경 후: `build:ci` 키를 삭제한다. `prebuild` + `build`가 동일한 역할을 수행.

- [ ] **Step 3: .gitignore에서 Netlify 항목 제거**

`.gitignore`에서 다음 두 줄 제거:

```
# Local Netlify folder
.netlify
```

- [ ] **Step 4: 커밋**

```bash
git add -A netlify/ netlify.toml package.json .gitignore
git commit -m "chore: remove Netlify deployment files and dependencies"
```

---

## Task 3: ESLint 의존성 설치

**Files:**
- Modify: `package.json`

- [ ] **Step 1: ESLint 패키지 설치**

```bash
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-import eslint-plugin-jsx-a11y eslint-config-prettier
```

- [ ] **Step 2: 설치 확인**

```bash
npx eslint --version  # v9.x.x 출력 확인
```

---

## Task 4: ESLint Flat Config 작성

**Files:**
- Create: `eslint.config.mjs`

- [ ] **Step 1: eslint.config.mjs 생성**

```javascript
import js from "@eslint/js"
import tsPlugin from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"
import reactPlugin from "eslint-plugin-react"
import reactHooksPlugin from "eslint-plugin-react-hooks"
import importPlugin from "eslint-plugin-import"
import jsxA11yPlugin from "eslint-plugin-jsx-a11y"
import prettierConfig from "eslint-config-prettier"

export default [
  {
    ignores: ["node_modules/**", "public/**", ".cache/**", "worker/**", "*.config.*"],
  },
  js.configs.recommended,
  {
    files: ["src/**/*.{ts,tsx,js,jsx}"],
    plugins: {
      "@typescript-eslint": tsPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      import: importPlugin,
      "jsx-a11y": jsxA11yPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: {
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        fetch: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        console: "readonly",
        process: "readonly",
        __dirname: "readonly",
        HTMLElement: "readonly",
        HTMLInputElement: "readonly",
        KeyboardEvent: "readonly",
        IntersectionObserver: "readonly",
        IntersectionObserverEntry: "readonly",
        MutationObserver: "readonly",
        requestAnimationFrame: "readonly",
        cancelAnimationFrame: "readonly",
        Element: "readonly",
        NodeJS: "readonly",
      },
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      // TypeScript
      ...tsPlugin.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-require-imports": "off",

      // React
      ...reactPlugin.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      ...reactHooksPlugin.configs.recommended.rules,

      // Import ordering
      "import/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          "newlines-between": "never",
        },
      ],

      // Accessibility
      ...jsxA11yPlugin.configs.recommended.rules,

      // General
      "no-unused-vars": "off",
      "no-undef": "off",
    },
  },
  prettierConfig,
]
```

- [ ] **Step 2: lint 실행 확인**

```bash
npx eslint src/ 2>&1 | head -50
```

에러 없이 실행되는지 확인. warning은 허용.

---

## Task 5: ESLint npm scripts 추가 + autofix

**Files:**
- Modify: `package.json`

- [ ] **Step 1: package.json에 lint scripts 추가**

```json
"lint": "eslint src/",
"lint:fix": "eslint src/ --fix"
```

- [ ] **Step 2: autofix 실행**

```bash
npm run lint:fix
```

- [ ] **Step 3: 남은 경고/에러 확인**

```bash
npm run lint 2>&1 | tail -20
```

error 수준 위반이 있다면 수동 수정. warn은 그대로 둔다.

- [ ] **Step 4: 커밋**

```bash
git add eslint.config.mjs package.json package-lock.json src/
git commit -m "feat: add ESLint flat config with TypeScript, React, a11y, import rules"
```

---

## Task 6: Playwright 설치 및 설정

**Files:**
- Create: `playwright.config.ts`
- Modify: `package.json`

- [ ] **Step 1: Playwright 설치**

```bash
npm install --save-dev @playwright/test
npx playwright install chromium
```

- [ ] **Step 2: playwright.config.ts 생성**

```typescript
import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  timeout: 30_000,

  use: {
    baseURL: "http://localhost:9000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    command: "npm run build && npm run serve",
    url: "http://localhost:9000",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
})
```

- [ ] **Step 3: package.json test scripts 교체**

변경 전:
```json
"test": "echo \"Write tests! -> https://gatsby.dev/unit-testing\" && exit 1"
```

변경 후:
```json
"test": "playwright test",
"test:ui": "playwright test --ui",
"test:headed": "playwright test --headed"
```

---

## Task 7: E2E 테스트 — 홈페이지

**Files:**
- Create: `e2e/home.spec.ts`

- [ ] **Step 1: e2e/home.spec.ts 작성**

```typescript
import { test, expect } from "@playwright/test"

test.describe("Home Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("should load and display page title", async ({ page }) => {
    await expect(page).toHaveTitle(/오또니/)
  })

  test("should display featured hero carousel", async ({ page }) => {
    const hero = page.locator("section").first()
    await expect(hero).toBeVisible()
  })

  test("should display latest articles section", async ({ page }) => {
    const heading = page.getByRole("heading", { name: "최신 아티클" })
    await expect(heading).toBeVisible()
  })

  test("should display article cards with titles", async ({ page }) => {
    const articles = page.locator("article, [class*='article'], a[href^='/blog/']")
    await expect(articles.first()).toBeVisible()
  })

  test("should display popular posts sidebar", async ({ page }) => {
    const sidebar = page.getByText("인기 있는 글")
    await expect(sidebar).toBeVisible()
  })

  test("should display recent comments sidebar", async ({ page }) => {
    const comments = page.getByText("최신 댓글")
    await expect(comments).toBeVisible()
  })
})
```

---

## Task 8: E2E 테스트 — 네비게이션

**Files:**
- Create: `e2e/navigation.spec.ts`

- [ ] **Step 1: e2e/navigation.spec.ts 작성**

```typescript
import { test, expect } from "@playwright/test"

test.describe("Navigation", () => {
  test("should navigate to articles list page", async ({ page }) => {
    await page.goto("/")
    await page.getByRole("link", { name: "Articles" }).click()
    await expect(page).toHaveURL(/\/articles/)
  })

  test("should display articles list with posts", async ({ page }) => {
    await page.goto("/articles")
    await expect(page.getByRole("heading").first()).toBeVisible()
  })

  test("should navigate to category pages", async ({ page }) => {
    await page.goto("/")
    await page.getByRole("link", { name: "Engineering" }).click()
    await expect(page).toHaveURL(/\/category\/engineering/)
  })

  test("should show 404 page for non-existent route", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist-123")
    await expect(page.locator("body")).toContainText(/404|찾을 수 없|not found/i)
  })

  test("should navigate from article card to blog post", async ({ page }) => {
    await page.goto("/articles")
    const firstLink = page.locator("a[href^='/blog/']").first()
    await expect(firstLink).toBeVisible()
    await firstLink.click()
    await expect(page).toHaveURL(/\/blog\//)
  })
})
```

---

## Task 9: E2E 테스트 — 블로그 포스트

**Files:**
- Create: `e2e/blog-post.spec.ts`

- [ ] **Step 1: e2e/blog-post.spec.ts 작성**

```typescript
import { test, expect } from "@playwright/test"

test.describe("Blog Post Page", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the first available blog post
    await page.goto("/articles")
    const postLink = page.locator("a[href^='/blog/']").first()
    await expect(postLink).toBeVisible()
    await postLink.click()
    await expect(page).toHaveURL(/\/blog\//)
  })

  test("should display post title", async ({ page }) => {
    const heading = page.getByRole("heading").first()
    await expect(heading).toBeVisible()
    const text = await heading.textContent()
    expect(text?.length).toBeGreaterThan(0)
  })

  test("should display post content", async ({ page }) => {
    const article = page.locator("article, [class*='prose'], main")
    await expect(article.first()).toBeVisible()
  })

  test("should render code blocks with syntax highlighting", async ({ page }) => {
    // Shiki renders code with data-language or figure[data-rehype-pretty-code-figure]
    const codeBlocks = page.locator(
      "pre code, figure[data-rehype-pretty-code-figure], [data-language]"
    )
    const count = await codeBlocks.count()
    // Not all posts have code blocks, so this is conditional
    if (count > 0) {
      await expect(codeBlocks.first()).toBeVisible()
    }
  })

  test("should display table of contents", async ({ page }) => {
    const toc = page.locator("nav, [class*='toc'], [class*='table-of-contents']")
    // TOC may not appear on short posts
    const count = await toc.count()
    if (count > 0) {
      await expect(toc.first()).toBeVisible()
    }
  })

  test("should load images without errors", async ({ page }) => {
    const images = page.locator("article img, main img, [class*='prose'] img")
    const count = await images.count()
    for (let i = 0; i < Math.min(count, 5); i++) {
      const img = images.nth(i)
      await expect(img).toBeVisible()
      const naturalWidth = await img.evaluate(
        (el: HTMLImageElement) => el.naturalWidth
      )
      expect(naturalWidth).toBeGreaterThan(0)
    }
  })
})
```

---

## Task 10: E2E 테스트 — 다크모드

**Files:**
- Create: `e2e/dark-mode.spec.ts`

- [ ] **Step 1: e2e/dark-mode.spec.ts 작성**

```typescript
import { test, expect } from "@playwright/test"

test.describe("Dark Mode", () => {
  test("should toggle dark mode on button click", async ({ page }) => {
    await page.goto("/")

    // Find the theme toggle button (sun/moon icon)
    const toggleButton = page.getByRole("button", { name: /모드로 전환/ })
    await expect(toggleButton).toBeVisible()

    // Get initial state
    const htmlEl = page.locator("html")
    const initialClass = await htmlEl.getAttribute("class")

    // Click toggle
    await toggleButton.click()

    // Class should change (dark added or removed)
    const newClass = await htmlEl.getAttribute("class")
    expect(newClass).not.toBe(initialClass)
  })

  test("should persist dark mode preference across navigation", async ({ page }) => {
    await page.goto("/")

    // Enable dark mode
    const toggleButton = page.getByRole("button", { name: /모드로 전환/ })
    await toggleButton.click()

    const htmlAfterToggle = await page.locator("html").getAttribute("class")

    // Navigate to another page
    await page.goto("/articles")

    const htmlAfterNav = await page.locator("html").getAttribute("class")
    expect(htmlAfterNav).toBe(htmlAfterToggle)
  })

  test("should change background color in dark mode", async ({ page }) => {
    await page.goto("/")

    const body = page.locator("body")
    const lightBg = await body.evaluate(el =>
      window.getComputedStyle(el).backgroundColor
    )

    // Toggle to dark
    await page.getByRole("button", { name: /모드로 전환/ }).click()
    await page.waitForTimeout(300) // transition

    const darkBg = await body.evaluate(el =>
      window.getComputedStyle(el).backgroundColor
    )

    expect(lightBg).not.toBe(darkBg)
  })
})
```

---

## Task 11: E2E 테스트 — 검색

**Files:**
- Create: `e2e/search.spec.ts`

- [ ] **Step 1: e2e/search.spec.ts 작성**

```typescript
import { test, expect } from "@playwright/test"

test.describe("Search", () => {
  test("should open search overlay on button click", async ({ page }) => {
    await page.goto("/")

    const searchButton = page.getByRole("button", { name: "검색" })
    await expect(searchButton).toBeVisible()
    await searchButton.click()

    // Search input should appear
    const searchInput = page.getByPlaceholder("검색어를 입력하세요...")
    await expect(searchInput).toBeVisible()
  })

  test("should close search overlay on Escape key", async ({ page }) => {
    await page.goto("/")
    await page.getByRole("button", { name: "검색" }).click()

    const searchInput = page.getByPlaceholder("검색어를 입력하세요...")
    await expect(searchInput).toBeVisible()

    await page.keyboard.press("Escape")
    await expect(searchInput).not.toBeVisible()
  })

  test("should close search overlay on close button click", async ({ page }) => {
    await page.goto("/")
    await page.getByRole("button", { name: "검색" }).click()

    const overlay = page.locator(".fixed.inset-0")
    await expect(overlay).toBeVisible()

    // Click close button (the X icon inside the search dialog)
    const closeButton = overlay.locator("button").last()
    await closeButton.click()

    await expect(overlay).not.toBeVisible()
  })

  test("should show results when typing a search query", async ({ page }) => {
    await page.goto("/")
    await page.getByRole("button", { name: "검색" }).click()

    const searchInput = page.getByPlaceholder("검색어를 입력하세요...")
    await searchInput.fill("Cloudflare")

    // Wait for debounce (150ms) + rendering
    await page.waitForTimeout(500)

    // Should show local search results section
    const localResults = page.getByText("Local title search")
    // Results may or may not appear depending on content match
    const noResults = page.getByText("에 대한 결과가 없습니다")

    const hasLocal = await localResults.isVisible().catch(() => false)
    const hasNone = await noResults.isVisible().catch(() => false)

    // One of these should be visible
    expect(hasLocal || hasNone).toBe(true)
  })

  test("should show empty state before typing", async ({ page }) => {
    await page.goto("/")
    await page.getByRole("button", { name: "검색" }).click()

    const emptyState = page.getByText("검색어를 입력하면 글을 찾아드려요")
    await expect(emptyState).toBeVisible()
  })
})
```

---

## Task 12: E2E 테스트 — SEO

**Files:**
- Create: `e2e/seo.spec.ts`

- [ ] **Step 1: e2e/seo.spec.ts 작성**

```typescript
import { test, expect } from "@playwright/test"

test.describe("SEO", () => {
  test("should have correct meta title on home page", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveTitle(/오또니/)
  })

  test("should have meta description", async ({ page }) => {
    await page.goto("/")
    const description = page.locator('meta[name="description"]')
    await expect(description).toHaveAttribute("content", /오또니/)
  })

  test("should have Open Graph meta tags", async ({ page }) => {
    await page.goto("/")

    const ogTitle = page.locator('meta[property="og:title"]')
    await expect(ogTitle).toHaveAttribute("content", /.+/)

    const ogDescription = page.locator('meta[property="og:description"]')
    await expect(ogDescription).toHaveAttribute("content", /.+/)

    const ogType = page.locator('meta[property="og:type"]')
    await expect(ogType).toHaveAttribute("content", "website")

    const ogUrl = page.locator('meta[property="og:url"]')
    await expect(ogUrl).toHaveAttribute("content", /https?:\/\//)

    const ogImage = page.locator('meta[property="og:image"]')
    await expect(ogImage).toHaveAttribute("content", /.+/)
  })

  test("should have Twitter card meta tags", async ({ page }) => {
    await page.goto("/")

    const twitterCard = page.locator('meta[name="twitter:card"]')
    await expect(twitterCard).toHaveAttribute("content", "summary_large_image")
  })

  test("should have canonical URL", async ({ page }) => {
    await page.goto("/")
    const canonical = page.locator('link[rel="canonical"]')
    await expect(canonical).toHaveAttribute("href", /https?:\/\//)
  })

  test("should serve robots.txt", async ({ page }) => {
    const response = await page.goto("/robots.txt")
    expect(response?.status()).toBe(200)
    const text = await response?.text()
    expect(text).toBeTruthy()
  })

  test("should serve sitemap", async ({ page }) => {
    const response = await page.goto("/sitemap/sitemap-index.xml")
    expect(response?.status()).toBe(200)
  })

  test("blog post should have article meta tags", async ({ page }) => {
    await page.goto("/articles")
    const postLink = page.locator("a[href^='/blog/']").first()
    await postLink.click()
    await expect(page).toHaveURL(/\/blog\//)

    const ogType = page.locator('meta[property="og:type"]')
    await expect(ogType).toHaveAttribute("content", "article")
  })
})
```

---

## Task 13: E2E 테스트 — 외부 링크

**Files:**
- Create: `e2e/external-links.spec.ts`

- [ ] **Step 1: e2e/external-links.spec.ts 작성**

```typescript
import { test, expect } from "@playwright/test"

test.describe("External Links", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("should have GitHub link in header", async ({ page }) => {
    const githubLink = page.getByRole("link", { name: "GitHub 저장소" })
    await expect(githubLink).toBeVisible()
    await expect(githubLink).toHaveAttribute(
      "href",
      "https://github.com/hyunbeanohh/"
    )
    await expect(githubLink).toHaveAttribute("target", "_blank")
    await expect(githubLink).toHaveAttribute("rel", /noopener/)
  })

  test("should have correct social links in site metadata", async ({ page }) => {
    // Verify via structured data or footer links
    const source = await page.content()

    // Check JSON-LD structured data contains the site URL
    expect(source).toContain("https://oddn.ai.kr")
  })
})
```

---

## Task 14: E2E 테스트 — 댓글 (Giscus)

**Files:**
- Create: `e2e/comments.spec.ts`

- [ ] **Step 1: e2e/comments.spec.ts 작성**

```typescript
import { test, expect } from "@playwright/test"

test.describe("Comments", () => {
  test("should display comments section on blog post", async ({ page }) => {
    await page.goto("/articles")
    const postLink = page.locator("a[href^='/blog/']").first()
    await expect(postLink).toBeVisible()
    await postLink.click()
    await expect(page).toHaveURL(/\/blog\//)

    // Comments section heading
    const commentsHeading = page.getByRole("heading", { name: "댓글" })
    await expect(commentsHeading).toBeVisible()
  })

  test("should load Giscus widget or show configuration message", async ({
    page,
  }) => {
    await page.goto("/articles")
    await page.locator("a[href^='/blog/']").first().click()
    await expect(page).toHaveURL(/\/blog\//)

    // Either Giscus iframe loads or the "not configured" message shows
    const giscusFrame = page.locator("iframe.giscus-frame")
    const notConfigured = page.getByText("Giscus 댓글이 아직 설정되지 않았습니다")

    // Wait for either to appear
    await page.waitForTimeout(3000)

    const hasGiscus = await giscusFrame.isVisible().catch(() => false)
    const hasMessage = await notConfigured.isVisible().catch(() => false)

    expect(hasGiscus || hasMessage).toBe(true)
  })
})
```

---

## Task 15: E2E 테스트 — 반응형

**Files:**
- Create: `e2e/responsive.spec.ts`

- [ ] **Step 1: e2e/responsive.spec.ts 작성**

```typescript
import { test, expect } from "@playwright/test"

test.describe("Responsive Design", () => {
  test("should display correctly on mobile viewport", async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 375, height: 812 },
    })
    const page = await context.newPage()
    await page.goto("/")

    // Page should load without horizontal overflow
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1) // 1px tolerance

    // Main content should be visible
    const heading = page.getByRole("heading", { name: "최신 아티클" })
    await expect(heading).toBeVisible()

    await context.close()
  })

  test("should display correctly on tablet viewport", async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 768, height: 1024 },
    })
    const page = await context.newPage()
    await page.goto("/")

    // Page should load
    await expect(page).toHaveTitle(/오또니/)

    // Content sections should be visible
    const heading = page.getByRole("heading", { name: "최신 아티클" })
    await expect(heading).toBeVisible()

    await context.close()
  })

  test("should show header navigation on desktop", async ({ page }) => {
    // Default Playwright viewport is desktop-sized
    await page.goto("/")

    const articlesLink = page.getByRole("link", { name: "Articles" })
    await expect(articlesLink).toBeVisible()

    const searchButton = page.getByRole("button", { name: "검색" })
    await expect(searchButton).toBeVisible()
  })

  test("blog post should be readable on mobile", async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 375, height: 812 },
    })
    const page = await context.newPage()
    await page.goto("/articles")

    const postLink = page.locator("a[href^='/blog/']").first()
    if ((await postLink.count()) > 0) {
      await postLink.click()
      await expect(page).toHaveURL(/\/blog\//)

      // Post content should be visible
      const heading = page.getByRole("heading").first()
      await expect(heading).toBeVisible()
    }

    await context.close()
  })
})
```

---

## Task 16: Playwright 테스트 실행 및 커밋

- [ ] **Step 1: .gitignore에 Playwright 아티팩트 추가**

`.gitignore` 파일 끝에 추가:

```
# Playwright
test-results/
playwright-report/
playwright/.cache/
```

- [ ] **Step 2: 전체 테스트 실행**

```bash
npm run test
```

모든 테스트가 PASS 하는지 확인. 실패하는 테스트가 있으면 셀렉터나 assertion을 수정.

- [ ] **Step 3: 커밋**

```bash
git add playwright.config.ts e2e/ package.json package-lock.json .gitignore
git commit -m "feat: add Playwright E2E test suite with comprehensive coverage"
```

---

## Task 17: .env.example 생성

**Files:**
- Create: `.env.example`

- [ ] **Step 1: .env.example 작성**

```bash
# ─── Gatsby (build time) ───────────────────────────
GATSBY_GISCUS_REPO=
GATSBY_GISCUS_REPO_ID=
GATSBY_GISCUS_CATEGORY=Comments
GATSBY_GISCUS_CATEGORY_ID=

# Provider: "giscus" (default) or "cloudflare"
GATSBY_COMMENTS_PROVIDER=giscus

# ─── Cloudflare Worker (runtime secrets) ───────────
GITHUB_TOKEN=
TURNSTILE_SECRET_KEY=
SEARCH_SYNC_TOKEN=
ADMIN_API_TOKEN=
```

- [ ] **Step 2: .gitignore 확인**

`.gitignore`에 `.env*`가 있으므로 `.env.example`은 예외 처리 필요:

`.gitignore`에 추가:

```
!.env.example
```

---

## Task 18: CLAUDE.md 업데이트

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: CLAUDE.md 수정**

Deploy/runtime 섹션 변경:
- `Netlify (netlify.toml, netlify/functions, netlify/edge-functions)` → `Cloudflare Pages + Workers (wrangler.jsonc, worker/)`

Repo commands에 추가:
```
- Lint: `npm run lint`
- Lint fix: `npm run lint:fix`
- Test (E2E): `npm run test`
- Test UI mode: `npm run test:ui`
- Test headed: `npm run test:headed`
```

Workflow step 3의 lint 항목 명확화:
- `lint: run configured lint command if present` → `lint: npm run lint`

- [ ] **Step 2: 커밋**

```bash
git add .env.example .gitignore CLAUDE.md
git commit -m "chore: add .env.example, update CLAUDE.md for Cloudflare and new tooling"
```

---

## Self-Review Checklist

- [x] **Spec coverage:** Netlify 제거 (Task 1-2), ESLint (Task 3-5), Playwright E2E 9개 테스트 파일 (Task 7-15), .gitignore 보강 (Task 16-17), CLAUDE.md 반영 (Task 18), .env.example (Task 17) — 모든 스펙 항목 커버됨
- [x] **Placeholder scan:** 모든 코드 블록에 실제 코드 포함, TBD/TODO 없음
- [x] **Type consistency:** Playwright test import/expect 패턴 일관, ESLint config 변수명 일관
