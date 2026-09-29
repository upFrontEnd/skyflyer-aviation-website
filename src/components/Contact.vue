<script setup>
import { ref, watch, onUnmounted } from 'vue'
import { useContactModal } from '../composables/useContactModal.js'

const { isOpen, close } = useContactModal()

const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY
const CONTACT_EMAIL = 'adelkamel1982@gmail.com'

const form = ref({ name: '', email: '', message: '' })
const status = ref('idle')

async function handleSubmit() {
  if (!WEB3FORMS_ACCESS_KEY) {
    status.value = 'missing-key'
    return
  }

  status.value = 'sending'
  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: `Nouveau message de ${form.value.name} via skyflyeraviation.com`,
        name: form.value.name,
        email: form.value.email,
        message: form.value.message
      })
    })
    const result = await res.json()

    if (result.success) {
      status.value = 'success'
      form.value = { name: '', email: '', message: '' }
    } else {
      status.value = 'error'
    }
  } catch {
    status.value = 'error'
  }
}

// Même pattern que Lightbox.vue : écouteur sur `window`, attaché/retiré au
// fil de isOpen, pour qu'Échap ferme la popup dès qu'elle est ouverte, sans
// dépendre du focus DOM.
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
      <div v-if="isOpen" class="contact-modal" role="dialog" aria-modal="true" aria-labelledby="contact-title" @click.self="close">
        <div class="contact-modal__panel">
          <button class="contact-modal__close" type="button" aria-label="Fermer" @click="close">&times;</button>

          <h2 class="contact__title" id="contact-title">Contact</h2>
          <p class="contact__intro">Une question, une proposition de partenariat ? Écrivez-moi.</p>

          <form class="contact__form" @submit.prevent="handleSubmit">
            <div class="contact__field">
              <label for="contact-name">Nom</label>
              <input id="contact-name" v-model="form.name" type="text" required />
            </div>
            <div class="contact__field">
              <label for="contact-email">E-mail</label>
              <input id="contact-email" v-model="form.email" type="email" required />
            </div>
            <div class="contact__field">
              <label for="contact-message">Message</label>
              <textarea id="contact-message" v-model="form.message" rows="5" required></textarea>
            </div>

            <!--
              Piège à bots recommandé par Web3Forms : une checkbox cachée
              qu'un humain ne peut pas voir/cocher, mais qu'un bot qui remplit
              tous les champs automatiquement cochera — Web3Forms rejette
              alors silencieusement l'envoi.
            -->
            <input type="checkbox" name="botcheck" class="contact__honeypot" tabindex="-1" autocomplete="off" />

            <button class="btn" type="submit" :disabled="status === 'sending'">
              {{ status === 'sending' ? 'Envoi…' : 'Envoyer' }}
            </button>

            <p v-if="status === 'success'" class="contact__feedback contact__feedback--success">
              Message envoyé, merci ! Je vous répondrai au plus vite.
            </p>
            <p v-if="status === 'error'" class="contact__feedback contact__feedback--error">
              Une erreur est survenue, réessayez ou écrivez directement à {{ CONTACT_EMAIL }}.
            </p>
            <p v-if="status === 'missing-key'" class="contact__feedback contact__feedback--error">
              Formulaire non configuré (VITE_WEB3FORMS_ACCESS_KEY manquant dans .env).
            </p>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
