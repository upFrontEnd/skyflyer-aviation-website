// Exécuté uniquement par le workflow CI .github/workflows/screenshot.yml,
// contre le site servi en local par `vite preview` — jamais en développement
// normal. Produit docs/preview.png, référencé dans le README.
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const URL = process.env.PREVIEW_URL || 'http://localhost:4173'

mkdirSync('docs', { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
// networkidle : attend que les données Supabase et les images (logos
// partenaires, etc.) aient fini d'arriver, plutôt qu'un délai fixe.
await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 })
// Petite marge pour les sections chargées à la demande et leurs images.
await page.waitForTimeout(2000)
await page.screenshot({ path: 'docs/preview.png', fullPage: true })
await browser.close()
