<script setup>
import { computed, ref, watch } from 'vue'
import { useEventData } from '../../composables/useEventData.js'
import { getPublicImageUrl } from '../../lib/supabase.js'
import ImageUploader from './ImageUploader.vue'
import AdminIcon from './AdminIcon.vue'
import LangFlag from './LangFlag.vue'
import DateTimePicker from './DateTimePicker.vue'
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

// Dates choisies au calendrier : servent seulement à générer le texte des
// champs date_fr / date_en (qui restent modifiables à la main) et à rouvrir
// le calendrier sur le dernier choix. Rien de tout ça n'est enregistré.
const pickedLocal = ref(null)
const pickedZulu = ref(null)

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1)
const pad = (n) => String(n).padStart(2, '0')

// "Samedi 21 novembre 2026 à 21h00", dans le fuseau du navigateur
function formatLocalFr(date) {
  const day = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(date)
  return `${capitalize(day)} à ${pad(date.getHours())}h${pad(date.getMinutes())}`
}

// "Saturday, November 21, 2026 at 20:00Z"
function formatZuluEn(date) {
  const day = new Intl.DateTimeFormat('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date)
  return `${day} at ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}Z`
}

// Choisir l'heure locale remplit aussi la version Zulu (même instant),
// ajustable ensuite avec son propre calendrier.
function onPickLocal(date) {
  pickedLocal.value = date
  pickedZulu.value = date
  form.value.date_fr = formatLocalFr(date)
  form.value.date_en = formatZuluEn(date)
}

function onPickZulu(date) {
  pickedZulu.value = date
  form.value.date_en = formatZuluEn(date)
}

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
            <label class="field__label" for="event-desc-fr"><LangFlag lang="fr" /> Description</label>
            <textarea id="event-desc-fr" v-model="form.description_fr" class="input" rows="4" required></textarea>
          </div>
          <div class="field">
            <label class="field__label" for="event-desc-en"><LangFlag lang="en" /> Description</label>
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
              <label class="field__label" for="event-date-fr"><LangFlag lang="fr" /> Date <span class="field__optional">heure locale</span></label>
              <div class="input-with-action">
                <input id="event-date-fr" v-model="form.date_fr" class="input" type="text" required />
                <DateTimePicker :value="pickedLocal" label="Choisir la date et l'heure locale" @pick="onPickLocal" />
              </div>
            </div>
            <div class="field">
              <label class="field__label" for="event-date-en"><LangFlag lang="en" /> Date <span class="field__optional">heure Zulu</span></label>
              <div class="input-with-action">
                <input id="event-date-en" v-model="form.date_en" class="input" type="text" required />
                <DateTimePicker :value="pickedZulu" utc label="Choisir la date et l'heure Zulu (UTC)" @pick="onPickZulu" />
              </div>
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
