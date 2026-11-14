<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useSiteSettings } from '../../composables/useSiteSettings.js'
import AdminIcon from './AdminIcon.vue'
import FormStatus from './FormStatus.vue'
import {
  DISCORD_DETAILS,
  DISCORD_MAX_LENGTH,
  buildDiscordMessage,
  emptyDiscordDraft,
  parseDiscordDraft,
  sendDiscordMessage
} from '../useDiscordAnnounce.js'

const { settings, loading, updateSetting } = useSiteSettings()

const draft = ref(emptyDiscordDraft())
let initialized = false

// Même principe que SiteSettingsForm : on n'initialise le formulaire qu'une
// fois, quand les settings arrivent, pour ne pas écraser une saisie en cours.
watch([settings, loading], ([val, isLoading]) => {
  if (initialized || isLoading) return
  initialized = true
  const saved = parseDiscordDraft(val.discord_draft)
  if (saved) {
    draft.value = saved
  } else if (val.twitch_channel) {
    draft.value.link = `https://twitch.tv/${val.twitch_channel}`
  }
}, { immediate: true })

const message = computed(() => buildDiscordMessage(draft.value))
const tooLong = computed(() => message.value.length > DISCORD_MAX_LENGTH)

// Aperçu : on échappe le HTML puis on ne réinterprète que le gras Discord
// (**texte**), seul formatage utilisé dans ces annonces.
const previewHtml = computed(() =>
  message.value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/@everyone/g, '<span class="discord-preview__mention">@everyone</span>')
)

// La photo n'est pas sauvegardée avec le brouillon : c'est un fichier local,
// choisi pour un envoi précis.
const photo = ref(null)
const photoUrl = ref(null)
const photoInput = ref(null)

function setPhoto(file) {
  if (photoUrl.value) URL.revokeObjectURL(photoUrl.value)
  photo.value = file
  photoUrl.value = file ? URL.createObjectURL(file) : null
}

function onPhotoChange(event) {
  setPhoto(event.target.files[0] ?? null)
}

function removePhoto() {
  setPhoto(null)
  if (photoInput.value) photoInput.value.value = ''
}

onBeforeUnmount(() => setPhoto(null))

const status = ref('idle')
const errorMessage = ref('')
const feedback = computed(() => ({
  sent: { tone: 'success', message: 'Message publié sur Discord.' },
  saved: { tone: 'success', message: 'Brouillon enregistré.' },
  error: { tone: 'error', message: errorMessage.value }
}[status.value] ?? { message: '' }))

async function saveDraft() {
  await updateSetting('discord_draft', JSON.stringify(draft.value))
}

async function onSave() {
  status.value = 'saving'
  try {
    await saveDraft()
    status.value = 'saved'
  } catch {
    status.value = 'error'
    errorMessage.value = 'Impossible d\'enregistrer le brouillon.'
  }
}

async function onSend() {
  const ping = draft.value.mentionEveryone ? ' Tout le serveur sera notifié (@everyone).' : ''
  if (!window.confirm(`Publier ce message sur Discord ?${ping}`)) return

  status.value = 'sending'
  try {
    await sendDiscordMessage(message.value, draft.value, photo.value)
    status.value = 'sent'
    // Le brouillon envoyé sert de base au prochain message : on le garde.
    saveDraft().catch(() => {})
  } catch (err) {
    status.value = 'error'
    errorMessage.value = err.message || 'Une erreur est survenue.'
  }
}

function onReset() {
  if (!window.confirm('Vider le formulaire ?')) return
  const link = draft.value.link
  draft.value = { ...emptyDiscordDraft(), link }
  removePhoto()
  status.value = 'idle'
}
</script>

<template>
  <p v-if="loading" class="muted">Chargement…</p>
  <form v-else class="form-layout form-layout--even" @submit.prevent="onSend">
    <div class="form-layout__main">
      <section class="card">
        <div class="card__header">
          <div>
            <h2 class="card__title">Message</h2>
            <p class="card__subtitle">Mise en forme Discord acceptée : **gras**, *italique*, une ligne vide pour un nouveau paragraphe</p>
          </div>
        </div>
        <div class="fields">
          <div class="field">
            <label class="field__label" for="discord-greeting">Salutation</label>
            <input id="discord-greeting" v-model="draft.greeting" class="input" type="text" />
          </div>
          <div class="field">
            <label class="field__label" for="discord-intro">Texte</label>
            <textarea
              id="discord-intro"
              v-model="draft.intro"
              class="input"
              rows="6"
              placeholder="Rendez-vous sur Twitch cet après-midi à **14h00** (13h00 UTC) pour..."
              required
            ></textarea>
          </div>
        </div>
      </section>

      <section class="card">
        <div class="card__header">
          <div>
            <h2 class="card__title">Détails du vol</h2>
            <p class="card__subtitle">Une ligne laissée vide n'apparaît pas dans le message</p>
          </div>
        </div>
        <div class="fields">
          <div class="field-row">
            <div v-for="detail in DISCORD_DETAILS" :key="detail.key" class="field" :class="{ 'field--wide': detail.key === 'route' }">
              <label class="field__label" :for="`discord-${detail.key}`">{{ detail.emoji }} {{ detail.label }}</label>
              <input
                :id="`discord-${detail.key}`"
                v-model="draft[detail.key]"
                class="input"
                type="text"
                :placeholder="detail.placeholder"
              />
            </div>
          </div>
          <div class="field">
            <label class="field__label" for="discord-link">👉 Lien</label>
            <input id="discord-link" v-model="draft.link" class="input" type="url" placeholder="https://twitch.tv/skyflyeraviation" />
          </div>
        </div>
      </section>

      <section class="card">
        <div class="card__header">
          <div>
            <h2 class="card__title">Photo <span class="field__optional">optionnelle</span></h2>
            <p class="card__subtitle">Envoyée en pièce jointe, affichée sous le texte</p>
          </div>
          <button v-if="photo" class="btn btn--ghost" type="button" @click="removePhoto">
            <AdminIcon name="trash" :size="16" /> Retirer
          </button>
        </div>
        <label class="uploader__drop uploader__drop--wide" for="discord-photo">
          <input id="discord-photo" ref="photoInput" class="visually-hidden" type="file" accept="image/*" @change="onPhotoChange" />
          <img v-if="photoUrl" :src="photoUrl" class="uploader__preview" alt="Photo jointe" />
          <span v-else class="uploader__empty">
            <AdminIcon name="image" :size="26" />
            <span>Choisir une photo</span>
          </span>
          <span v-if="photoUrl" class="uploader__overlay"><AdminIcon name="upload" :size="18" /> Remplacer</span>
        </label>
      </section>
    </div>

    <aside class="form-layout__aside form-layout__aside--sticky">
      <section class="card">
        <div class="card__header">
          <div>
            <h2 class="card__title">Aperçu</h2>
            <p class="card__subtitle">Rendu approximatif dans Discord</p>
          </div>
          <span class="badge" :class="tooLong ? 'badge--danger' : 'badge--neutral'">
            {{ message.length }} / {{ DISCORD_MAX_LENGTH }}
          </span>
        </div>

        <div class="discord-preview">
          <img class="discord-preview__avatar" src="../../assets/logo.webp" alt="" width="40" height="40" />
          <div class="discord-preview__content">
            <p class="discord-preview__author">Skyflyer Aviation <span class="discord-preview__tag">APP</span></p>
            <!-- eslint-disable-next-line vue/no-v-html : contenu échappé dans previewHtml -->
            <div class="discord-preview__body" v-html="previewHtml"></div>
            <img v-if="photoUrl" :src="photoUrl" class="discord-preview__photo" alt="" />
          </div>
        </div>

        <label class="switch" for="discord-everyone">
          <input id="discord-everyone" v-model="draft.mentionEveryone" type="checkbox" />
          <span class="switch__track" aria-hidden="true"></span>
          <span class="switch__label">
            Mentionner @everyone
            <small>{{ draft.mentionEveryone ? 'Tout le serveur sera notifié' : 'Aucune notification de masse' }}</small>
          </span>
        </label>

        <label class="switch" for="discord-link-preview">
          <input id="discord-link-preview" v-model="draft.linkPreview" type="checkbox" />
          <span class="switch__track" aria-hidden="true"></span>
          <span class="switch__label">
            Aperçu des liens
            <small>{{ draft.linkPreview ? 'Discord affichera une carte sous chaque lien' : "Liens affichés sans carte d'aperçu" }}</small>
          </span>
        </label>

        <div class="card__actions">
          <button class="btn btn--blurple btn--block" type="submit" :disabled="tooLong || status === 'sending'">
            <AdminIcon name="send" :size="18" />
            {{ status === 'sending' ? 'Envoi…' : 'Envoyer sur Discord' }}
          </button>
          <div class="btn-row">
            <button class="btn" type="button" :disabled="status === 'saving'" @click="onSave">
              <AdminIcon name="save" :size="16" />
              {{ status === 'saving' ? 'Enregistrement…' : 'Brouillon' }}
            </button>
            <button class="btn btn--ghost" type="button" @click="onReset">Vider</button>
          </div>
          <FormStatus :tone="feedback.tone" :message="feedback.message" />
        </div>
      </section>
    </aside>
  </form>
</template>
