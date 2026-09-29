<script setup>
import flightsimContributions from '../data/flightsim-contributions.json'
import { xplaneContributions } from '../data/xplane-contributions.js'
import msfsLogo from '../logo/msfs.png'
import xplaneLogo from '../logo/xplane.png'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<template>
  <section class="contributions" id="contributions" aria-labelledby="contributions-title">
    <div class="container">
      <h2 class="contributions__title" id="contributions-title">Réalisations</h2>
      
      <div class="sub-container">
          <div class="contributions__panel msfs">
              <div class="contributions__platform">
                <a href="https://flightsim.to/profile/SkyflyerAviation" target="_blank">  
                  <img class="contributions__logo" :src="msfsLogo" alt="flightsim.to" />
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
                <a class="btn" href="https://flightsim.to/profile/SkyflyerAviation" target="_blank">  
                 Voir toutes les réalisations pour MSFS
                </a>
              </div>
          </div>

          <div class="contributions__panel xplane">
              <div class="contributions__platform">
                <a href="https://forums.x-plane.org/profile/992473-skyflyer-aviation/" target="_blank">
                  <img class="contributions__logo" :src="xplaneLogo" alt="X-Plane.org" />
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
                    <img class="contribution-card__thumb" :src="item.thumbnail" :alt="item.title" loading="lazy" />
                    <div class="contribution-card__body">
                      <span class="contribution-card__category">{{ item.category }}</span>
                      <span class="contribution-card__title">{{ item.title }}</span>
                    </div>
                  </a>
                </div>
                 <a class="btn" href="https://forums.x-plane.org/profile/992473-skyflyer-aviation/" target="_blank">  
                 Voir toutes les réalisations pour Xplane
                </a>
              </div>
             
          </div>
      </div>
    </div>
  </section>
</template>
