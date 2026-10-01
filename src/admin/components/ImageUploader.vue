<script setup>
import { ref } from 'vue'
import { uploadImage } from '../useImageUpload.js'
import { getPublicImageUrl } from '../../lib/supabase.js'

const props = defineProps({
  // Sous-dossier dans le bucket Storage ('event' ou 'partners') : sert
  // uniquement à organiser les fichiers, pas de vraie signification côté
  // base de données.
  folder: { type: String, required: true },
  currentUrl: { type: String, default: null }
})

// ({ path, width, height }) une fois l'upload terminé — au parent de
// décider quoi en faire (écrire dans la table event ou partners).
const emit = defineEmits(['uploaded'])

const previewUrl = ref(props.currentUrl)
const uploading = ref(false)
const errorMessage = ref(null)

async function onFileChange(event) {
  const file = event.target.files[0]
  if (!file) return

  uploading.value = true
  errorMessage.value = null

  try {
    // crypto.randomUUID() : un nom de fichier différent à chaque upload,
    // jamais réutilisé — voir useImageUpload.js pour la raison (éviter
    // qu'un navigateur affiche une ancienne version mise en cache).
    const destPath = `${props.folder}/${crypto.randomUUID()}.webp`
    const result = await uploadImage(file, destPath)
    previewUrl.value = getPublicImageUrl(result.path)
    emit('uploaded', result)
  } catch (err) {
    errorMessage.value = err.message
  } finally {
    uploading.value = false
  }
}
</script>

<template>
  <div class="image-uploader">
    <img v-if="previewUrl" :src="previewUrl" class="image-uploader__preview" alt="Aperçu" />
    <input type="file" accept="image/*" :disabled="uploading" @change="onFileChange" />
    <p v-if="uploading" class="image-uploader__status">Envoi en cours…</p>
    <p v-if="errorMessage" class="image-uploader__error">{{ errorMessage }}</p>
  </div>
</template>
