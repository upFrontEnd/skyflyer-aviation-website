<script setup>
import { computed } from 'vue'
import { useLocale } from '../composables/useLocale.js'

const YOUTUBE_VIDEO_ID = 'xVsPPjk5GsM'
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
  <section class="video" aria-labelledby="video-title">
    <div class="container">
      <div class="video__panel">
        <div class="video__head">
          <h2 class="video__title" id="video-title">{{ t.title }}</h2>
        </div>
        <iframe
          class="video__frame"
          :src="`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}`"
          :title="t.frameTitle"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  </section>
</template>
