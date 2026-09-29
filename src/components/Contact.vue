<script setup>
import { ref, watch, onUnmounted, nextTick } from 'vue'
import { useContactModal } from '../composables/useContactModal.js'

const { isOpen, close } = useContactModal()

const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY
const CONTACT_EMAIL = 'adelkamel1982@gmail.com'

const form = ref({ name: '', email: '', message: '' })
const status = ref('idle')

// Élément où le widget reCAPTCHA sera injecté — recréé à chaque ouverture
// de la popup (v-if plus bas), donc le widget doit être re-rendu à chaque
// fois plutôt qu'une seule fois au montage du composant.
const recaptchaContainer = ref(null)
let recaptchaWidgetId = null

// Le script Google n'est chargé qu'à la première ouverture de la popup (pas
// au chargement de la page) : personne ne visite forcément le formulaire de
// contact, autant ne pas payer son poids pour rien. recaptchaScriptPromise
// mémorise ce chargement pour ne jamais l'injecter deux fois si la popup se
// rouvre plusieurs fois.
let recaptchaScriptPromise = null

function loadRecaptchaScript() {
  if (recaptchaScriptPromise) return recaptchaScriptPromise

  recaptchaScriptPromise = new Promise((resolve) => {
    if (window.grecaptcha?.render) {
      resolve(window.grecaptcha)
      return
    }
    window.__onRecaptchaLoad = () => resolve(window.grecaptcha)
    const script = document.createElement('script')
    script.src = 'https://www.google.com/recaptcha/api.js?onload=__onRecaptchaLoad&render=explicit'
    script.async = true
    script.defer = true
    document.head.appendChild(script)
  })

  return recaptchaScriptPromise
}

async function renderRecaptcha() {
  if (!RECAPTCHA_SITE_KEY || !recaptchaContainer.value) return
  const grecaptcha = await loadRecaptchaScript()
  recaptchaWidgetId = grecaptcha.render(recaptchaContainer.value, {
    sitekey: RECAPTCHA_SITE_KEY,
    theme: 'dark',
    // Le format "normal" (304px de large, fixe) déborde du panneau sur
    // petit mobile ; "compact" (164px) tient sur n'importe quelle largeur.
    size: window.matchMedia('(max-width: 480px)').matches ? 'compact' : 'normal'
  })
}

async function handleSubmit() {
  if (!WEB3FORMS_ACCESS_KEY) {
    status.value = 'missing-key'
    return
  }

  if (RECAPTCHA_SITE_KEY && !window.grecaptcha?.getResponse(recaptchaWidgetId)) {
    status.value = 'captcha-required'
    return
  }

  status.value = 'sending'
  try {
    // FormData plutôt que JSON.stringify : avec un Content-Type: application/json
    // explicite, le navigateur envoie d'abord une requête OPTIONS (preflight)
    // que l'API Web3Forms ne gère pas, ce qui fait échouer l'appel par CORS
    // avant même d'atteindre leur serveur. FormData laisse le navigateur fixer
    // lui-même le Content-Type (multipart/form-data) — une combinaison
    // considérée "simple" par le navigateur, donc sans preflight.
    const formData = new FormData()
    formData.append('access_key', WEB3FORMS_ACCESS_KEY)
    formData.append('subject', `Nouveau message de ${form.value.name} via skyflyeraviation.com`)
    formData.append('name', form.value.name)
    formData.append('email', form.value.email)
    formData.append('message', form.value.message)
    if (RECAPTCHA_SITE_KEY) {
      formData.append('g-recaptcha-response', window.grecaptcha.getResponse(recaptchaWidgetId))
    }

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
  } finally {
    // Un token reCAPTCHA n'est utilisable qu'une fois : on réinitialise le
    // widget après chaque tentative, réussie ou non, pour que l'utilisateur
    // puisse renvoyer un message sans recharger la page.
    window.grecaptcha?.reset(recaptchaWidgetId)
  }
}

// Même pattern que Lightbox.vue : écouteur sur `window`, attaché/retiré au
// fil de isOpen, pour qu'Échap ferme la popup dès qu'elle est ouverte, sans
// dépendre du focus DOM. On en profite pour (re)rendre le widget reCAPTCHA
// à chaque ouverture, puisque son conteneur est recréé à chaque fois.
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

            <!--
              Le honeypot ci-dessus arrête les bots génériques, mais pas
              quelqu'un qui ciblerait directement la clé Web3Forms (visible
              dans le bundle JS, inévitable sur un site statique) en
              contournant complètement ce formulaire. reCAPTCHA protège
              contre ce cas-là. v-if : pas de widget si la clé n'est pas
              configurée, le formulaire reste utilisable quand même.
            -->
            <div v-if="RECAPTCHA_SITE_KEY" ref="recaptchaContainer" class="contact__captcha"></div>

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
            <p v-if="status === 'captcha-required'" class="contact__feedback contact__feedback--error">
              Merci de valider le contrôle anti-robot avant d'envoyer.
            </p>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
