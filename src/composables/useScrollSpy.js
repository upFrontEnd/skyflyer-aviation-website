import { ref, onMounted, onUnmounted } from 'vue'
import { navigation } from '../data/navigation.js'

export function useScrollSpy() {
  const activeHref = ref(null)
  let sections = []
  let rafId = null

  function update() {
    // Ligne de déclenchement : 35% depuis le haut du viewport
    const trigger = window.scrollY + window.innerHeight * 0.35

    // On cherche la dernière section dont le haut se trouve au-dessus de la
    // ligne de déclenchement — c'est forcément la section que l'utilisateur
    // est en train de lire.
    let active = null
    for (const { href, el } of sections) {
      if (el.getBoundingClientRect().top + window.scrollY <= trigger) {
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
    sections = navigation
      .filter(item => item.href)
      .map(item => ({ href: item.href, el: document.querySelector(item.href) }))
      .filter(item => item.el)

    window.addEventListener('scroll', onScroll, { passive: true })
    update()
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
    if (rafId) cancelAnimationFrame(rafId)
  })

  return { activeHref }
}
