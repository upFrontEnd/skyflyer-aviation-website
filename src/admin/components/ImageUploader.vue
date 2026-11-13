<script setup>
import { ref, watch } from 'vue'
import { uploadImage } from '../useImageUpload.js'
import { getPublicImageUrl } from '../../lib/supabase.js'
import AdminIcon from './AdminIcon.vue'

const props = defineProps({
  // Sous-dossier dans le bucket Storage ('event' ou 'partners') : sert
  // uniquement à organiser les fichiers, pas de vraie signification côté
  // base de données.
  folder: { type: String, required: true },
  currentUrl: { type: String, default: null },
  // Aperçu en pleine largeur (image d'événement) plutôt qu'en vignette
  // carrée (logo de partenaire).
  wide: { type: Boolean, default: false }
})

// ({ path, width, height }) une fois l'upload terminé : au parent de
// décider quoi en faire (écrire dans la table event ou partners).
const emit = defineEmits(['uploaded'])

const previewUrl = ref(props.currentUrl)
watch(() => props.currentUrl, (url) => { previewUrl.value = url })

const uploading = ref(false)
const errorMessage = ref(null)

async function onFileChange(event) {
  const file = event.target.files[0]
  if (!file) return

  uploading.value = true
  errorMessage.value = null

  try {
    // crypto.randomUUID() : un nom de fichier différent à chaque upload,
    // jamais réutilisé (voir useImageUpload.js : éviter qu'un navigateur
    // affiche une ancienne version mise en cache).
    const destPath = `${props.folder}/${crypto.randomUUID()}.webp`
    const result = await uploadImage(file, destPath)
    previewUrl.value = getPublicImageUrl(result.path)
    emit('uploaded', result)
  } catch (err) {
    errorMessage.value = err.message
  } finally {
    uploading.value = false
    event.target.value = ''
  }
}
</script>

<template>
  <div class="uploader" :class="{ 'uploader--wide': wide }">
    <label class="uploader__drop" :class="{ 'uploader__drop--busy': uploading }">
      <input class="visually-hidden" type="file" accept="image/*" :disabled="uploading" @change="onFileChange" />
      <img v-if="previewUrl" :src="previewUrl" class="uploader__preview" alt="Aperçu" />
      <span v-else class="uploader__empty"><AdminIcon name="image" :size="26" /></span>
      <span class="uploader__overlay">
        <AdminIcon name="upload" :size="18" />
        {{ uploading ? 'Envoi…' : previewUrl ? 'Remplacer' : 'Choisir une image' }}
      </span>
    </label>
    <p v-if="errorMessage" class="uploader__error">{{ errorMessage }}</p>
  </div>
</template>
