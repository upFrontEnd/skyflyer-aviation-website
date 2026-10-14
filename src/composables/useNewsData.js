import { ref } from 'vue'
import { supabase } from '../lib/supabase.js'

const news = ref([])
const loading = ref(true)
const error = ref(null)
let hasFetched = false

async function fetchNews() {
  loading.value = true
  error.value = null

  if (!supabase) {
    error.value = 'Supabase non configuré'
    loading.value = false
    return
  }

  const { data, error: fetchError } = await supabase
    .from('news')
    .select('*')
    .order('display_order', { ascending: true })

  if (fetchError) {
    error.value = fetchError.message
  } else {
    news.value = data
  }
  loading.value = false
}

export function useNewsData() {
  if (!hasFetched) {
    hasFetched = true
    fetchNews()
  }

  async function addNews(fields) {
    if (!supabase) throw new Error('Supabase non configuré')
    const { error: insertError } = await supabase.from('news').insert(fields)
    if (insertError) throw insertError
    await fetchNews()
  }

  async function updateNews(id, fields) {
    if (!supabase) throw new Error('Supabase non configuré')
    const { error: updateError } = await supabase.from('news').update(fields).eq('id', id)
    if (updateError) throw updateError
    await fetchNews()
  }

  async function deleteNews(id) {
    if (!supabase) throw new Error('Supabase non configuré')
    const { error: deleteError } = await supabase.from('news').delete().eq('id', id)
    if (deleteError) throw deleteError
    await fetchNews()
  }

  return { news, loading, error, addNews, updateNews, deleteNews, refresh: fetchNews }
}
