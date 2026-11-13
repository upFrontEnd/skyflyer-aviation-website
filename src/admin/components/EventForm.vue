<script setup>
import { computed, ref, watch } from 'vue'
import { useEventData } from '../../composables/useEventData.js'
import { getPublicImageUrl } from '../../lib/supabase.js'
import ImageUploader from './ImageUploader.vue'
import AdminIcon from './AdminIcon.vue'
import FormStatus from './FormStatus.vue'

const { event, loading, updateEvent } = useEventData()

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
  url: '',
  image_path: null,
  image_width: null,
  image_height: null
})

// watch plutôt qu'une simple lecture au montage : `event` peut encore valoir
// `null` au moment où ce composant apparaît (le fetch lancé par
// useEventData() n'a pas forcément fini). watch se redéclenche dès que la
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
const feedback = computed(() => ({
  saved: { tone: 'success', message: 'Événement enregistré.' },
  error: { tone: 'error', message: 'Une erreur est survenue.' }
}[status.value] ?? { message: '' }))

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
  <p v-if="loading" class="muted">Chargement…</p>
  <form v-else class="form-layout" @submit.prevent="onSubmit">
    <div class="form-layout__main">
      <section class="card">
        <div class="card__header">
          <div>
            <h2 class="card__title">Contenu</h2>
            <p class="card__subtitle">Titre et texte de présentation, en français et en anglais</p>
          </div>
        </div>
        <div class="fields">
          <div class="field">
            <label class="field__label" for="event-title">Titre</label>
            <input id="event-title" v-model="form.title" class="input" type="text" required />
          </div>
          <div class="field">
            <label class="field__label" for="event-desc-fr">🇫🇷 Description</label>
            <textarea id="event-desc-fr" v-model="form.description_fr" class="input" rows="4" required></textarea>
          </div>
          <div class="field">
            <label class="field__label" for="event-desc-en">🇬🇧 Description</label>
            <textarea id="event-desc-en" v-model="form.description_en" class="input" rows="4" required></textarea>
          </div>
          <div class="field">
            <label class="field__label" for="event-url">Lien</label>
            <input id="event-url" v-model="form.url" class="input" type="text" placeholder="https://..." required />
          </div>
        </div>
      </section>

      <section class="card">
        <div class="card__header">
          <div>
            <h2 class="card__title">Détails du vol</h2>
            <p class="card__subtitle">Affichés sous la description</p>
          </div>
        </div>
        <div class="fields">
          <div class="field-row">
            <div class="field">
              <label class="field__label" for="event-date-fr">🇫🇷 Date</label>
              <input id="event-date-fr" v-model="form.date_fr" class="input" type="text" required />
            </div>
            <div class="field">
              <label class="field__label" for="event-date-en">🇬🇧 Date</label>
              <input id="event-date-en" v-model="form.date_en" class="input" type="text" required />
            </div>
          </div>
          <div class="field">
            <label class="field__label" for="event-flight">Vol programmé</label>
            <input id="event-flight" v-model="form.scheduled_flight" class="input" type="text" required />
          </div>
          <div class="field-row">
            <div class="field">
              <label class="field__label" for="event-aircraft">Avion</label>
              <input id="event-aircraft" v-model="form.aircraft" class="input" type="text" required />
            </div>
            <div class="field">
              <label class="field__label" for="event-sim">Simulateur</label>
              <input id="event-sim" v-model="form.simulator" class="input" type="text" required />
            </div>
          </div>
        </div>
      </section>
    </div>

    <aside class="form-layout__aside">
      <section class="card">
        <div class="card__header">
          <div>
            <h2 class="card__title">Publication</h2>
            <p class="card__subtitle">Visibilité de l'encart sur le site</p>
          </div>
        </div>
        <label class="switch" for="event-active">
          <input id="event-active" v-model="form.active" type="checkbox" />
          <span class="switch__track" aria-hidden="true"></span>
          <span class="switch__label">
            Afficher sur le site
            <small>{{ form.active ? 'Visible par les visiteurs' : 'Masqué pour le moment' }}</small>
          </span>
        </label>
        <div class="card__actions">
          <button class="btn btn--primary btn--block" type="submit" :disabled="status === 'saving'">
            <AdminIcon name="save" :size="18" />
            {{ status === 'saving' ? 'Enregistrement…' : 'Enregistrer' }}
          </button>
          <FormStatus :tone="feedback.tone" :message="feedback.message" />
        </div>
      </section>

      <section class="card">
        <div class="card__header">
          <div>
            <h2 class="card__title">Image</h2>
            <p class="card__subtitle">Redimensionnée et convertie en WebP automatiquement</p>
          </div>
        </div>
        <ImageUploader folder="event" wide :current-url="getPublicImageUrl(form.image_path)" @uploaded="onImageUploaded" />
      </section>
    </aside>
  </form>
</template>
