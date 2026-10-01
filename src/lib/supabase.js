import { createClient } from '@supabase/supabase-js'

// VITE_SUPABASE_ANON_KEY est une clé PUBLIQUE par conception (comme le
// Client ID Twitch ou la clé Web3Forms déjà dans ce projet) : elle ne donne
// aucun accès en écriture par elle-même. C'est la Row Level Security (RLS),
// configurée côté base de données (voir README, section "Espace admin"), qui
// décide qui peut lire/écrire quoi. Sans RLS correctement configurée, cette
// clé donnerait un accès total — ne jamais désactiver RLS sur les tables.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

// null si .env n'est pas encore configuré : permet au site de continuer à
// fonctionner (avec un message d'erreur clair dans les composables plutôt
// qu'un plantage) avant que Supabase soit mis en place.
export const supabase = SUPABASE_URL && SUPABASE_ANON_KEY
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null

export const UPLOADS_BUCKET = 'site-uploads'

// Le bucket "site-uploads" est public en lecture (voir policies RLS, README)
// mais on stocke seulement le CHEMIN du fichier en base (ex. "event.webp"),
// pas l'URL complète — plus court, et ça survit si jamais le projet Supabase
// change de domaine un jour. getPublicUrl() reconstruit l'URL à la volée.
export function getPublicImageUrl(path) {
  if (!supabase || !path) return null
  return supabase.storage.from(UPLOADS_BUCKET).getPublicUrl(path).data.publicUrl
}

