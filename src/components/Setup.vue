<script setup>
import { computed } from 'vue'
import { useLocale } from '../composables/useLocale.js'
import { useSetupData } from '../composables/useSetupData.js'

const { locale } = useLocale()
const { items, loading } = useSetupData()

const leftItems  = computed(() => items.value.filter(i => i.side === 'left'))
const rightItems = computed(() => items.value.filter(i => i.side === 'right'))
</script>

<template>
  <section class="setup" id="setup">
    <div class="container">
      <div v-if="!loading" class="setup__layout">

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
