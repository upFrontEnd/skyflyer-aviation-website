import { ref } from 'vue'

// Page affichée dans l'admin, partagée entre la barre latérale et les
// raccourcis de l'accueil. Elle est reflétée dans l'ancre de l'URL
// (admin.html#partners) : un rechargement rouvre la même page, et les
// boutons Précédent/Suivant du navigateur fonctionnent.
const current = ref(readHash())

function readHash() {
  return window.location.hash.slice(1) || 'overview'
}

window.addEventListener('hashchange', () => {
  current.value = readHash()
})

export function useAdminNav() {
  function go(key) {
    if (key === current.value) return
    window.location.hash = key === 'overview' ? '' : key
    current.value = key
  }

  return { current, go }
}
