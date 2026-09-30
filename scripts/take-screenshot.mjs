// Exécuté uniquement par le workflow CI .github/workflows/screenshot.yml,
// contre le site servi en local par `vite preview` — jamais en développement
// normal. Produit docs/preview.png, référencé dans le README.
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const URL = process.env.PREVIEW_URL || 'http://localhost:4173'

mkdirSync('docs', { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
await page.goto(URL, { waitUntil: 'load', timeout: 30000 })
// Laisse le temps au hero (image aléatoire) et au lecteur Twitch de s'afficher
// avant la capture, plutôt qu'une page à moitié chargée.
await page.waitForTimeout(2000)
await page.screenshot({ path: 'docs/preview.png', fullPage: true })
await browser.close()
