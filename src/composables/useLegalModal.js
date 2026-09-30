import { ref } from 'vue'

// Même principe que useContactModal.js : état partagé entre Footer.vue (qui
// ouvre la popup) et LegalNotice.vue (qui l'affiche).
const isOpen = ref(false)

export function useLegalModal() {
  function open() {
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  return { isOpen, open, close }
}
