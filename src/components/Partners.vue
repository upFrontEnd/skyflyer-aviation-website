<script setup>
import { partners } from '../data/partners.js'
</script>

<template>
  <section class="partners" id="partenaires" aria-labelledby="partners-title">
    <div class="container">
      <h2 class="partners__title" id="partners-title">Partenariats & Affiliations</h2>
      <ul class="partners__grid">
        <!--
          v-for + :key comme dans le reste du projet. `partner.logo` est soit
          l'URL d'un logo importé (voir data/partners.js), soit `null` pour les
          partenaires qui n'en ont pas encore. v-if/v-else bascule entre les
          deux rendus : c'est la façon Vue de faire du rendu conditionnel,
          équivalent déclaratif d'un `if/else` en JS classique.
        -->
        <li v-for="partner in partners" :key="partner.id" class="partners__item">
          <a :href="partner.href" :aria-label="partner.name">
            <img v-if="partner.logo" class="partners__logo" :src="partner.logo" :alt="partner.name" />
            <span v-else class="partners__badge"></span>
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>
