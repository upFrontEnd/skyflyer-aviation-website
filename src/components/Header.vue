<script setup>
// <script setup> est la syntaxe "compacte" des composants Vue 3 :
// tout ce qu'on déclare ici (imports, variables, fonctions) est automatiquement
// utilisable dans le <template> ci-dessous, sans avoir à faire de `return`
// comme dans l'ancienne syntaxe `export default { setup() {...} }`.
import { ref } from 'vue'
import { navigation } from '../data/navigation.js'
import logoUrl from '../assets/logo.png'
import waveUrl from '../assets/bg-header.png'
import heroBgUrl from '../screenshots/01.jpg'
import { useTheme } from '../composables/useTheme.js'

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
// Toute la logique (valeur initiale, application sur <html>, persistance)
// vit maintenant dans composables/useTheme.js et est PARTAGÉE entre tous
// les composants qui appellent useTheme() : Header.vue n'est plus le seul
// à pouvoir lire isDark.
const { isDark } = useTheme()
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
      <div class="header__bar">
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
            Deux liens sociaux fixes (pas de v-for : seulement 2 éléments,
            jamais amenés à changer dynamiquement, un tableau + v-for
            ajouterait de l'indirection pour rien ici). fill="currentColor"
            comme pour les icônes du thème juste après : ils héritent du
            blanc défini sur .header__social-link.
          -->
          <a
            class="header__social-link"
            href="https://discord.com/invite/7b8kKh55sG"
            target="_blank"
            rel="noopener"
            aria-label="Rejoindre notre Discord"
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
            aria-label="Notre chaîne YouTube"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
              />
            </svg>
          </a>

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
