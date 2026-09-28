<script setup>
  const YOUTUBE_VIDEO_ID = 'xVsPPjk5GsM'
</script>

<template>
  <section class="video" aria-labelledby="video-title">
    <div class="container">
      <div class="video__panel">
        <div class="video__head">
          <h2 class="video__title" id="video-title">Dernière vidéo</h2>
        </div>
        <iframe
          class="video__frame"
          :src="`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}`"
          title="Dernière vidéo YouTube - Skyflyer Aviation"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  </section>
</template>
