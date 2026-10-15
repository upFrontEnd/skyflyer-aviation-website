<script setup>
import { ref, watch } from 'vue'
import { useSiteSettings } from '../../composables/useSiteSettings.js'
import { useCollapsible } from '../useCollapsible.js'

const { settings, loading, updateSetting } = useSiteSettings()
const { isOpen, toggle } = useCollapsible('site-settings')

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
  <section class="admin-section twitch" :class="{ 'admin-panel-closed': !isOpen }">
    <h2 class="admin-panel__title" @click="toggle">
      Chaine Twitch / Youtube
      <svg class="admin-panel__arrow" :class="{ 'admin-panel__arrow--open': isOpen }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
    </h2>
    <div class="admin-collapse" :class="{ 'admin-collapse--closed': !isOpen }">
      <div class="admin-collapse__inner">
        <p v-if="loading">Chargement…</p>
        <form v-else class="admin-form" @submit.prevent="onSubmit">
          <div class="admin-field">
            <label for="settings-twitch">Chaîne Twitch</label>
            <input
              id="settings-twitch"
              v-model="twitchChannel"
              type="text"
              placeholder="ex : bigmoussegaming"
              required
            />
          </div>
          <div class="admin-field">
            <label for="settings-youtube">ID vidéo YouTube</label>
            <input
              id="settings-youtube"
              v-model="youtubeVideoId"
              type="text"
              placeholder="ex : T1nTBUwFDo8"
            />
          </div>
          <div class="admin-display-on-site">
            <button class="btn btn--success" type="submit" :disabled="status === 'saving'">
              {{ status === 'saving' ? 'Enregistrement…' : 'Enregistrer' }}
            </button>
          </div>
          <p v-if="status === 'saved'" class="admin-feedback admin-feedback--success">Enregistré.</p>
          <p v-if="status === 'error'" class="admin-feedback admin-feedback--error">Une erreur est survenue.</p>
        </form>
      </div>
    </div>
  </section>
</template>
