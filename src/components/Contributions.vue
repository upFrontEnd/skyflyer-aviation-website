<script setup>
import { computed } from 'vue'
import flightsimContributions from '../data/flightsim-contributions.json'
import behanceContributions from '../data/behance-contributions.json'
import { xplaneContributions } from '../data/xplane-contributions.js'
import msfsLogo from '../logo/msfs.webp'
import xplaneLogo from '../logo/xplane.webp'
import { useLocale } from '../composables/useLocale.js'
import { useContactModal } from '../composables/useContactModal.js'

const { locale } = useLocale()
const { open: openContact } = useContactModal()
const t = computed(() => locale.value === 'fr' ? {
  title:   'Réalisations',
  ctaText:   "Besoin d'une créa ?",
  ctaButton: 'Contactez-moi',
  behanceLink: 'Voir le profil Behance',
} : {
  title:   'Work',
  ctaText:   'Need a design?',
  ctaButton: 'Get in touch',
  behanceLink: 'See the Behance profile',
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

      <div class="contributions__panel behance">
        <div class="contributions__list contributions__list--grid">
          <a
            v-for="item in behanceContributions"
            :key="item.id"
            class="contribution-card"
            :href="item.link"
            target="_blank"
            rel="noopener"
          >
            <img class="contribution-card__thumb" :src="item.thumbnail" :alt="item.title" loading="lazy" />
            <div class="contribution-card__body">
              <span class="contribution-card__category">{{ item.crea }}</span>
              <span class="contribution-card__title">{{ item.title }}</span>
            </div>
          </a>
        </div>
      </div>
       <p class="contributions__cta">
          {{ t.ctaText }}
          <!-- Le contact est une popup (useContactModal), pas une section : un bouton plutôt qu'un lien #contact -->
          <button type="button" class="contributions__cta-link" @click="openContact()">{{ t.ctaButton }}</button>
        </p>
    </div>
  </section>
</template>
