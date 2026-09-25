<script setup>
import { contributions } from '../data/contributions.js'
</script>

<template>
  <section class="contributions" id="contributions" aria-labelledby="contributions-title">
    <div class="container">
      <h2 class="contributions__title" id="contributions-title">Contributions</h2>
      <div class="contributions__grid">
        <div v-for="item in contributions" :key="item.id" class="contributions__card">
          <h3 class="contributions__platform">{{ item.platform }}</h3>
          <p class="contributions__description">{{ item.description }}</p>
          <a
            class="btn"
            :class="`btn--${item.btnVariant}`"
            :href="item.href"
            target="_blank"
            rel="noopener"
          >Voir mes contributions <span aria-hidden="true">&rarr;</span></a>
        </div>
      </div>
    </div>
  </section>
</template>
