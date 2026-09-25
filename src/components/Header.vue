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
            dessous).

            Piège classique évité ici : {{ }} (interpolation de texte)
            affiche toujours une chaîne échappée telle quelle — écrire
            {{ '<svg>...</svg>' }} affiche le texte "<svg>...</svg>", pas une
            icône. Pour du VRAI HTML/SVG dynamique, soit on écrit le
            balisage directement dans le template avec v-if/v-else (ce qu'on
            fait ici, comme pour partner.logo dans Partners.vue), soit on
            utilise la directive v-html (à réserver à du contenu qu'on
            maîtrise, jamais à de la saisie utilisateur, sous peine de faille
            XSS). fill="currentColor" fait hériter le blanc défini sur
            .header__theme-toggle (color: $color-text-light) au lieu de
            coder une couleur en dur dans le SVG.
          -->
          <button
            type="button"
            class="header__theme-toggle"
            :aria-pressed="isDark"
            :aria-label="isDark ? 'Activer le thème clair' : 'Activer le thème sombre'"
            @click="isDark = !isDark"
          >
            <svg v-if="isDark" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 0a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0V1a1 1 0 0 1 1-1M4.929 3.515a1 1 0 0 0-1.414 1.414l2.828 2.828a1 1 0 0 0 1.414-1.414L4.93 3.515ZM1 11a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2zm17 1a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2h-4a1 1 0 0 1-1-1m-.343 4.243a1 1 0 0 0-1.414 1.414l2.828 2.828a1 1 0 1 0 1.414-1.414zm-9.9 1.414a1 1 0 1 0-1.414-1.414L3.515 19.07a1 1 0 1 0 1.414 1.414l2.828-2.828ZM20.485 4.929a1 1 0 0 0-1.414-1.414l-2.828 2.828a1 1 0 1 0 1.414 1.414zM13 19a1 1 0 1 0-2 0v4a1 1 0 1 0 2 0zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10"
              />
            </svg>
            <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 22c5.5228 0 10-4.4772 10-10 0-.4627-.6935-.5392-.9328-.1432C19.9289 13.7406 17.8615 15 15.5 15 11.9101 15 9 12.0899 9 8.5c0-2.36155 1.2594-4.42895 3.1432-5.56724C12.5392 2.69347 12.4627 2 12 2 6.47715 2 2 6.47715 2 12c0 5.5228 4.47715 10 10 10"
              />
            </svg>
          </button>

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
