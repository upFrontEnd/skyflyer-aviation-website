<script setup>
import { ref, watch } from 'vue'
import { useLegalNoticeData } from '../../composables/useLegalNoticeData.js'

const { content, loading, updateLegalNotice } = useLegalNoticeData()

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
  <section class="admin-section legal-notice">
    <h2>Mentions légales</h2>
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
      <button class="btn" type="submit" :disabled="status === 'saving'">
        {{ status === 'saving' ? 'Enregistrement…' : 'Enregistrer' }}
      </button>
      <p v-if="status === 'saved'" class="admin-feedback admin-feedback--success">Enregistré.</p>
      <p v-if="status === 'error'" class="admin-feedback admin-feedback--error">Une erreur est survenue.</p>
    </form>
  </section>
</template>
