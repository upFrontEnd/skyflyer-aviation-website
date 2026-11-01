<script setup>
import { computed, ref } from 'vue'
import { useLocale } from '../composables/useLocale.js'
import { useSetupData } from '../composables/useSetupData.js'

const { locale } = useLocale()
const { items, loading } = useSetupData()

const leftItems  = computed(() => items.value.filter(i => i.side === 'left'))
const rightItems = computed(() => items.value.filter(i => i.side === 'right'))

// Mobile : le setup est replié par défaut (le bouton est masqué en tablette/desktop)
const open = ref(false)
const toggleLabel = computed(() => locale.value === 'fr' ? 'Setup matériel' : 'Hardware setup')
</script>

<template>
  <section class="setup" id="setup">
    <div class="container">
      <button
        type="button"
        class="setup__toggle"
        :aria-expanded="open"
        aria-controls="setup-layout"
        @click="open = !open"
      >
        {{ toggleLabel }}
        <svg class="setup__toggle-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9" /></svg>
      </button>

      <div v-if="!loading" id="setup-layout" class="setup__layout" :class="{ 'setup__layout--open': open }">

        <div class="setup__col">
          <component
            v-for="item in leftItems"
            :key="item.id"
            :is="item.href ? 'a' : 'article'"
            class="setup__card"
            v-bind="item.href ? { href: item.href, target: '_blank', rel: 'noopener' } : {}"
          >
            <div class="setup__card-icon" aria-hidden="true" v-html="item.icon_svg"></div>
            <div class="setup__card-body">
              <span class="setup__card-category">{{ locale === 'fr' ? item.category_fr : item.category_en }}</span>
              <strong class="setup__card-name">{{ item.name }}</strong>
              <span class="setup__card-specs">{{ item.specs }}</span>
            </div>
          </component>
        </div>

        <div class="setup__col">
          <component
            v-for="item in rightItems"
            :key="item.id"
            :is="item.href ? 'a' : 'article'"
            class="setup__card"
            v-bind="item.href ? { href: item.href, target: '_blank', rel: 'noopener' } : {}"
          >
            <div class="setup__card-icon" aria-hidden="true" v-html="item.icon_svg"></div>
            <div class="setup__card-body">
              <span class="setup__card-category">{{ locale === 'fr' ? item.category_fr : item.category_en }}</span>
              <strong class="setup__card-name">{{ item.name }}</strong>
              <span class="setup__card-specs">{{ item.specs }}</span>
            </div>
          </component>
        </div>

      </div>
    </div>
  </section>
</template>
