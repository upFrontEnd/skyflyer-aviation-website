<script setup>
import { computed } from 'vue'
import flightsimContributions from '../data/flightsim-contributions.json'
import { xplaneContributions } from '../data/xplane-contributions.js'
import msfsLogo from '../logo/msfs.webp'
import xplaneLogo from '../logo/xplane.webp'
import { useLocale } from '../composables/useLocale.js'

const { locale } = useLocale()
const t = computed(() => locale.value === 'fr' ? {
  title:   'Réalisations',
  behance: 'Je réalise également des créations graphiques pour des streamers et YouTubeurs.',
  behanceLink: 'profil Behance',
} : {
  title:   'Work',
  behance: 'I also create graphic designs for streamers and YouTubers.',
  behanceLink: 'Behance profile',
})
</script>

<template>
  <section class="contributions" id="contributions" aria-labelledby="contributions-title">
    <div class="container">
      <h2 class="contributions__title" id="contributions-title">{{ t.title }}</h2>
      
      <div class="sub-container">
          <div class="contributions__panel msfs">
              <div class="contributions__platform">
                <a href="https://flightsim.to/profile/SkyflyerAviation" target="_blank">  
                  <img class="contributions__logo" :src="msfsLogo" width="400" height="88" alt="flightsim.to" />
                </a>
                  <div class="contributions__list">
                  <a
                    v-for="item in flightsimContributions"
                    :key="item.id"
                    class="contribution-card"
                    :href="item.link"
                    target="_blank"
                    rel="noopener"
                  >
                    <img class="contribution-card__thumb" :src="item.thumbnail" :alt="item.title" loading="lazy" />
                    <div class="contribution-card__body">
                      <span class="contribution-card__category">{{ item.category }}</span>
                      <span class="contribution-card__title">{{ item.title }}</span>
                    </div>
                  </a>
                </div>
              </div>
          </div>

          <div class="contributions__panel xplane">
              <div class="contributions__platform">
                <a href="https://forums.x-plane.org/profile/992473-skyflyer-aviation/" target="_blank">
                  <img class="contributions__logo" :src="xplaneLogo" width="400" height="81" alt="X-Plane.org" />
                </a>
                <div v-if="xplaneContributions.length" class="contributions__list">
                  <a
                    v-for="item in xplaneContributions"
                    :key="item.link"
                    class="contribution-card"
                    :href="item.link"
                    target="_blank"
                    rel="noopener"
                  >
                    <img v-if="item.thumbnail" class="contribution-card__thumb" :src="item.thumbnail" :alt="item.title" loading="lazy" />
                    <div v-else class="contribution-card__thumb contribution-card__thumb--placeholder" aria-hidden="true">
                      <img :src="xplaneLogo" width="400" height="81" alt="" />
                    </div>
                    <div class="contribution-card__body">
                      <span class="contribution-card__category">{{ item.category }}</span>
                      <span class="contribution-card__title">{{ item.title }}</span>
                    </div>
                  </a>
                </div>
              </div>

          </div>
      </div>

      <p class="contributions__behance">
        {{ t.behance }}<br>
        <a href="https://www.behance.net/adel1982" target="_blank" rel="noopener">{{ t.behanceLink }}</a>.
      </p>
    </div>
  </section>
</template>
