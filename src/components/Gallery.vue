<script setup>
// `screenshots` vient de data/screenshots.js, qui utilise import.meta.glob
// pour importer dynamiquement tous les fichiers .jpg du dossier (fonctionnalité
// de Vite, pas de Vue) et en fait un tableau [{ id, src, alt }, ...].
import { screenshots } from '../data/screenshots.js'

// Mélange Fisher-Yates : on tire un ordre aléatoire différent à chaque
// chargement de la page, en travaillant sur une COPIE ([...array]) plutôt
// que sur `screenshots` directement — celui-ci est exporté par
// data/screenshots.js, donc le muter sur place affecterait aussi tout autre
// composant qui l'importerait un jour.
function shuffle(array) {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

// Comme pour `year` dans Footer.vue : PREVIEW_COUNT et `items` sont des
// constantes calculées une fois, pas des refs — le tirage aléatoire se fait
// une seule fois au chargement du composant, pas à chaque re-render.
const PREVIEW_COUNT = 18
const items = shuffle(screenshots).slice(0, PREVIEW_COUNT)
</script>

<template>
  <section class="gallery" id="screen" aria-labelledby="gallery-title">
    <div class="container">
      <h2 class="gallery__title" id="gallery-title">Screenshots</h2>
      <ul class="gallery__grid">
        <li v-for="shot in items" :key="shot.id" class="gallery__item">
          <img class="gallery__img" :src="shot.src" :alt="shot.alt" loading="lazy" />
        </li>
      </ul>
    </div>
  </section>
</template>
