import { mkdir, writeFile } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { chromium } from '@playwright/test'
import { resolve } from 'node:path'

// Run from the project root. This build-time pipeline makes the demo independent
// of WebGL support and external photo hosting at presentation time.
const publicDir = resolve('public')
const photoDir = resolve(publicDir, 'images')
const clayDir = resolve(publicDir, 'illustrations')
await mkdir(photoDir, { recursive: true })
await mkdir(clayDir, { recursive: true })

const photos = [
  ['olena.jpg', '1580489944761-15a19d654956', 720],
  ['sofia.jpg', '1534528741775-53994a69daeb', 720],
  ['marta.jpg', '1524504388940-b1c1722653e1', 720],
  ['daryna.jpg', '1488426862026-3ee34a7d66df', 720],
  ['studio.jpg', '1600948836101-f9ffda59d250', 1800],
]
await Promise.all(photos.map(async ([filename, id, width]) => {
  const response = await fetch(`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=85`, { signal: AbortSignal.timeout(60000) })
  if (!response.ok) throw new Error(`Photo download failed: ${filename}, HTTP ${response.status}`)
  await writeFile(resolve(photoDir, filename), Buffer.from(await response.arrayBuffer()))
  console.log(`Photo ready: ${filename}`)
}))

const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '5188', '--strictPort'], { stdio: 'pipe' })
let browser
try {
  await new Promise((ready, reject) => {
    const timeout = setTimeout(() => reject(new Error('Asset server startup timeout')), 20000)
    server.stdout.on('data', chunk => { if (chunk.toString().includes('5188')) { clearTimeout(timeout); ready() } })
    server.on('error', reject)
    server.on('exit', code => { if (code) reject(new Error(`Asset server exited: ${code}`)) })
  })
  browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1000, height: 850 }, deviceScaleFactor: 2 })
  await page.goto('http://127.0.0.1:5188/scripts/clay-preview.html', { waitUntil: 'networkidle' })
  await page.locator('canvas').first().waitFor()
  for (const kind of ['hero', 'hair', 'nails', 'brows', 'flower']) {
    const dataUrl = await page.locator(`[data-kind="${kind}"] canvas`).evaluate(canvas => canvas.toDataURL('image/png'))
    await writeFile(resolve(clayDir, `${kind}.png`), Buffer.from(dataUrl.split(',')[1], 'base64'))
    console.log(`Clay illustration ready: ${kind}`)
  }
} finally {
  await browser?.close()
  server.kill()
}
