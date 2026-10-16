<script setup>
import { computed, ref } from 'vue'
import { useNewsData } from '../composables/useNewsData.js'
import { getPublicImageUrl } from '../lib/supabase.js'
import { useLocale } from '../composables/useLocale.js'
import NewsModal from './NewsModal.vue'

const { news } = useNewsData()
const { locale } = useLocale()

const rtf = computed(() => new Intl.RelativeTimeFormat(locale.value, { numeric: 'auto' }))

const activeNews = computed(() => news.value.filter(item => item.active))
const selectedNews = ref(null)

function title(item) {
  return (locale.value === 'en' && item.title_en) ? item.title_en : item.title
}

function content(item) {
  return (locale.value === 'en' && item.content_en) ? item.content_en : item.content
}

function relativeTime(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (seconds < 60)  return rtf.value.format(-seconds, 'second')
  if (minutes < 60)  return rtf.value.format(-minutes, 'minute')
  if (hours < 24)    return rtf.value.format(-hours,   'hour')
  if (days < 7)      return rtf.value.format(-days,    'day')
  if (weeks < 5)     return rtf.value.format(-weeks,   'week')
  if (months < 12)   return rtf.value.format(-months,  'month')
  return rtf.value.format(-years, 'year')
}

function onCardClick(item) {
  if (item.content || item.content_en) {
    selectedNews.value = item
  } else if (item.link) {
    window.open(item.link, '_blank', 'noopener')
  }
}

const sectionTitle = computed(() => locale.value === 'en' ? 'News' : 'Actus')
</script>

<template>
  <section v-if="activeNews.length" class="news" id="actu" aria-labelledby="news-title">
    <div class="container">
      <div class="news__head">
        <h2 class="news__title" id="news-title">{{ sectionTitle }}</h2>
      </div>
      <div class="news__grid">
        <div
          v-for="item in activeNews"
          :key="item.id"
          class="news-card"
          :class="{ 'news-card--clickable': item.content || item.content_en || item.link }"
          role="button"
          tabindex="0"
          @click="onCardClick(item)"
          @keydown.enter="onCardClick(item)"
        >
          <div class="news-card__thumb" :class="`news-card__thumb--${item.tag_variant}`">
            <img v-if="item.thumbnail_path" :src="getPublicImageUrl(item.thumbnail_path)" :alt="title(item)" loading="lazy" />
            <span class="news-card__tag" :class="`news-card__tag--${item.tag_variant}`">{{ item.tag }}</span>
          </div>
          <div class="news-card__body">
            <h3 class="news-card__title">{{ title(item) }}</h3>
            <span class="news-card__date">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              {{ relativeTime(item.published_at) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <NewsModal
      v-if="selectedNews"
      :item="selectedNews"
      :relative-time="relativeTime"
      :title="title"
      :content="content"
      @close="selectedNews = null"
    />
  </section>
</template>
