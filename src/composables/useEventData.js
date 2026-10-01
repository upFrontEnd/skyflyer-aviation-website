import { ref } from 'vue'
import { supabase } from '../lib/supabase.js'

// Même principe que useTwitchStream.js : état partagé au niveau du module,
// un seul fetch peu importe combien de composants (site public, admin)
// appellent useEventData().
const event = ref(null)
const loading = ref(true)
const error = ref(null)
let hasFetched = false

async function fetchEvent() {
  loading.value = true
  error.value = null

  if (!supabase) {
    error.value = 'Supabase non configuré (VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY manquants dans .env)'
    loading.value = false
    return
  }

  // La table "event" ne contient qu'une seule ligne (id = 1, voir le SQL du
  // README) : single() renvoie directement cette ligne plutôt qu'un tableau
  // d'un seul élément.
  const { data, error: fetchError } = await supabase.from('event').select('*').eq('id', 1).single()

  if (fetchError) {
    error.value = fetchError.message
  } else {
    event.value = data
  }
  loading.value = false
}

export function useEventData() {
  if (!hasFetched) {
    hasFetched = true
    fetchEvent()
  }

  // upsert plutôt qu'update : fonctionne aussi bien si la ligne id=1
  // n'existe pas encore (avant le seed initial) que si elle existe déjà —
  // évite de distinguer "créer" et "mettre à jour" côté admin.
  async function updateEvent(fields) {
    if (!supabase) throw new Error('Supabase non configuré')
    const { data, error: updateError } = await supabase
      .from('event')
      .upsert({ id: 1, ...fields })
      .select()
      .single()
    if (updateError) throw updateError
    event.value = data
    return data
  }

  return { event, loading, error, updateEvent, refresh: fetchEvent }
}
