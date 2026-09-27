<script setup>
// L'embed "playlist uploads" (UU + id de chaîne) refusait de se lire en ligne
// (YouTube affichait un bouton "Regarder sur YouTube" au lieu du lecteur) :
// l'embed d'une vidéo précise, lui, est fiable. En l'absence de la Data API
// YouTube (qui demanderait une clé, voir README pour Twitch), cet id est
// pour l'instant mis à jour à la main à chaque nouvelle vidéo.
const YOUTUBE_VIDEO_ID = 'xVsPPjk5GsM'
</script>

<template>
  <section class="video" aria-labelledby="video-title">
    <div class="container">
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
  </section>
</template>
