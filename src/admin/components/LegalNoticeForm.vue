<script setup>
import { computed, ref, watch } from 'vue'
import { useLegalNoticeData } from '../../composables/useLegalNoticeData.js'
import AdminIcon from './AdminIcon.vue'
import FormStatus from './FormStatus.vue'

const { content, loading, updateLegalNotice } = useLegalNoticeData()

const draft = ref('')
watch(content, (value) => {
  if (value) draft.value = value
}, { immediate: true })

// Bascule entre l'édition du HTML et un aperçu rendu. Le HTML vient de la
// base, écrit par l'admin lui-même : même contenu que sur le site public.
const tab = ref('edit')

const status = ref('idle')
const feedback = computed(() => ({
  saved: { tone: 'success', message: 'Mentions légales enregistrées.' },
  error: { tone: 'error', message: 'Une erreur est survenue.' }
}[status.value] ?? { message: '' }))

async function onSubmit() {
  status.value = 'saving'
  try {
    await updateLegalNotice(draft.value)
    status.value = 'saved'
  } catch {
    status.value = 'error'
  }
}
</script>

<template>
  <p v-if="loading" class="muted">Chargement…</p>
  <!--
    Un seul champ HTML brut plutôt qu'un éditeur WYSIWYG : le contenu
    existant est déjà structuré en sections <h3>/<p>/<ul> (voir le site
    public), donc le modifier directement en HTML reste simple pour un
    document qui change rarement, sans dépendance supplémentaire.
  -->
  <form v-else class="card" @submit.prevent="onSubmit">
    <div class="card__header card__header--tabs">
      <div class="tabs" role="tablist">
        <button type="button" role="tab" class="tabs__tab" :class="{ 'tabs__tab--active': tab === 'edit' }" :aria-selected="tab === 'edit'" @click="tab = 'edit'">
          HTML
        </button>
        <button type="button" role="tab" class="tabs__tab" :class="{ 'tabs__tab--active': tab === 'preview' }" :aria-selected="tab === 'preview'" @click="tab = 'preview'">
          Aperçu
        </button>
      </div>
      <div class="card__header-actions">
        <FormStatus :tone="feedback.tone" :message="feedback.message" />
        <button class="btn btn--primary" type="submit" :disabled="status === 'saving'">
          <AdminIcon name="save" :size="18" />
          {{ status === 'saving' ? 'Enregistrement…' : 'Enregistrer' }}
        </button>
      </div>
    </div>

    <div v-show="tab === 'edit'" class="field">
      <label class="visually-hidden" for="legal-content">Contenu (HTML)</label>
      <textarea id="legal-content" v-model="draft" class="input input--code legal-editor" rows="24" required></textarea>
    </div>
    <!-- eslint-disable-next-line vue/no-v-html : HTML saisi par l'admin -->
    <div v-show="tab === 'preview'" class="legal-preview" v-html="draft"></div>
  </form>
</template>
