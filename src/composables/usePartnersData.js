import { ref } from 'vue'
import { supabase } from '../lib/supabase.js'

// Même principe que useEventData.js / useTwitchStream.js : état partagé,
// un seul fetch pour tout le site.
const partners = ref([])
const loading = ref(true)
const error = ref(null)
let hasFetched = false

async function fetchPartners() {
  loading.value = true
  error.value = null

  if (!supabase) {
    error.value = 'Supabase non configuré (VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY manquants dans .env)'
    loading.value = false
    return
  }

  const { data, error: fetchError } = await supabase
    .from('partners')
    .select('*')
    .order('display_order', { ascending: true })

  if (fetchError) {
    error.value = fetchError.message
  } else {
    partners.value = data
  }
  loading.value = false
}

export function usePartnersData() {
  if (!hasFetched) {
    hasFetched = true
    fetchPartners()
  }

  async function addPartner(fields) {
    if (!supabase) throw new Error('Supabase non configuré')
    const { error: insertError } = await supabase.from('partners').insert(fields)
    if (insertError) throw insertError
    await fetchPartners()
  }

  async function updatePartner(id, fields) {
    if (!supabase) throw new Error('Supabase non configuré')
    const { error: updateError } = await supabase.from('partners').update(fields).eq('id', id)
    if (updateError) throw updateError
    await fetchPartners()
  }

  async function deletePartner(id) {
    if (!supabase) throw new Error('Supabase non configuré')
    const { error: deleteError } = await supabase.from('partners').delete().eq('id', id)
    if (deleteError) throw deleteError
    await fetchPartners()
  }

  return { partners, loading, error, addPartner, updatePartner, deletePartner, refresh: fetchPartners }
}
