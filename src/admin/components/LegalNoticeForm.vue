<script setup>
import { ref, watch } from 'vue'
import { useLegalNoticeData } from '../../composables/useLegalNoticeData.js'
import { useCollapsible } from '../useCollapsible.js'

const { content, loading, updateLegalNotice } = useLegalNoticeData()
const { isOpen, toggle } = useCollapsible('legal')

const draft = ref('')
watch(content, (value) => {
  if (value) draft.value = value
}, { immediate: true })

const status = ref('idle')

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
  <section class="admin-section legal-notice" :class="{ 'admin-panel-closed': !isOpen }">
    <h2 class="admin-panel__title" @click="toggle">
      Mentions légales
      <svg class="admin-panel__arrow" :class="{ 'admin-panel__arrow--open': isOpen }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
    </h2>
    <div class="admin-collapse" :class="{ 'admin-collapse--closed': !isOpen }">
      <div class="admin-collapse__inner">
    <p v-if="loading">Chargement…</p>
    <form v-else class="admin-form" @submit.prevent="onSubmit">
      <!--
        Un seul champ HTML brut plutôt qu'un éditeur WYSIWYG : le contenu
        existant est déjà structuré en sections <h3>/<p>/<ul> (voir le site
        public), donc le modifier directement en HTML reste simple pour un
        document qui change rarement — pas besoin d'une dépendance
        supplémentaire (éditeur riche) pour ce cas d'usage précis.
      -->
      <div class="admin-field">
        <label for="legal-content">Contenu (HTML)</label>
        <textarea id="legal-content" v-model="draft" rows="20" required></textarea>
      </div>
      <button class="btn btn--success" type="submit" :disabled="status === 'saving'">
        {{ status === 'saving' ? 'Enregistrement…' : 'Enregistrer' }}
      </button>
      <p v-if="status === 'saved'" class="admin-feedback admin-feedback--success">Enregistré.</p>
      <p v-if="status === 'error'" class="admin-feedback admin-feedback--error">Une erreur est survenue.</p>
    </form>
      </div>
    </div>
  </section>
</template>
