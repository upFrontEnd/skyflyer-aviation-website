// Exécuté côté Node (via `bun run fetch:contributions`, et automatiquement
// avant chaque `bun run build` grâce au script "prebuild" de package.json) —
// pas dans le navigateur, donc pas soumis à la politique CORS qui bloque un
// fetch() direct de ce même endpoint depuis un composant Vue. Le résultat
// est écrit dans un fichier JSON statique que le site importe normalement.
import { writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUTPUT_PATH = join(__dirname, '../src/data/flightsim-contributions.json')

const API_URL = 'https://flightsim.to/backend/search/fetch-addons?author=SkyflyerAviation&sort=newest&per_page=5'

const res = await fetch(API_URL, { headers: { Accept: 'application/json' } })
if (!res.ok) {
  throw new Error(`flightsim.to a répondu ${res.status}`)
}
const { data } = await res.json()

const contributions = data.map((item) => ({
  id: item.id,
  title: item.title,
  thumbnail: item.thumbnail,
  category: item.subCategory || item.category,
  link: item.link,
  createdAt: item.createdAt
}))

mkdirSync(dirname(OUTPUT_PATH), { recursive: true })
writeFileSync(OUTPUT_PATH, JSON.stringify(contributions, null, 2))