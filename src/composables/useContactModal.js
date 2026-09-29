import { ref } from 'vue'

// Même principe que useTheme.js : la ref vit au niveau du module (pas à
// l'intérieur de useContactModal), donc Header.vue (qui ouvre la popup) et
// Contact.vue (qui l'affiche) partagent le même isOpen, sans passer par un
// props/emit entre composants qui ne sont pas parent/enfant.
const isOpen = ref(false)

export function useContactModal() {
  function open() {
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  return { isOpen, open, close }
}
