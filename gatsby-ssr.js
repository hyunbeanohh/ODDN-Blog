import React from "react"
import { ThemeProvider } from "./src/context/ThemeContext"

export const onRenderBody = ({ setHtmlAttributes, setHeadComponents }) => {
  setHtmlAttributes({ lang: "en" })
  // FOUC 방지: 첫 페인트 이전에 localStorage에서 테마를 읽어 data-theme 속성을 설정
  setHeadComponents([
    <script
      key="theme-init"
      dangerouslySetInnerHTML={{
        __html: `(function(){try{var t=localStorage.getItem('theme')||'light';document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
      }}
    />,
  ])
}

export const wrapRootElement = ({ element }) => (
  <ThemeProvider>{element}</ThemeProvider>
)
