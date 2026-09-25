<script setup>
import { socialLinks } from '../data/social.js'

// Pas de ref() ici : `year` est calculé une seule fois, au montage du
// composant, et ne changera jamais ensuite. Utiliser ref() serait inutile
// (voire trompeur) pour une valeur qui n'a pas besoin d'être réactive —
// c'est un choix à faire consciemment : "est-ce que cette valeur doit
// déclencher un re-render si elle change ?" Ici, non.
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="container">
      <p class="footer__lead">Rejoignez moi sur mes réseaux sociaux</p>
      <div class="footer__social">
        <!--
          v-for sur socialLinks (data/social.js) : chaque objet { id, label, href }
          devient un lien. :key="social.id" identifie chaque élément de façon stable.
          Vue applique les mêmes règles de binding que dans Header.vue (:href, :aria-label).
        -->
        <a
          v-for="social in socialLinks"
          :key="social.id"
          class="footer__social-link"
          :href="social.href"
          :aria-label="social.label"
          target="_blank"
          rel="noopener"
        >
          <!--
            :class avec un template literal JS (backticks) plutôt qu'un objet :
            les deux syntaxes sont valides, celle-ci est pratique quand le nom
            de classe complet dépend d'une seule variable (ici social.id).
          -->
          <span class="footer__social-icon" :class="`footer__social-icon--${social.id}`" aria-hidden="true"></span>
        </a>
      </div>
      <!-- {{ year }} : interpolation de texte, réévaluée si `year` changeait
           (ce qui n'arrive pas ici, voir la remarque sur ref() ci-dessus). -->
      <p class="footer__copy">Skyflyer Aviation © {{ year }}</p>
    </div>
  </footer>
</template>
