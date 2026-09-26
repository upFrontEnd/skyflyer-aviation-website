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
      <p class="footer__copy">Skyflyer Aviation © {{ year }}</p>
    </div>
  </footer>
</template>
