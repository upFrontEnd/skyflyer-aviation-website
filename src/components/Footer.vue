<script setup>
import { useLegalModal } from '../composables/useLegalModal.js'

const year = new Date().getFullYear()
const { open: openLegal } = useLegalModal()
</script>

<template>
  <footer class="footer">
    <div class="container footer__inner">
      <p class="footer__copy">Skyflyer Aviation © {{ year }}</p>
      <button type="button" class="footer__legal-link" @click="openLegal">Mentions légales</button>
    </div>
  </footer>
</template>
