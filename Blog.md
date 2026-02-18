# Gatsby + Netlify 블로그 빠른 배포 가이드 (Next.js 전환 대비 구조)

목표:
- v0.dev로 만든 메인 UI를 Gatsby에 이식
- 콘텐츠는 MD/MDX + frontmatter 기반
- URL은 `/blog/:slug/` 고정
- GraphQL 의존 최소화
- Tailwind 기반 스타일
- Netlify로 2시간 이내 배포 완료
- 향후 Next.js 전환이 쉬운 구조 유지

## 0. 전환 대비 설계 원칙 (반드시 지킬 것)

1. 콘텐츠는 `content/blog/**` 아래의 MD/MDX 파일로만 관리
2. frontmatter에 모든 메타 데이터 정의 (title, summary, slug 등)
3. Gatsby 전용 기능 최소화 (StaticImage 사용 금지)
4. URL 규칙은 `/blog/:slug/` 고정
5. 스타일은 Tailwind 또는 CSS Modules만 사용
6. GraphQL 쿼리는 "메타 데이터만" 조회
7. 태그/카테고리 로직은 UI와 분리 가능하도록 설계