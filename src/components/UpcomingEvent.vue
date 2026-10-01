<script setup>
import { useLocale } from '../composables/useLocale.js'
import { useEventData } from '../composables/useEventData.js'
import { getPublicImageUrl } from '../lib/supabase.js'

const { locale } = useLocale()

// event vaut `null` tant que Supabase n'a pas répondu (bref instant au
// chargement de la page) — v-if plus bas sur .event__body couvre ce cas,
// plutôt que d'afficher des champs vides le temps que la vraie donnée
// arrive.
const { event } = useEventData()
</script>

<template>
  <section id="event" class="event" aria-labelledby="event-title">
    <div class="container">
      <div class="event__panel">
          <div class="event__glow" aria-hidden="true"></div>
          <span class="event__kicker">{{ locale === 'fr' ? 'Prochain événement' : 'Upcoming event' }}</span>

          <div v-if="event" class="event__body">
            <div class="event__main">
              <h2 class="event__title" id="event-title">{{ event.title }}</h2>
              <p class="event__description">
                {{ locale === 'fr' ? event.description_fr : event.description_en }}
              </p>

              <dl class="event__details">
                <div class="event__detail">
                  <dt>{{ locale === 'fr' ? 'Vol programmé' : 'Scheduled flight' }}</dt>
                  <dd>{{ event.scheduled_flight }}</dd>
                </div>
                <div class="event__detail">
                  <dt>{{ locale === 'fr' ? 'Avion' : 'Aircraft' }}</dt>
                  <dd>{{ event.aircraft }}</dd>
                </div>
                <div class="event__detail">
                  <dt>{{ locale === 'fr' ? 'Simulateur' : 'Simulator' }}</dt>
                  <dd>{{ event.simulator }}</dd>
                </div>
              </dl>
            </div>
            <!--
              width/height retombent sur 1100x619 (le ratio de la photo
              d'origine) tant que event.image_width/height n'est pas encore
              connu, pour ne jamais laisser le navigateur sans indication de
              ratio — voir le bug de déformation d'image corrigé plus tôt
              cette session (img sans height: auto dans le reset global).
            -->
            <img
              :src="getPublicImageUrl(event.image_path)"
              :width="event.image_width || 1100"
              :height="event.image_height || 619"
              alt=""
              fetchpriority="high"
            />
          </div>
      </div>
    </div>
  </section>
</template>
