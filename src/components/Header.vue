<script setup>
import { ref } from 'vue'
import { navigation } from '../data/navigation.js'
import logoUrl from '../assets/logo.png'
import waveUrl from '../assets/bg-header.png'
import heroBgUrl from '../screenshots/01.jpg'

const isNavOpen = ref(false)

function toggleNav() {
  isNavOpen.value = !isNavOpen.value
}

function closeNav() {
  isNavOpen.value = false
}
</script>

<template>
  <header class="header" id="accueil">
    <div class="header__hero" :style="{ '--header-hero-bg': `url(${heroBgUrl})` }">
      <div class="container header__bar">
        <a class="header__logo" href="#accueil" aria-label="Skyflyer Aviation - accueil">
          <img class="header__logo-img" :src="logoUrl" alt="Skyflyer Aviation" />
        </a>

        <button
          class="header__toggle"
          :class="{ 'header__toggle--open': isNavOpen }"
          type="button"
          aria-label="Ouvrir le menu"
          :aria-expanded="isNavOpen"
          @click="toggleNav"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav class="header__nav" :class="{ 'header__nav--open': isNavOpen }">
          <ul class="header__list">
            <li v-for="item in navigation" :key="item.href">
              <a class="header__link" :href="item.href" @click="closeNav">{{ item.label }}</a>
            </li>
          </ul>
        </nav>
      </div>
      <img class="header__wave" :src="waveUrl" alt="" aria-hidden="true" />
    </div>
  </header>
</template>
