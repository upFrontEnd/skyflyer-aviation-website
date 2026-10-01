import { ref } from 'vue'
import { supabase } from '../lib/supabase.js'

// Singleton (même principe que les composables de src/composables/) : un
// seul état de session pour toute la mini-app admin, même si plusieurs
// composants appellent useAdminAuth().
const user = ref(null)
const loading = ref(true)
let hasInitialized = false

export function useAdminAuth() {
  // init() ne s'exécute qu'une fois (hasInitialized), même si AdminApp.vue
  // ET un composant enfant appellent tous les deux useAdminAuth() : on ne
  // veut qu'UN SEUL écouteur onAuthStateChange, pas un par composant.
  function init() {
    if (hasInitialized) return
    hasInitialized = true

    if (!supabase) {
      loading.value = false
      return
    }

    // getSession() lit la session déjà stockée par Supabase (localStorage)
    // si l'admin s'était déjà connecté lors d'une visite précédente — évite
    // de redemander le mot de passe à chaque rechargement de page.
    supabase.auth.getSession().then(({ data }) => {
      user.value = data.session?.user ?? null
      loading.value = false
    })

    // onAuthStateChange se redéclenche à chaque connexion/déconnexion,
    // y compris celles initiées par login()/logout() ci-dessous : pas besoin
    // de mettre à jour `user` manuellement dans ces deux fonctions.
    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user ?? null
    })
  }

  async function login(email, password) {
    if (!supabase) throw new Error('Supabase non configuré')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  async function logout() {
    await supabase?.auth.signOut()
  }

  return { user, loading, init, login, logout }
}
