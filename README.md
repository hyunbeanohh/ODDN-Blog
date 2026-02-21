# 오또니의 개발 블로그

Gatsby + MDX + Tailwind CSS로 만든 개인 기술 블로그입니다.

## 기술 스택

| 분류 | 기술 |
|---|---|
| 프레임워크 | [Gatsby 5](https://www.gatsbyjs.com/) |
| 언어 | TypeScript |
| 스타일링 | [Tailwind CSS](https://tailwindcss.com/) |
| 콘텐츠 | MDX (`gatsby-plugin-mdx`) |
| 댓글 | [Giscus](https://giscus.app/) |
| 배포 | [Netlify](https://www.netlify.com/) |

## 시작하기

### 요구사항

> Node.js **18 ~ 22** 버전을 사용해야 합니다.
> Node.js 23 이상에서는 Gatsby LMDB 호환 문제로 `ERR_BUFFER_OUT_OF_BOUNDS` 오류가 발생할 수 있습니다.

```bash
# nvm 사용 시 (프로젝트 루트의 .nvmrc에 22 지정됨)
nvm use
```

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:8000)
npm run develop

# MDX 파일 변경 감지와 함께 개발 서버 실행
npm run develop:watch

# 프로덕션 빌드
npm run build

# 빌드 결과물 로컬 미리보기
npm run serve

# 빌드 캐시 초기화
npm run clean
```

## 프로젝트 구조

```
.
├── content/
│   └── blog/          # MDX 블로그 포스트
├── src/
│   ├── components/    # 재사용 컴포넌트
│   ├── context/       # React Context
│   ├── pages/         # 페이지 컴포넌트
│   └── templates/     # 포스트 템플릿
├── static/            # 정적 파일
├── gatsby-config.js   # Gatsby 설정
├── gatsby-node.js     # 빌드 시 페이지 생성 로직
├── tailwind.config.js # Tailwind CSS 설정
├── watch-mdx.js       # MDX 파일 변경 감지 스크립트
└── netlify.toml       # Netlify 배포 설정
```

## 블로그 포스트 작성

`content/blog/` 디렉터리에 `.mdx` 파일을 추가합니다.

```mdx
---
title: 포스트 제목
date: "2026-01-01"
description: 포스트 요약
tags: ["태그"]
author: 오또니
---

본문 내용
```

## 배포

Netlify를 통해 자동 배포됩니다. `main` 브랜치에 푸시하면 빌드 및 배포가 트리거됩니다.

## 라이선스

0BSD
