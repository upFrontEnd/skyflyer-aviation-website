import { ref } from 'vue'
import { supabase } from '../lib/supabase.js'

const settings = ref({})
const loading = ref(true)
const error = ref(null)
let hasFetched = false

async function fetchSettings() {
  loading.value = true
  error.value = null

  if (!supabase) {
    error.value = 'Supabase non configuré'
    loading.value = false
    return
  }

  const { data, error: fetchError } = await supabase.from('settings').select('key, value')
  if (fetchError) {
    error.value = fetchError.message
  } else {
    settings.value = Object.fromEntries((data ?? []).map(r => [r.key, r.value]))
  }
  loading.value = false
}

export function useSiteSettings() {
  if (!hasFetched) {
    hasFetched = true
    fetchSettings()
  }

  async function updateSetting(key, value) {
    if (!supabase) throw new Error('Supabase non configuré')
    const { error: upsertError } = await supabase
      .from('settings')
      .upsert({ key, value }, { onConflict: 'key' })
    if (upsertError) throw upsertError
    settings.value = { ...settings.value, [key]: value }
  }

  return { settings, loading, error, updateSetting }
}
