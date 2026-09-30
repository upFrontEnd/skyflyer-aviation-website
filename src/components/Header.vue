<script setup>

import { ref, onMounted, onUnmounted } from 'vue'
import { navigation } from '../data/navigation.js'
import { headerScreenshots } from '../data/screenshots.js'
import { useContactModal } from '../composables/useContactModal.js'
import { useLocale } from '../composables/useLocale.js'
import logoUrl from '../assets/logo.webp'
import waveUrl from '../assets/bg-header.webp'

// Partagée avec Contact.vue via le composable (même principe que useTheme.js
// pour le thème clair/sombre) : ouvrir la popup depuis ici n'a pas besoin de
// props/emit, les deux composants lisent/écrivent la même ref partagée.
const { open: openContact } = useContactModal()

// Même principe, partagé avec tous les composants traduits (AboutMe,
// UpcomingEvent, Contact) : une seule détection de langue pour tout le site.
const { locale } = useLocale()

// Une capture au hasard parmi celles marquées "_head" (voir data/screenshots.js),
// tirée une seule fois au chargement de la page (pas une ref : elle n'a pas
// besoin de changer après).
const heroBgUrl = headerScreenshots[Math.floor(Math.random() * headerScreenshots.length)]

// ref() crée une valeur "réactive" : Vue surveille les changements de
// isNavOpen.value et re-render automatiquement le template concerné dès
// qu'elle change. Une simple `let isNavOpen = false` ne déclencherait rien.
// Dans le template on écrit juste `isNavOpen` (sans `.value`), Vue déballe
// automatiquement les refs utilisées directement dans un <template>.
const isNavOpen = ref(false)

// Fonctions "classiques" utilisées comme gestionnaires d'événements (voir
// @click plus bas). Pas besoin de les exposer explicitement : tout ce qui
// est déclaré au niveau racine du <script setup> est visible du template.
function toggleNav() {
  isNavOpen.value = !isNavOpen.value
}

function closeNav() {
  isNavOpen.value = false
}

// Heure Zulu (UTC) — repère universel utilisé par les pilotes/contrôleurs,
// indépendant du fuseau horaire du visiteur. setInterval déclenche
// updateZuluTime toutes les secondes ; onUnmounted annule cette répétition
// si le composant disparaît, sinon l'intervalle continuerait de tourner
// indéfiniment en arrière-plan (fuite mémoire).
const zuluTime = ref('')
let zuluIntervalId = null

function updateZuluTime() {
  const now = new Date()
  const hours = String(now.getUTCHours()).padStart(2, '0')
  const minutes = String(now.getUTCMinutes()).padStart(2, '0')
  const seconds = String(now.getUTCSeconds()).padStart(2, '0')
  zuluTime.value = `${hours}:${minutes}:${seconds} ZULU`
}

onMounted(() => {
  updateZuluTime()
  zuluIntervalId = setInterval(updateZuluTime, 1000)
})

onUnmounted(() => clearInterval(zuluIntervalId))
</script>

<template>
  <header class="header__bar">
    <a class="header__logo" href="#accueil" :aria-label="locale === 'fr' ? 'Skyflyer Aviation - accueil' : 'Skyflyer Aviation - home'">
      <img class="header__logo-img" :src="logoUrl" alt="Skyflyer Aviation" />
    </a>

    <div class="header__actions">
      <nav class="header__nav" :class="{ 'header__nav--open': isNavOpen }">
        <ul class="header__list">
          <li v-for="item in navigation" :key="item.label.fr">
            <!--
              item.modal (voir data/navigation.js) distingue l'entrée
              "Contact" des autres liens : au lieu d'un <a href="#..."> qui
              scrolle vers une section, un <button> qui ouvre la popup
              (openContact, partagé via useContactModal.js) — pas de section
              #contact dans la page, donc pas de href qui aurait pointé nulle
              part.
            -->
            <button v-if="item.modal" type="button" class="header__link" @click="openContact(); closeNav()">
              {{ item.label[locale] }}
            </button>
            <a v-else class="header__link" :href="item.href" @click="closeNav">{{ item.label[locale] }}</a>
          </li>
        </ul>
      </nav>

      <a
        class="header__social-link"
        href="https://discord.com/invite/7b8kKh55sG"
        target="_blank"
        rel="noopener"
        :aria-label="locale === 'fr' ? 'Rejoindre notre Discord' : 'Join our Discord'"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M20.317 4.3698a19.7913 19.7913 0 0 0-4.8851-1.5152.0741.0741 0 0 0-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 0 0-.0785-.037 19.7363 19.7363 0 0 0-4.8852 1.515.0699.0699 0 0 0-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 0 0 .0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 0 0 .0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 0 0-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 0 1-.0075-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 0 1 .0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 0 1 .0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 0 1-.0066.1276 12.2986 12.2986 0 0 1-1.873.8914.0766.0766 0 0 0-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 0 0 .0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 0 0 .0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 0 0-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"
          />
        </svg>
      </a>
      <a
        class="header__social-link"
        href="https://www.youtube.com/@Skyflyer"
        target="_blank"
        rel="noopener"
        :aria-label="locale === 'fr' ? 'Notre chaîne YouTube' : 'Our YouTube channel'"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
          />
        </svg>
      </a>
      <span class="header__zulu" :title="locale === 'fr' ? 'Heure Zulu (UTC)' : 'Zulu time (UTC)'">{{ zuluTime }}</span>

      <button
        class="header__toggle"
        :class="{ 'header__toggle--open': isNavOpen }"
        type="button"
        :aria-label="locale === 'fr' ? 'Ouvrir le menu' : 'Open menu'"
        :aria-expanded="isNavOpen"
        @click="toggleNav"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </header>

  <!--
    :style (raccourci de v-bind:style) permet de calculer une valeur CSS
    dynamiquement en JS. Ici on définit une custom property CSS
    (--header-hero-bg) dont la valeur dépend de l'image importée plus haut ;
    le SCSS (_header.scss) s'en sert ensuite comme background-image.
    margin-top négatif (voir _header.scss) : fait remonter la photo sous
    .header__bar pour retrouver le même chevauchement visuel qu'avant,
    même si les deux ne sont plus imbriqués dans le DOM.
  -->
  <div class="header__hero" id="accueil" :style="{ '--header-hero-bg': `url(${heroBgUrl})` }">
    <img class="header__wave" :src="waveUrl" alt="" aria-hidden="true" />

    <div class="header__svgContainer">
      <svg class="header__logoLetter" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 497.34 120"><path fill="#009fe3" d="M55.04 24.82c-.15-3.44-.88-6.44-2.19-8.99-1.31-2.54-3.09-4.68-5.33-6.4-2.25-1.72-4.92-3.01-8.03-3.88q-4.665-1.29-10.17-1.29c-2.25 0-4.66.26-7.24.79-2.58.52-4.98 1.44-7.19 2.75s-4.03 3.07-5.45 5.28-2.13 4.96-2.13 8.26.79 5.84 2.36 7.86q2.355 3.03 6.18 4.89c2.54 1.24 5.46 2.23 8.76 2.98 3.29.75 6.63 1.46 10 2.13 3.44.67 6.8 1.48 10.05 2.42 3.26.94 6.18 2.21 8.76 3.82s4.66 3.71 6.23 6.29 2.36 5.82 2.36 9.72c0 4.2-.9 7.71-2.7 10.56s-4.06 5.17-6.79 6.96c-2.73 1.8-5.77 3.09-9.1 3.88s-6.53 1.18-9.6 1.18c-4.72 0-9.14-.51-13.25-1.52-4.12-1.01-7.71-2.66-10.78-4.94s-5.49-5.22-7.24-8.82C.77 65.15-.07 60.76 0 55.6h4.94c-.22 4.42.41 8.14 1.91 11.18 1.5 3.03 3.57 5.52 6.23 7.47s5.78 3.35 9.38 4.21q5.385 1.29 11.34 1.29c2.4 0 4.96-.3 7.69-.9q4.095-.9 7.53-3.03c2.28-1.42 4.19-3.29 5.73-5.62 1.53-2.32 2.3-5.24 2.3-8.76s-.79-6.12-2.36-8.26c-1.57-2.13-3.65-3.86-6.23-5.17s-5.5-2.36-8.76-3.14q-4.89-1.185-10.05-2.19c-3.37-.67-6.7-1.46-10-2.36s-6.22-2.12-8.76-3.65c-2.55-1.53-4.6-3.52-6.18-5.95-1.57-2.43-2.36-5.56-2.36-9.38s.8-7.09 2.41-9.83c1.61-2.73 3.71-4.94 6.29-6.63 2.58-1.68 5.48-2.92 8.7-3.71s6.4-1.18 9.55-1.18c4.19 0 8.1.47 11.74 1.4 3.63.94 6.81 2.4 9.55 4.38 2.73 1.99 4.92 4.55 6.57 7.69s2.58 6.93 2.81 11.34h-4.94ZM73.46 1.91h4.94v46.16l50.43-46.16h6.4L98.61 35.27l38.86 46.84h-6.18L95.01 38.64 78.39 53.8v28.3h-4.94V1.91ZM196.67 1.91h5.5l-32.24 46.61V82.1h-4.94V48.52l-32-46.61h5.62l28.98 42.46z"/><path fill="#fff" d="M206.89 1.91h50.32v4.27h-45.38V38.3h40.88v4.27h-40.88v39.54h-4.94zm57.73 0h4.94v75.93h45.49v4.27h-50.43zm99.18 0h5.5l-32.24 46.61V82.1h-4.94V48.52L300.11 1.91h5.62l28.98 42.46zm10.22 0h53.91v4.27h-48.97V38.3h46.05v4.27h-46.05v35.27h49.53v4.27h-54.47zm62.9 0h33.47c3.52 0 6.81.36 9.88 1.07s5.77 1.87 8.09 3.48 4.14 3.73 5.45 6.35 1.97 5.88 1.97 9.77c0 5.39-1.52 9.94-4.55 13.65s-7.24 6.01-12.64 6.91v.22c3.67.45 6.57 1.42 8.7 2.92s3.72 3.33 4.77 5.5 1.72 4.57 2.02 7.19q.45 3.93.45 7.86v4.61c0 1.5.07 2.9.22 4.21s.39 2.53.73 3.65.8 2.06 1.4 2.81h-5.5q-1.575-2.805-1.74-6.57c-.11-2.51-.17-5.11-.17-7.81s-.11-5.37-.34-8.03c-.22-2.66-.94-5.04-2.13-7.13-1.2-2.09-3.09-3.78-5.67-5.05s-6.23-1.91-10.95-1.91h-28.53v36.5h-4.94V1.91Zm33.47 39.42c2.92 0 5.63-.35 8.14-1.07 2.51-.71 4.66-1.81 6.46-3.31s3.22-3.41 4.27-5.73 1.57-5.09 1.57-8.31c0-2.99-.56-5.56-1.68-7.69s-2.62-3.88-4.49-5.22c-1.87-1.35-4.04-2.32-6.51-2.92s-5.05-.9-7.75-.9h-28.53v35.16h28.53ZM216.73 99.24l7.93 20.3h-2.99l-2.22-6.12h-8.59l-2.27 6.12h-2.76l7.91-20.3zm1.88 11.92-3.38-9.47h-.06l-3.44 9.47zm35.94 8.39-7.14-20.3h2.9l5.8 17.6h.06l5.86-17.6h2.82l-7.22 20.3h-3.07Zm39.55-20.31v20.3h-2.7v-20.3zm37.34 0 7.93 20.3h-2.99l-2.22-6.12h-8.59l-2.27 6.12h-2.76l7.91-20.3zm1.88 11.92-3.38-9.47h-.06l-3.44 9.47zm27.55-9.64v-2.28h16.24v2.28h-6.77v18.03h-2.7v-18.03zm45.59-2.28v20.3h-2.7v-20.3zm28.31 6.16c.41-1.28 1.02-2.41 1.83-3.4.81-.98 1.83-1.77 3.04-2.36s2.62-.88 4.24-.88 3.02.29 4.24.88 2.23 1.38 3.04 2.36c.81.99 1.43 2.12 1.83 3.4.41 1.28.61 2.61.61 4s-.2 2.71-.61 4c-.41 1.28-1.02 2.41-1.83 3.4-.82.99-1.83 1.77-3.04 2.35s-2.63.87-4.24.87-3.02-.29-4.24-.87c-1.21-.58-2.23-1.36-3.04-2.35-.82-.98-1.43-2.12-1.83-3.4-.41-1.28-.61-2.61-.61-4s.2-2.71.61-4m2.49 7.03c.26.99.68 1.89 1.25 2.69q.855 1.2 2.19 1.92t3.18.72c1.845 0 2.29-.24 3.19-.72q1.335-.72 2.19-1.92c.57-.79.99-1.69 1.25-2.69.27-1 .4-2.01.4-3.03s-.13-2.03-.4-3.03c-.27-.99-.68-1.89-1.25-2.69-.57-.79-1.3-1.44-2.19-1.92s-1.95-.73-3.19-.73-2.29.24-3.18.73q-1.335.72-2.19 1.92c-.57.8-.99 1.69-1.25 2.69-.27 1-.4 2.01-.4 3.03s.13 2.03.4 3.03m46.77-13.19 10.69 16.46h.06V99.24h2.56v20.3h-2.96l-10.61-16.29h-.06v16.29h-2.56v-20.3h2.87Z"/></svg>
    </div>


  </div>
</template>
