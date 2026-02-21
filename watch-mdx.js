/**
 * MDX 파일 변경 감지 시 gatsby clean && gatsby develop 자동 실행
 * 사용법: npm run develop:watch
 */

const chokidar = require("chokidar")
const { execSync, spawn } = require("child_process")
const path = require("path")

const ROOT = __dirname
let gatsbyProcess = null
let debounceTimer = null

function log(msg) {
  const time = new Date().toLocaleTimeString("ko-KR")
  console.log(`[${time}] ${msg}`)
}

function startGatsby() {
  if (gatsbyProcess) {
    log("기존 Gatsby 프로세스를 종료합니다...")
    gatsbyProcess.kill("SIGTERM")
    gatsbyProcess = null
  }

  log("gatsby clean 실행 중...")
  try {
    execSync("npx gatsby clean", { stdio: "inherit", cwd: ROOT })
  } catch {
    // clean 실패 시에도 develop 재시도
  }

  log("gatsby develop 시작 중...")
  gatsbyProcess = spawn("npx", ["gatsby", "develop"], {
    stdio: "inherit",
    cwd: ROOT,
  })

  gatsbyProcess.on("exit", code => {
    if (code !== null && code !== 0) {
      log(`Gatsby가 코드 ${code}로 종료됐습니다.`)
    }
    gatsbyProcess = null
  })
}

function scheduleRestart(filePath) {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    const rel = path.relative(ROOT, filePath)
    log(`변경 감지: ${rel} → 재시작합니다.`)
    startGatsby()
  }, 500)
}

// MDX 파일 감시
const watcher = chokidar.watch(path.join(ROOT, "content/**/*.mdx"), {
  ignoreInitial: true,
  persistent: true,
})

watcher.on("change", scheduleRestart)
watcher.on("add", scheduleRestart)

log("MDX 파일 감시를 시작합니다. (content/**/*.mdx)")

// 최초 gatsby develop 실행
startGatsby()

// 종료 시 정리
process.on("SIGINT", () => {
  log("종료 신호를 받았습니다. 정리 중...")
  watcher.close()
  if (gatsbyProcess) gatsbyProcess.kill("SIGTERM")
  process.exit(0)
})
