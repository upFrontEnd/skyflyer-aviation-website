<script setup>
import { shopItems } from '../data/shop.js'
import displateLogo from '../logo/displate.svg'

const COLLECTION_URL = 'https://displate.com/artist/skyflyer/pegase'
const FEATURED_COUNT = 9

function pickRandom(items, count) {
  const shuffled = [...items]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled.slice(0, count)
}

const featuredItems = pickRandom(shopItems, FEATURED_COUNT)
</script>

<template>
  <section class="shop" id="shop" aria-labelledby="shop-title">
    <div class="container">
      <h2 class="shop__title" id="shop-title">
        <span class="shop__brand">Shop</span> <img class="shop__displate-logo" :src="displateLogo" alt="Displate" />
      </h2>
      <div class="shop__grid">
        <a
          v-for="item in featuredItems"
          :key="item.id"
          class="shop-card"
          :href="item.link"
          target="_blank"
          rel="noopener"
        >
          <img class="shop-card__thumb" :src="item.thumbnail" :alt="item.title" loading="lazy" />
        </a>
      </div>

      <a class="btn shop__cta" :href="COLLECTION_URL" target="_blank" rel="noopener">
        Voir toute la collection
      </a>
    </div>
  </section>
</template>
