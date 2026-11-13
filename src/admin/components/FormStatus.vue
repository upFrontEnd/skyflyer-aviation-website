<script setup>
import AdminIcon from './AdminIcon.vue'

// Petit retour visuel après une action (enregistrement, envoi...).
// `tone` : 'success' ou 'error'. Rien n'est affiché sans message.
defineProps({
  tone: { type: String, default: 'success' },
  message: { type: String, default: '' }
})
</script>

<template>
  <Transition name="fade">
    <p v-if="message" class="status" :class="`status--${tone}`" role="status">
      <AdminIcon :name="tone === 'error' ? 'alert' : 'check'" :size="16" />
      {{ message }}
    </p>
  </Transition>
</template>
