<script setup>
// <script setup> est la syntaxe "compacte" des composants Vue 3 :
// tout ce qu'on déclare ici (imports, variables, fonctions) est automatiquement
// utilisable dans le <template> ci-dessous, sans avoir à faire de `return`
// comme dans l'ancienne syntaxe `export default { setup() {...} }`.
import { ref, watchEffect } from 'vue'
import { navigation } from '../data/navigation.js'
import logoUrl from '../assets/logo.png'
import waveUrl from '../assets/bg-header.png'
import heroBgUrl from '../screenshots/01.jpg'

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

// --- Thème clair/sombre ---
// Valeur initiale : on regarde d'abord si l'utilisateur a déjà choisi un
// thème lors d'une visite précédente (localStorage), sinon on retombe sur
// la préférence système exposée par le navigateur (prefers-color-scheme).
const storedTheme = localStorage.getItem('theme')
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
const isDark = ref(storedTheme ? storedTheme === 'dark' : prefersDark)

// watchEffect() exécute immédiatement la fonction qu'on lui passe, PUIS la
// ré-exécute automatiquement à chaque fois qu'une valeur réactive qu'elle
// lit à l'intérieur change (ici isDark.value) — contrairement à watch(),
// pas besoin de lui dire explicitement "surveille isDark", il le détecte
// tout seul en observant ce qui est lu pendant son exécution.
// On l'utilise ici pour appliquer l'attribut data-theme sur <html> (lu par
// les custom properties CSS définies dans styles/base/_theme.scss) et pour
// mémoriser le choix de l'utilisateur en vue de sa prochaine visite.
// Comme ce code s'exécute pendant le setup du composant (donc avant que
// Vue ne peigne le premier rendu), le thème est déjà correct au premier
// affichage — pas de "flash" du mauvais thème. Aucun autre composant n'a
// besoin de connaître isDark : ils héritent tous du changement via le CSS,
// un store (Pinia) serait superflu pour un seul bouton.
watchEffect(() => {
  document.documentElement.dataset.theme = isDark.value ? 'dark' : 'light'
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
})
</script>

<template>
  <header class="header" id="accueil">
    <!--
      :style (raccourci de v-bind:style) permet de calculer une valeur CSS
      dynamiquement en JS. Ici on définit une custom property CSS
      (--header-hero-bg) dont la valeur dépend de l'image importée plus haut ;
      le SCSS (_header.scss) s'en sert ensuite comme background-image.
    -->
    <div class="header__hero" :style="{ '--header-hero-bg': `url(${heroBgUrl})` }">
      <div class="container header__bar">
        <a class="header__logo" href="#accueil" aria-label="Skyflyer Aviation - accueil">
          <!-- :src (raccourci v-bind:src) lie l'attribut HTML src à la variable
               JS logoUrl, au lieu d'écrire une chaîne statique. -->
          <img class="header__logo-img" :src="logoUrl" alt="Skyflyer Aviation" />
        </a>

        <!--
          .header__actions regroupe <nav>, le bouton thème et le hamburger.
          Pourquoi ce regroupement : .header__bar utilise
          `justify-content: space-between`, qui ne répartit proprement le
          contenu que pour 2 éléments (logo à gauche, reste à droite). En
          mettant nav + bouton thème + hamburger dans UN SEUL wrapper,
          .header__bar garde toujours exactement 2 enfants visibles, quelle
          que soit la taille d'écran.
        -->
        <div class="header__actions">
          <nav class="header__nav" :class="{ 'header__nav--open': isNavOpen }">
            <ul class="header__list">
              <!--
                v-for boucle sur le tableau `navigation` (importé depuis data/navigation.js)
                et répète le <li> pour chaque élément. :key donne à Vue un identifiant
                stable par élément, utilisé pour optimiser les mises à jour de la liste
                (et éviter des bugs si l'ordre change) — Vue l'exige sur tout v-for.
              -->
              <li v-for="item in navigation" :key="item.href">
                <!-- {{ item.label }} : interpolation de texte, affiche la valeur JS
                     dans le HTML. @click ferme le menu mobile après un clic sur un lien. -->
                <a class="header__link" :href="item.href" @click="closeNav">{{ item.label }}</a>
              </li>
            </ul>
          </nav>

          <!--
            Bouton à deux états (thème clair / thème sombre) : on utilise
            aria-pressed (pas aria-expanded, réservé aux widgets qui
            déplient/replient du contenu, comme le hamburger juste en
            dessous). {{ }} choisit l'emoji affiché selon isDark, comme un
            simple ternaire JS dans le template.
          -->
          <button
            type="button"
            class="header__theme-toggle"
            :aria-pressed="isDark"
            :aria-label="isDark ? 'Activer le thème clair' : 'Activer le thème sombre'"
            @click="isDark = !isDark"
          >{{ isDark ? '☀️' : '🌙' }}</button>

          <!--
            Un commentaire ne peut pas s'insérer entre les attributs d'une balise
            (HTML/Vue l'interdit) : on explique donc les trois ici, avant le tag.
            - :class avec un objet { classeCSS: condition } : la classe
              "header__toggle--open" n'est appliquée que si isNavOpen est true,
              équivalent déclaratif de classList.toggle().
            - :aria-expanded reflète directement la valeur booléenne de isNavOpen.
            - @click (raccourci v-on:click) appelle toggleNav() au clic : plus
              besoin d'addEventListener/querySelector comme en JS "vanilla".
          -->
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
        </div>
      </div>
      <img class="header__wave" :src="waveUrl" alt="" aria-hidden="true" />
    </div>
  </header>
</template>
