<script setup>
import { ref, watch } from 'vue'
import { useEventData } from '../../composables/useEventData.js'
import { getPublicImageUrl } from '../../lib/supabase.js'
import ImageUploader from './ImageUploader.vue'
import { useCollapsible } from '../useCollapsible.js'

const { event, loading, updateEvent } = useEventData()
const { isOpen, toggle } = useCollapsible('event')

const form = ref({
  active: false,
  title: '',
  description_fr: '',
  description_en: '',
  scheduled_flight: '',
  aircraft: '',
  simulator: '',
  date_fr: '',
  date_en: '',
  image_path: null,
  image_width: null,
  image_height: null
})

// watch plutôt qu'une simple lecture au montage : `event` peut encore valoir
// `null` au moment où ce composant apparaît (le fetch lancé par
// useEventData() n'a pas forcément fini) — watch se redéclenche dès que la
// vraie donnée arrive, { immediate: true } couvre aussi le cas où elle est
// déjà là.
watch(
  event,
  (value) => {
    if (value) form.value = { ...value }
  },
  { immediate: true }
)

const status = ref('idle')

function onImageUploaded({ path, width, height }) {
  form.value.image_path = path
  form.value.image_width = width
  form.value.image_height = height
}

async function onSubmit() {
  status.value = 'saving'
  try {
    await updateEvent(form.value)
    status.value = 'saved'
  } catch {
    status.value = 'error'
  }
}
</script>

<template>
  <section class="admin-section event" :class="{ 'admin-panel-closed': !isOpen }">
    <h2 class="admin-panel__title" @click="toggle">
      Prochain événement
      <svg class="admin-panel__arrow" :class="{ 'admin-panel__arrow--open': isOpen }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
    </h2>
    <div class="admin-collapse" :class="{ 'admin-collapse--closed': !isOpen }">
      <div class="admin-collapse__inner">
    <p v-if="loading">Chargement…</p>
    <form v-else class="admin-form" @submit.prevent="onSubmit">
      <div class="admin-field">
        <label for="event-title">Titre</label>
        <input id="event-title" v-model="form.title" type="text" required />
      </div>
      <div class="admin-field">
        <label for="event-desc-fr">🇫🇷 Description</label>
        <textarea id="event-desc-fr" v-model="form.description_fr" rows="3" required></textarea>
      </div>
      <div class="admin-field">
        <label for="event-desc-en">🇬🇧 Description</label>
        <textarea id="event-desc-en" v-model="form.description_en" rows="3" required></textarea>
      </div>
      <div class="admin-field">
        <label for="event-flight">Vol programmé</label>
        <input id="event-flight" v-model="form.scheduled_flight" type="text" required />
      </div>
      <div class="admin-field">
        <label for="event-aircraft">Avion</label>
        <input id="event-aircraft" v-model="form.aircraft" type="text" required />
      </div>
      <div class="admin-field">
        <label for="event-sim">Simulateur</label>
        <input id="event-sim" v-model="form.simulator" type="text" required />
      </div>
      <div class="admin-field">
        <label for="event-sim">🇫🇷 Date</label>
        <input id="event-sim" v-model="form.date_fr" type="text" required />
      </div>
      <div class="admin-field">
        <label for="event-sim">🇬🇧 Date</label>
        <input id="event-sim" v-model="form.date_en" type="text" required />
      </div>
      <div class="admin-field">
        <label>Image de l'événement</label>
        <ImageUploader folder="event" :current-url="getPublicImageUrl(form.image_path)" @uploaded="onImageUploaded" />
      </div>
      <div class="admin-display-on-site">
        <button class="btn btn--success" type="submit" :disabled="status === 'saving'">
        {{ status === 'saving' ? 'Enregistrement…' : 'Enregistrer' }}
      </button>
      <label for="event-active">
          <input id="event-active" v-model="form.active" type="checkbox" />
          Afficher l'événement sur le site
        </label>
      </div>
      
      <p v-if="status === 'saved'" class="admin-feedback admin-feedback--success">Enregistré.</p>
      <p v-if="status === 'error'" class="admin-feedback admin-feedback--error">Une erreur est survenue.</p>
    </form>
      </div>
    </div>
  </section>
</template>
