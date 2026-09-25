<script setup>
import { partners } from '../data/partners.js'
</script>

<template>
  <section class="partners" id="partenaires" aria-labelledby="partners-title">
    <div class="container">
      <h2 class="partners__title" id="partners-title">Partenaires</h2>
      <ul class="partners__grid">
        <li v-for="partner in partners" :key="partner.id" class="partners__item">
          <a :href="partner.href" :aria-label="partner.name">
            <span class="partners__badge">100 KTS<br />FLIGHTSIM CLUB</span>
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>
