<script setup>
import { contributions } from '../data/contributions.js'
</script>

<template>
  <section class="contributions" id="contributions" aria-labelledby="contributions-title">
    <div class="container">
      <h2 class="contributions__title" id="contributions-title">Réalisations</h2>
      <div class="contributions__grid">
        <div v-for="item in contributions" :key="item.id" class="contributions__card">
          <img :src="item.logo" :alt="item.platform">
        </div>
      </div>
    </div>
  </section>
</template>
