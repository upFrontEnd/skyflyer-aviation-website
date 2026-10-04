<script setup>
import { watch, onUnmounted } from 'vue'
import { useLegalModal } from '../composables/useLegalModal.js'
import { useLegalNoticeData } from '../composables/useLegalNoticeData.js'

const { isOpen, close } = useLegalModal()
const { content } = useLegalNoticeData()

// Même pattern que Contact.vue/Lightbox.vue pour la fermeture au clavier.
function onKeydown(e) {
  if (e.key === 'Escape') close()
}

watch(isOpen, (open) => {
  if (open) window.addEventListener('keydown', onKeydown)
  else window.removeEventListener('keydown', onKeydown)
})

onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <Transition name="contact-modal-fade">
      <div v-if="isOpen" class="contact-modal" role="dialog" aria-modal="true" aria-labelledby="legal-title" @click.self="close">
        <div class="contact-modal__panel legal-notice">
          <button class="contact-modal__close" type="button" aria-label="Fermer" @click="close">&times;</button>
          
          <h2 class="contact__title" id="legal-title">Mentions légales</h2>
          <div v-if="content" class="legal-notice__body" v-html="content"></div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
