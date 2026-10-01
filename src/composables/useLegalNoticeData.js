import { ref } from 'vue'
import { supabase } from '../lib/supabase.js'

// Même principe que useEventData.js : une seule ligne (id = 1) contenant
// tout le HTML de la page de mentions légales.
const content = ref(null)
const loading = ref(true)
const error = ref(null)
let hasFetched = false

async function fetchLegalNotice() {
  loading.value = true
  error.value = null

  if (!supabase) {
    error.value = 'Supabase non configuré (VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY manquants dans .env)'
    loading.value = false
    return
  }

  const { data, error: fetchError } = await supabase
    .from('legal_notice')
    .select('*')
    .eq('id', 1)
    .single()

  if (fetchError) {
    error.value = fetchError.message
  } else {
    content.value = data.content_html
  }
  loading.value = false
}

export function useLegalNoticeData() {
  if (!hasFetched) {
    hasFetched = true
    fetchLegalNotice()
  }

  async function updateLegalNotice(html) {
    if (!supabase) throw new Error('Supabase non configuré')
    const { error: updateError } = await supabase
      .from('legal_notice')
      .upsert({ id: 1, content_html: html })
    if (updateError) throw updateError
    content.value = html
  }

  return { content, loading, error, updateLegalNotice, refresh: fetchLegalNotice }
}
