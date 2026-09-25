<script setup>
import { news } from '../data/news.js'
</script>

<template>
  <section class="news" id="actu" aria-labelledby="news-title">
    <div class="container">
      <div class="news__head">
        <h2 class="news__title" id="news-title">Actualités</h2>
        <a class="btn btn--blue" href="#">Voir toutes les actu <span aria-hidden="true">&rarr;</span></a>
      </div>
      <div class="news__grid">
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
