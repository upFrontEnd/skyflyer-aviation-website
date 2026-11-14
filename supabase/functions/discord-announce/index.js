// Edge Function Supabase : publie un message sur un salon Discord via webhook.
//
// Pourquoi passer par ici plutôt que d'appeler Discord depuis l'admin :
// l'URL du webhook suffit à poster dans le salon. Si elle était dans le
// bundle Vite (VITE_*), n'importe qui pourrait la lire et spammer le salon.
// Elle reste donc côté serveur, dans le secret DISCORD_WEBHOOK_URL.
//
// Secrets requis (Edge Functions > Secrets) : DISCORD_WEBHOOK_URL.
// SUPABASE_URL et SUPABASE_ANON_KEY sont fournis automatiquement.
import { createClient } from 'npm:@supabase/supabase-js@2'

const DISCORD_MAX_LENGTH = 2000
// Limite d'upload d'un webhook sur un serveur sans boost.
const DISCORD_MAX_FILE_SIZE = 10 * 1024 * 1024
// Flag Discord SUPPRESS_EMBEDS (1 << 2) : pas d'aperçu pour les liens du
// message. La photo jointe reste affichée (pièce jointe, pas un embed).
const SUPPRESS_EMBEDS = 1 << 2

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Méthode non autorisée' }, 405)

  // "Verify JWT" de Supabase accepte aussi la clé anon (publique) : on
  // vérifie donc explicitement qu'un VRAI utilisateur est connecté. Les
  // inscriptions étant désactivées, tout utilisateur authentifié est l'admin
  // (même règle que les policies RLS des tables).
  const authHeader = req.headers.get('Authorization') ?? ''
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL'),
    Deno.env.get('SUPABASE_ANON_KEY'),
    { global: { headers: { Authorization: authHeader } } }
  )
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return json({ error: 'Non authentifié' }, 401)

  const webhookUrl = Deno.env.get('DISCORD_WEBHOOK_URL')
  if (!webhookUrl) return json({ error: 'DISCORD_WEBHOOK_URL non configuré' }, 500)

  // multipart/form-data : champs "content", "mentionEveryone" et
  // "linkPreview" ("true" ou "false") et, en option, "file" (la photo jointe
  // au message).
  let form
  try {
    form = await req.formData()
  } catch {
    return json({ error: 'Corps de requête invalide' }, 400)
  }

  const rawContent = form.get('content')
  const content = typeof rawContent === 'string' ? rawContent.trim() : ''
  if (!content) return json({ error: 'Message vide' }, 400)
  if (content.length > DISCORD_MAX_LENGTH) {
    return json({ error: `Message trop long (${content.length}/${DISCORD_MAX_LENGTH})` }, 400)
  }

  const file = form.get('file')
  const photo = file instanceof File && file.size > 0 ? file : null
  if (photo && !photo.type.startsWith('image/')) {
    return json({ error: 'Le fichier joint doit être une image' }, 400)
  }
  if (photo && photo.size > DISCORD_MAX_FILE_SIZE) {
    return json({ error: 'Photo trop lourde (10 Mo maximum)' }, 400)
  }

  // allowed_mentions explicite : @everyone ne notifie que si l'admin l'a
  // demandé (case cochée), même si le texte le contient par ailleurs.
  const payloadJson = {
    content,
    allowed_mentions: { parse: form.get('mentionEveryone') === 'true' ? ['everyone'] : [] },
    // Aperçus de liens masqués sauf si l'admin les a demandés
    ...(form.get('linkPreview') === 'true' ? {} : { flags: SUPPRESS_EMBEDS })
  }

  // Format attendu par Discord pour un message avec pièce jointe : le JSON
  // dans "payload_json" et le fichier dans "files[0]".
  const discordBody = new FormData()
  discordBody.append('payload_json', JSON.stringify(payloadJson))
  if (photo) discordBody.append('files[0]', photo, photo.name || 'photo.jpg')

  const discordRes = await fetch(webhookUrl, { method: 'POST', body: discordBody })

  if (!discordRes.ok) {
    const detail = await discordRes.text()
    return json({ error: `Discord a refusé le message (${discordRes.status})`, detail }, 502)
  }

  return json({ ok: true })
})
