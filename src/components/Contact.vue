<script setup>
import { ref, watch, onUnmounted, nextTick } from 'vue'
import { useContactModal } from '../composables/useContactModal.js'
import { useLocale } from '../composables/useLocale.js'

const { isOpen, close } = useContactModal()
const { locale } = useLocale()

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
    const formData = new FormData()
    formData.append('access_key', WEB3FORMS_ACCESS_KEY)
    formData.append('subject', `Nouveau message de ${form.value.name} via skyflyeraviation.com`)
    formData.append('name', form.value.name)
    formData.append('email', form.value.email)
    formData.append('message', form.value.message)

    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: formData
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

watch(isOpen, async (open) => {
  if (open) {
    window.addEventListener('keydown', onKeydown)
    await nextTick()
    renderRecaptcha()
  } else {
    window.removeEventListener('keydown', onKeydown)
  }
})

onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <Transition name="contact-modal-fade">
      <div v-if="isOpen" class="contact-modal" role="dialog" aria-modal="true" aria-labelledby="contact-title" @click.self="close">
        <div class="contact-modal__panel">
          <button class="contact-modal__close" type="button" :aria-label="locale === 'fr' ? 'Fermer' : 'Close'" @click="close">&times;</button>

          <h2 class="contact__title" id="contact-title">Contact</h2>
          <p class="contact__intro">{{ locale === 'fr' ? 'Une question, une proposition de partenariat ? Écrivez-moi.' : 'A question, a partnership proposal? Get in touch.' }}</p>

          <form class="contact__form" @submit.prevent="handleSubmit">
            <div class="contact__field">
              <label for="contact-name">{{ locale === 'fr' ? 'Nom' : 'Name' }}</label>
              <input id="contact-name" v-model="form.name" type="text" required />
            </div>
            <div class="contact__field">
              <label for="contact-email">{{ locale === 'fr' ? 'E-mail' : 'Email' }}</label>
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
              {{ status === 'sending' ? (locale === 'fr' ? 'Envoi…' : 'Sending…') : (locale === 'fr' ? 'Envoyer' : 'Send') }}
            </button>

            <p v-if="status === 'success'" class="contact__feedback contact__feedback--success">
              {{ locale === 'fr' ? 'Message envoyé, merci ! Je vous répondrai au plus vite.' : "Message sent, thank you! I'll get back to you as soon as possible." }}
            </p>
            <p v-if="status === 'error'" class="contact__feedback contact__feedback--error">
              {{ locale === 'fr' ? `Une erreur est survenue, réessayez ou écrivez directement à ${CONTACT_EMAIL}.` : `Something went wrong, please try again or email me directly at ${CONTACT_EMAIL}.` }}
            </p>
            <p v-if="status === 'missing-key'" class="contact__feedback contact__feedback--error">
              {{ locale === 'fr' ? 'Formulaire non configuré (VITE_WEB3FORMS_ACCESS_KEY manquant dans .env).' : 'Form not configured (VITE_WEB3FORMS_ACCESS_KEY missing in .env).' }}
            </p>
            <p v-if="status === 'captcha-required'" class="contact__feedback contact__feedback--error">
              {{ locale === 'fr' ? "Merci de valider le contrôle anti-robot avant d'envoyer." : 'Please complete the anti-bot check before sending.' }}
            </p>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
