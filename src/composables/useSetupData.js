import { ref } from 'vue'
import { supabase } from '../lib/supabase.js'

// Même pattern singleton que usePartnersData : état partagé au niveau du
// module, un seul fetch pour le site public ET l'admin.
const items = ref([])
const loading = ref(true)
const error = ref(null)
let hasFetched = false

async function fetchItems() {
  loading.value = true
  error.value = null

  if (!supabase) {
    error.value = 'Supabase non configuré (VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY manquants dans .env)'
    loading.value = false
    return
  }

  const { data, error: fetchError } = await supabase
    .from('setup_items')
    .select('*')
    .order('display_order', { ascending: true })

  if (fetchError) {
    error.value = fetchError.message
  } else {
    items.value = data
  }
  loading.value = false
}

export function useSetupData() {
  if (!hasFetched) {
    hasFetched = true
    fetchItems()
  }

  async function addItem(fields) {
    if (!supabase) throw new Error('Supabase non configuré')
    const { error: err } = await supabase.from('setup_items').insert(fields)
    if (err) throw err
    await fetchItems()
  }

  async function updateItem(id, fields) {
    if (!supabase) throw new Error('Supabase non configuré')
    const { error: err } = await supabase.from('setup_items').update(fields).eq('id', id)
    if (err) throw err
    await fetchItems()
  }

  async function deleteItem(id) {
    if (!supabase) throw new Error('Supabase non configuré')
    const { error: err } = await supabase.from('setup_items').delete().eq('id', id)
    if (err) throw err
    await fetchItems()
  }

  return { items, loading, error, addItem, updateItem, deleteItem, refresh: fetchItems }
}
