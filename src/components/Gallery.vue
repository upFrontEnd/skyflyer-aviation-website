<script setup>
// `screenshots` vient de data/screenshots.js, qui utilise import.meta.glob
// pour importer dynamiquement tous les fichiers .jpg du dossier (fonctionnalité
// de Vite, pas de Vue) et en fait un tableau [{ id, src, alt }, ...].
import { screenshots } from '../data/screenshots.js'

// Comme pour `year` dans Footer.vue : PREVIEW_COUNT et `items` sont des
// constantes calculées une fois, pas des refs. Elles ne changent jamais
// après le montage du composant, donc pas besoin de réactivité.
const PREVIEW_COUNT = 12
const items = screenshots.slice(0, PREVIEW_COUNT)
</script>

<template>
  <section class="gallery" id="screen" aria-labelledby="gallery-title">
    <div class="container">
      <h2 class="gallery__title" id="gallery-title">Screenshots</h2>
      <ul class="gallery__grid">
        <!--
          v-for sur `items` (le tableau déjà tronqué à 12 éléments côté script,
          plutôt que dans le template). :key="shot.id" permet à Vue de suivre
          chaque <li> individuellement.
        -->
        <li v-for="shot in items" :key="shot.id" class="gallery__item">
          <img class="gallery__img" :src="shot.src" :alt="shot.alt" loading="lazy" />
        </li>
      </ul>
    </div>
  </section>
</template>
