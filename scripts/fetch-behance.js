// Exécuté côté Node (via `bun run fetch:behance`, et automatiquement avant
// chaque `bun run build` grâce au script "prebuild" de package.json).
// Behance n'a pas d'API publique : on lit l'état JSON embarqué dans la page
// du profil (`profileProjects`). Si Behance est injoignable ou change son
// format, on conserve le JSON déjà généré plutôt que de casser le build.
import { writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUTPUT_PATH = join(__dirname, '../src/data/behance-contributions.json')

const PROFILE_URL = 'https://www.behance.net/adel1982'
const COVER_WIDTH = 404

// Extrait le tableau JSON qui suit `"profileProjects":` en équilibrant les
// crochets (le HTML contient des dizaines de Mo de JSON, un regex ne suffit pas).
function extractProjects(html) {
  const key = '"profileProjects":'
  const start = html.indexOf(key)
  if (start === -1) throw new Error('profileProjects introuvable')
  const from = start + key.length
  let depth = 0
  let inString = false
  let escaped = false
  for (let i = from; i < html.length; i++) {
    const c = html[i]
    if (inString) {
      if (escaped) escaped = false
      else if (c === '\\') escaped = true
      else if (c === '"') inString = false
    } else if (c === '"') inString = true
    else if (c === '[' || c === '{') depth++
    else if (c === ']' || c === '}') {
      depth--
      if (depth === 0) return JSON.parse(html.slice(from, i + 1))
    }
  }
  throw new Error('profileProjects non terminé')
}

try {
  const res = await fetch(PROFILE_URL, { headers: { 'User-Agent': 'Mozilla/5.0' } })
  if (!res.ok) throw new Error(`Behance a répondu ${res.status}`)

  const projects = extractProjects(await res.text())
    .filter((p) => p.privacyLevel === 'PUBLIC')
    .map((p) => {
      const covers = p.covers?.allAvailable ?? []
      const cover = covers.find((c) => c.width === COVER_WIDTH && c.type === 'WEBP')
        ?? covers.find((c) => c.width === COVER_WIDTH)
      return { id: p.id, title: p.name, thumbnail: cover?.url, link: p.url, publishedOn: p.publishedOn }
    })
    .filter((p) => p.thumbnail)
    .sort((a, b) => b.publishedOn - a.publishedOn)

  if (!projects.length) throw new Error('aucun projet trouvé')

  mkdirSync(dirname(OUTPUT_PATH), { recursive: true })
  writeFileSync(OUTPUT_PATH, JSON.stringify(projects, null, 2))
  console.log(`Behance : ${projects.length} projet(s) récupéré(s)`)
} catch (err) {
  console.warn(`Behance ignoré (${err.message}), JSON existant conservé`)
}
