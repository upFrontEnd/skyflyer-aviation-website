<script setup>
import { computed } from 'vue'
import { useEventData } from '../../composables/useEventData.js'
import { usePartnersData } from '../../composables/usePartnersData.js'
import { useSetupData } from '../../composables/useSetupData.js'
import { useSiteSettings } from '../../composables/useSiteSettings.js'
import { getPublicImageUrl } from '../../lib/supabase.js'
import { parseDiscordDraft } from '../useDiscordAnnounce.js'
import { useAdminNav } from '../useAdminNav.js'
import AdminIcon from './AdminIcon.vue'

const { event, loading: eventLoading } = useEventData()
const { partners } = usePartnersData()
const { items: setupItems } = useSetupData()
const { settings } = useSiteSettings()
const { go } = useAdminNav()

const today = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
  .format(new Date())
  .replace(/^./, c => c.toUpperCase())

const eventImage = computed(() => getPublicImageUrl(event.value?.image_path))
const setupLeft = computed(() => setupItems.value.filter(i => i.side === 'left').length)
const discordDraft = computed(() => parseDiscordDraft(settings.value.discord_draft))

// Phrase de résumé sous la date, comme un point de situation rapide.
const summary = computed(() => {
  if (eventLoading.value) return 'Chargement du contenu du site…'
  const e = event.value
  const parts = []
  parts.push(e?.active
    ? `L'événement « ${e.title} » est affiché sur le site`
    : 'Aucun événement n\'est affiché sur le site')
  parts.push(`${partners.value.length} partenaires et ${setupItems.value.length} éléments de setup en ligne`)
  return parts.join(', ') + '.'
})

const stats = computed(() => [
  {
    key: 'event',
    label: 'Prochain événement',
    value: event.value?.title || 'Aucun',
    badge: event.value?.active ? { text: 'Affiché', tone: 'success' } : { text: 'Masqué', tone: 'neutral' },
    hint: event.value?.date_fr || 'Pas de date'
  },
  {
    key: 'partners',
    label: 'Partenaires',
    value: partners.value.length,
    hint: 'logos sur le site'
  },
  {
    key: 'setup',
    label: 'Setup',
    value: setupItems.value.length,
    hint: `${setupLeft.value} à gauche · ${setupItems.value.length - setupLeft.value} à droite`
  },
  {
    key: 'channels',
    label: 'Chaîne Twitch',
    value: settings.value.twitch_channel || 'Non définie',
    hint: settings.value.youtube_video_id ? 'Vidéo YouTube définie' : 'Pas de vidéo YouTube',
    small: true
  }
])

const shortcuts = computed(() => [
  {
    key: 'discord',
    icon: 'megaphone',
    tone: 'blurple',
    title: 'Annonce Discord',
    text: discordDraft.value?.intro ? 'Un brouillon est prêt à être relu et publié.' : 'Préparer une annonce de live pour le serveur.'
  },
  { key: 'event', icon: 'calendar', tone: 'orange', title: 'Modifier l\'événement', text: 'Titre, descriptions, date et image.' },
  { key: 'legal', icon: 'file', tone: 'blue', title: 'Mentions légales', text: 'Mettre à jour le contenu HTML.' }
])
</script>

<template>
  <div class="overview">
    <header class="overview__hero">
      <p class="overview__date">{{ today }}</p>
      <p class="overview__summary">{{ summary }}</p>
    </header>

    <div class="stats">
      <button v-for="s in stats" :key="s.key" type="button" class="card stat" @click="go(s.key)">
        <span class="stat__label">{{ s.label }}</span>
        <span class="stat__value" :class="{ 'stat__value--small': s.small || typeof s.value === 'string' }">{{ s.value }}</span>
        <span class="stat__foot">
          <span v-if="s.badge" class="badge" :class="`badge--${s.badge.tone}`">{{ s.badge.text }}</span>
          <span class="stat__hint">{{ s.hint }}</span>
        </span>
      </button>
    </div>

    <div class="overview__grid">
      <section class="card event-card">
        <div class="card__header">
          <div>
            <h2 class="card__title">
              Prochain événement
              <span v-if="event" class="badge" :class="event.active ? 'badge--success' : 'badge--neutral'">
                {{ event.active ? 'En ligne' : 'Masqué' }}
              </span>
            </h2>
            <p class="card__subtitle">Tel qu'il apparaît sur la page d'accueil</p>
          </div>
          <button class="btn" type="button" @click="go('event')">Modifier</button>
        </div>

        <p v-if="eventLoading" class="muted">Chargement…</p>
        <div v-else-if="event" class="event-card__body">
          <img v-if="eventImage" :src="eventImage" class="event-card__image" alt="" />
          <div v-else class="event-card__image event-card__image--empty"><AdminIcon name="image" :size="28" /></div>
          <div class="event-card__info">
            <p class="event-card__title">{{ event.title }}</p>
            <p class="event-card__desc">{{ event.description_fr }}</p>
            <dl class="meta">
              <div><dt>Date</dt><dd>{{ event.date_fr || '-' }}</dd></div>
              <div><dt>Vol</dt><dd>{{ event.scheduled_flight || '-' }}</dd></div>
              <div><dt>Avion</dt><dd>{{ event.aircraft || '-' }}</dd></div>
              <div><dt>Simulateur</dt><dd>{{ event.simulator || '-' }}</dd></div>
            </dl>
          </div>
        </div>
        <p v-else class="muted">Aucun événement enregistré.</p>
      </section>

      <section class="card">
        <div class="card__header">
          <div>
            <h2 class="card__title">Raccourcis</h2>
            <p class="card__subtitle">Les actions les plus fréquentes</p>
          </div>
        </div>
        <ul class="shortcuts">
          <li v-for="s in shortcuts" :key="s.key">
            <button type="button" class="shortcut" @click="go(s.key)">
              <span class="shortcut__icon" :class="`tone-${s.tone}`"><AdminIcon :name="s.icon" /></span>
              <span class="shortcut__text">
                <span class="shortcut__title">{{ s.title }}</span>
                <span class="shortcut__desc">{{ s.text }}</span>
              </span>
              <AdminIcon name="arrow" :size="18" class="shortcut__arrow" />
            </button>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>
