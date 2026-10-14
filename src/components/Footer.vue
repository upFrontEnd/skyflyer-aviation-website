<script setup>
import { computed } from 'vue'
import { useLegalModal } from '../composables/useLegalModal.js'
import { useLocale } from '../composables/useLocale.js'

const year = new Date().getFullYear()
const { open: openLegal } = useLegalModal()
const { locale } = useLocale()
const legalLabel = computed(() => locale.value === 'fr' ? 'Mentions légales' : 'Legal notice')
</script>

<template>
  <footer class="footer">
    <div class="container footer__inner">
      <p class="footer__copy">Skyflyer Aviation © {{ year }}</p>
      <button type="button" class="footer__legal-link" @click="openLegal">{{ legalLabel }}</button>
    </div>
  </footer>
</template>
