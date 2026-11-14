<script setup>
// Drapeaux en SVG inline : les emojis drapeaux ne s'affichent pas sous
// Windows. Le nom de la langue est exposé aux lecteurs d'écran.
const props = defineProps({
  lang: { type: String, required: true, validator: (v) => ['fr', 'en'].includes(v) }
})
const LABELS = { fr: 'Français', en: 'Anglais' }
</script>

<template>
  <svg v-if="lang === 'fr'" class="lang-flag" viewBox="0 0 3 2" role="img" :aria-label="LABELS[props.lang]" focusable="false">
    <rect width="1" height="2" x="0" fill="#002654" />
    <rect width="1" height="2" x="1" fill="#fff" />
    <rect width="1" height="2" x="2" fill="#ce1126" />
  </svg>
  <svg v-else class="lang-flag" viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" role="img" :aria-label="LABELS[props.lang]" focusable="false">
    <clipPath id="lang-flag-uk-clip"><path d="M0,0 v30 h60 v-30 z" /></clipPath>
    <clipPath id="lang-flag-uk-diag"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" /></clipPath>
    <g clip-path="url(#lang-flag-uk-clip)">
      <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" clip-path="url(#lang-flag-uk-diag)" stroke="#c8102e" stroke-width="4" />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#c8102e" stroke-width="6" />
    </g>
  </svg>
</template>

<style scoped>
.lang-flag {
  border-radius: 2px;
  box-shadow: 0 0 0 1px rgb(255 255 255 / .12);
  display: inline-block;
  flex-shrink: 0;
  height: .8em;
  vertical-align: -0.05em;
  width: 1.2em;
}
</style>
