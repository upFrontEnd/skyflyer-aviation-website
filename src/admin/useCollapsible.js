import { ref } from 'vue'

export function useCollapsible(key, defaultOpen = true) {
  const stored = localStorage.getItem(`admin-panel-${key}`)
  const isOpen = ref(stored !== null ? stored === 'true' : defaultOpen)

  function toggle() {
    isOpen.value = !isOpen.value
    localStorage.setItem(`admin-panel-${key}`, isOpen.value)
  }

  return { isOpen, toggle }
}
