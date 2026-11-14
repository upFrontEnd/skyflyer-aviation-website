import { supabase } from '../lib/supabase.js'

export const DISCORD_MAX_LENGTH = 2000

// Lignes de détails du message, dans l'ordre d'affichage. Une ligne dont la
// valeur est vide n'apparaît pas dans le message final.
export const DISCORD_DETAILS = [
  { key: 'aircraft', emoji: '✈️', label: 'Avion', placeholder: 'Boeing 737 MAX 8 (iFly)' },
  { key: 'airline', emoji: '🏢', label: 'Compagnie', placeholder: 'Norwegian Sweden (NSW)' },
  { key: 'network', emoji: '🌐', label: 'Réseau', placeholder: 'VATSIM' },
  { key: 'terminal', emoji: '🚪', label: 'Terminal', placeholder: '2D (portes D02 à D22)' },
  { key: 'route', emoji: '🗺️', label: 'Route probable', placeholder: 'NURMO UN874 VEKIN ...' }
]

export function emptyDiscordDraft() {
  return {
    greeting: 'Bonjour à tous,',
    intro: '',
    ...Object.fromEntries(DISCORD_DETAILS.map(d => [d.key, ''])),
    link: '',
    mentionEveryone: true,
    linkPreview: false
  }
}

// Assemble le texte envoyé à Discord à partir du brouillon : paragraphes
// séparés par une ligne vide, comme un message tapé à la main.
export function buildDiscordMessage(draft) {
  const blocks = []
  const greeting = draft.greeting?.trim()
  const intro = draft.intro?.trim()
  if (greeting) blocks.push(greeting)
  if (intro) blocks.push(intro)

  const details = DISCORD_DETAILS
    .filter(d => draft[d.key]?.trim())
    .map(d => `${d.emoji} **${d.label} :** ${draft[d.key].trim()}`)
  if (details.length) blocks.push(details.join('\n'))

  const link = draft.link?.trim()
  if (link) blocks.push(`👉 ${link}`)
  if (draft.mentionEveryone) blocks.push('@everyone')

  return blocks.join('\n\n')
}

// Le brouillon est stocké dans la table "settings" (clé discord_draft) sous
// forme de JSON : selon le type de la colonne value (text ou jsonb), on peut
// relire une chaîne ou un objet, d'où les deux cas.
export function parseDiscordDraft(raw) {
  if (!raw) return null
  try {
    const value = typeof raw === 'string' ? JSON.parse(raw) : raw
    return { ...emptyDiscordDraft(), ...value }
  } catch {
    return null
  }
}

// Discord refuse les fichiers de plus de 10 Mo via webhook. Une photo plus
// lourde (capture 4K en PNG par exemple) est réencodée en JPEG, et réduite
// à 2560 px de large au maximum. Sinon le fichier part tel quel, sans perte.
const MAX_PHOTO_SIZE = 8 * 1024 * 1024
const MAX_PHOTO_WIDTH = 2560

export async function preparePhoto(file) {
  if (file.size <= MAX_PHOTO_SIZE) return file

  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_PHOTO_WIDTH / bitmap.width)
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.9))

  const name = file.name.replace(/\.[^.]+$/, '') + '.jpg'
  return new File([blob], name, { type: 'image/jpeg' })
}

export async function sendDiscordMessage(content, { mentionEveryone, linkPreview }, photo = null) {
  if (!supabase) throw new Error('Supabase non configuré')
  const body = new FormData()
  body.append('content', content)
  body.append('mentionEveryone', String(mentionEveryone))
  body.append('linkPreview', String(linkPreview))
  if (photo) body.append('file', await preparePhoto(photo))

  // functions.invoke ajoute automatiquement le jeton de session de l'admin
  // connecté : c'est lui que l'Edge Function vérifie.
  const { data, error } = await supabase.functions.invoke('discord-announce', { body })
  if (error) {
    // En cas de réponse 4xx/5xx, le message d'erreur utile est dans le corps.
    const res = await error.context?.json?.().catch(() => null)
    throw new Error(res?.error ?? error.message)
  }
  return data
}
