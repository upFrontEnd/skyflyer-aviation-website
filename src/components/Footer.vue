<script setup>
import { socialLinks } from '../data/social.js'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="container">
      <p class="footer__lead">Rejoignez moi sur mes réseaux sociaux</p>
      <div class="footer__social">
        <a
          v-for="social in socialLinks"
          :key="social.id"
          class="footer__social-link"
          :href="social.href"
          :aria-label="social.label"
          target="_blank"
          rel="noopener"
        >
          <span class="footer__social-icon" :class="`footer__social-icon--${social.id}`" aria-hidden="true"></span>
        </a>
      </div>
      <p class="footer__copy">Skyflyer Aviation © {{ year }}</p>
    </div>
  </footer>
</template>
