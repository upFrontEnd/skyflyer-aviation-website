<script setup>
import { partners } from '../data/partners.js'
</script>

<template>
  <section class="partners" id="partenaires" aria-labelledby="partners-title">
    <div class="container">
      <h2 class="partners__title" id="partners-title">Partenaires</h2>
      <ul class="partners__grid">
        <!--
          Même pattern v-for + :key que les autres listes du projet. Ici le badge
          affiché ("100 KTS FLIGHTSIM CLUB") est codé en dur dans le template :
          seuls partner.href et partner.name sont réellement utilisés (via les
          bindings :href/:aria-label). C'est volontaire, hérité du contenu
          d'origine — un exemple concret que "boucler sur des données" ne veut
          pas forcément dire "tout afficher dynamiquement".
        -->
        <li v-for="partner in partners" :key="partner.id" class="partners__item">
          <a :href="partner.href" :aria-label="partner.name">
            <span class="partners__badge">100 KTS<br />FLIGHTSIM CLUB</span>
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>
