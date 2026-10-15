<script setup>
import { computed } from 'vue'
import { useLocale } from '../composables/useLocale.js'
import { useSiteSettings } from '../composables/useSiteSettings.js'

const { settings } = useSiteSettings()
const videoId = computed(() => settings.value.youtube_video_id?.trim() || '')
const { locale } = useLocale()
const t = computed(() => locale.value === 'fr' ? {
  title:      'Dernière vidéo',
  frameTitle: 'Dernière vidéo YouTube - Skyflyer Aviation',
} : {
  title:      'Latest video',
  frameTitle: 'Latest YouTube video - Skyflyer Aviation',
})
</script>

<template>
  <section v-if="videoId" id="video" class="video" aria-labelledby="video-title">
    <div class="container">
      <div class="video__panel">
        <div class="video__head">
          <h2 class="video__title" id="video-title">{{ t.title }}</h2>
        </div>
        <iframe
          class="video__frame"
          :src="`https://www.youtube.com/embed/${videoId}`"
          :title="t.frameTitle"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  </section>
</template>
