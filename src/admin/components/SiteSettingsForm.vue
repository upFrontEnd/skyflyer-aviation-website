<script setup>
import { computed, ref, watch } from 'vue'
import { useSiteSettings } from '../../composables/useSiteSettings.js'
import AdminIcon from './AdminIcon.vue'
import FormStatus from './FormStatus.vue'

const { settings, loading, updateSetting } = useSiteSettings()

const twitchChannel = ref('')
const youtubeVideoId = ref('')
const status = ref('idle')
let initialized = false

watch(settings, (val) => {
  if (initialized) return
  if (val.twitch_channel !== undefined || val.youtube_video_id !== undefined) {
    twitchChannel.value = val.twitch_channel ?? ''
    youtubeVideoId.value = val.youtube_video_id ?? ''
    initialized = true
  }
}, { immediate: true })

// Miniature publique de YouTube : permet de vérifier d'un coup d'œil que
// l'identifiant saisi correspond bien à la bonne vidéo.
const youtubeThumb = computed(() => {
  const id = youtubeVideoId.value.trim()
  return id ? `https://i.ytimg.com/vi/${encodeURIComponent(id)}/hqdefault.jpg` : null
})

const feedback = computed(() => ({
  saved: { tone: 'success', message: 'Enregistré.' },
  error: { tone: 'error', message: 'Une erreur est survenue.' }
}[status.value] ?? { message: '' }))

async function onSubmit() {
  status.value = 'saving'
  const twitch = twitchChannel.value.trim()
  const youtube = youtubeVideoId.value.trim()
  try {
    await updateSetting('twitch_channel', twitch)
    await updateSetting('youtube_video_id', youtube)
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
            <h2 class="card__title">Twitch</h2>
            <p class="card__subtitle">Chaîne utilisée pour détecter un live en cours et l'afficher sur le site</p>
          </div>
        </div>
        <div class="field">
          <label class="field__label" for="settings-twitch">Nom de la chaîne</label>
          <div class="input-group">
            <span class="input-group__prefix">twitch.tv/</span>
            <input id="settings-twitch" v-model="twitchChannel" class="input" type="text" placeholder="skyflyeraviation" required />
          </div>
        </div>
      </section>

      <section class="card">
        <div class="card__header">
          <div>
            <h2 class="card__title">YouTube</h2>
            <p class="card__subtitle">Vidéo mise en avant dans la section « Dernière vidéo »</p>
          </div>
        </div>
        <div class="field">
          <label class="field__label" for="settings-youtube">Identifiant de la vidéo</label>
          <div class="input-group">
            <span class="input-group__prefix">youtube.com/watch?v=</span>
            <input id="settings-youtube" v-model="youtubeVideoId" class="input" type="text" placeholder="T1nTBUwFDo8" />
          </div>
        </div>
        <img v-if="youtubeThumb" :src="youtubeThumb" class="yt-thumb" alt="Miniature de la vidéo" />
      </section>
    </div>

    <aside class="form-layout__aside">
      <section class="card">
        <div class="card__header">
          <div>
            <h2 class="card__title">Publication</h2>
            <p class="card__subtitle">Les changements sont visibles immédiatement</p>
          </div>
        </div>
        <div class="card__actions">
          <button class="btn btn--primary btn--block" type="submit" :disabled="status === 'saving'">
            <AdminIcon name="save" :size="18" />
            {{ status === 'saving' ? 'Enregistrement…' : 'Enregistrer' }}
          </button>
          <FormStatus :tone="feedback.tone" :message="feedback.message" />
        </div>
      </section>
    </aside>
  </form>
</template>
