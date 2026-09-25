<script setup>
import { screenshots } from '../data/screenshots.js'

const PREVIEW_COUNT = 12
const items = screenshots.slice(0, PREVIEW_COUNT)
</script>

<template>
  <section class="gallery" id="realisation" aria-labelledby="gallery-title">
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
