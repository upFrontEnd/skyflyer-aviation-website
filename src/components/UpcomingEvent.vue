<script setup>
import { useLocale } from '../composables/useLocale.js'

const { locale } = useLocale()
</script>

<template>
  <section id="event" class="event" aria-labelledby="event-title">
    <div class="container">
      <div class="event__panel">
          <div class="event__glow" aria-hidden="true"></div>
          <span class="event__kicker">{{ locale === 'fr' ? 'Prochain événement' : 'Upcoming event' }}</span>
          <div class="event__body">

            <div class="event__main">
              <h2 class="event__title" id="event-title">VATSIM - Cross the Pond</h2>
              <p v-if="locale === 'fr'" class="event__description">
                Traversée de l'Atlantique au départ de l'Europe pour une arrivée aux USA ou aux
                Caraïbes avec un full staff au niveau des contrôleurs.
              </p>
              <p v-else class="event__description">
                A transatlantic crossing departing from Europe and arriving in the USA or the
                Caribbean, with full ATC staffing.
              </p>

              <dl class="event__details">
                <div class="event__detail">
                  <dt>{{ locale === 'fr' ? 'Vol programmé' : 'Scheduled flight' }}</dt>
                  <dd>Paris LFPG - Houston KIAH</dd>
                </div>
                <div class="event__detail">
                  <dt>{{ locale === 'fr' ? 'Avion' : 'Aircraft' }}</dt>
                  <dd>{{ locale === 'fr' ? 'Airbus A-340-600 de Toliss' : 'Toliss Airbus A-340-600' }}</dd>
                </div>
                <div class="event__detail">
                  <dt>{{ locale === 'fr' ? 'Simulateur' : 'Simulator' }}</dt>
                  <dd>X-Plane</dd>
                </div>
              </dl>
            </div>
             <img src="../assets/event.webp" alt="">
          </div>
      </div>
    </div>
  </section>
</template>
