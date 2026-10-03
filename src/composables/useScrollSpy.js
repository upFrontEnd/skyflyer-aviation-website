import { ref, onMounted, onUnmounted } from 'vue'
import { navigation } from '../data/navigation.js'

// Liste des hrefs extraite une seule fois au niveau du module
const hrefs = navigation.filter(item => item.href).map(item => item.href)

export function useScrollSpy() {
  const activeHref = ref(null)
  let rafId = null

  function update() {
    const trigger = window.scrollY + window.innerHeight * 0.35

    let active = null
    for (const href of hrefs) {
      // querySelector à chaque appel : les composants async (Contributions,
      // Shop) n'existent pas encore dans le DOM au moment du onMounted —
      // les chercher ici garantit qu'ils sont détectés dès qu'ils apparaissent.
      const el = document.querySelector(href)
      if (el && el.getBoundingClientRect().top + window.scrollY <= trigger) {
        active = href
      }
    }
    activeHref.value = active
  }

  function onScroll() {
    if (rafId) return
    rafId = requestAnimationFrame(() => {
      update()
      rafId = null
    })
  }

  onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    update()
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
    if (rafId) cancelAnimationFrame(rafId)
  })

  return { activeHref }
}
