<script setup>
// Composant "purement d'affichage" : aucune donnée locale, aucun état.
// Il se contente d'importer un tableau statique et de le passer au template.
// C'est le pattern le plus simple possible pour un composant piloté par des
// données (data-driven), à comparer avec Header.vue qui a en plus de l'état
// interne (isNavOpen) et des gestionnaires d'événements.
import { news } from '../data/news.js'
</script>

<template>
  <section class="news" id="actu" aria-labelledby="news-title">
    <div class="container">
      <div class="news__head">
        <h2 class="news__title" id="news-title">Actualités</h2>
      </div>
      <div class="news__grid">
        <!--
          v-for + :key sur `news`, même pattern que Gallery.vue et Footer.vue.
          On déstructure implicitement chaque objet news.js ({ id, tag, tagVariant,
          title, date }) via item.xxx dans le bloc ci-dessous.
        -->
        <article v-for="item in news" :key="item.id" class="news-card">
          <div class="news-card__thumb">
            <span class="news-card__tag" :class="`news-card__tag--${item.tagVariant}`">{{ item.tag }}</span>
          </div>
          <div class="news-card__body">
            <h3 class="news-card__title">{{ item.title }}</h3>
            <span class="news-card__date">{{ item.date }}</span>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
