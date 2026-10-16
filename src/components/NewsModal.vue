<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { getPublicImageUrl } from '../lib/supabase.js'
import { useLocale } from '../composables/useLocale.js'

const props = defineProps({
  item:         { type: Object,   required: true },
  relativeTime: { type: Function, required: true },
  title:        { type: Function, required: true },
  content:      { type: Function, required: true },
})

const emit = defineEmits(['close'])

const VARIANT_COLORS = {
  msfs:   { solid: '#009fe3', rgba: 'rgba(0, 159, 227, 0.15)' },
  xp:     { solid: '#0fb5e8', rgba: 'rgba(15, 181, 232, 0.15)' },
  ivao:   { solid: '#3b5bdb', rgba: 'rgba(59, 91, 219, 0.15)' },
  vatsim: { solid: '#29B473', rgba: 'rgba(41, 180, 115, 0.15)' },
}

const panelStyle = computed(() => {
  const c = VARIANT_COLORS[props.item.tag_variant] ?? VARIANT_COLORS.msfs
  return {
    background: `linear-gradient(120deg, ${c.rgba}, rgba(42, 40, 41, .96) 58%)`,
    borderLeft: `4px solid ${c.solid}`,
    '--news-link-color': c.solid,
  }
})

const closeColor = computed(() => {
  const c = VARIANT_COLORS[props.item.tag_variant] ?? VARIANT_COLORS.msfs
  return c.solid
})

// Force target="_blank" sur tous les liens du contenu HTML admin
const processedContent = computed(() =>
  (props.content(props.item) || '').replace(/<a\s+/gi, '<a target="_blank" rel="noopener noreferrer" ')
)

function stripHtml(html) {
  return (html || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}

const shareUrl = computed(() => props.item.link || window.location.href)

const shareLinks = computed(() => {
  const url     = encodeURIComponent(shareUrl.value)
  const title   = props.title(props.item)
  const excerpt = stripHtml(props.content(props.item)).slice(0, 200)
  return {
    x:        `https://twitter.com/intent/tweet?url=${url}&text=${encodeURIComponent(excerpt ? `${title} — ${excerpt.slice(0, 100)}` : title)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(excerpt ? `${title}\n\n${excerpt}\n\n${shareUrl.value}` : `${title} ${shareUrl.value}`)}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(excerpt)}`,
  }
})

const canNativeShare = typeof navigator !== 'undefined' && !!navigator.share

const { locale } = useLocale()
const tModal = computed(() => locale.value === 'fr' ? {
  close:           'Fermer',
  share:           'Partager',
  shareNative:     "Partager via l'application",
  shareX:          'Partager sur X',
  shareFacebook:   'Partager sur Facebook',
  shareWhatsapp:   'Partager sur WhatsApp',
  shareLinkedin:   'Partager sur LinkedIn',
} : {
  close:           'Close',
  share:           'Share',
  shareNative:     'Share via app',
  shareX:          'Share on X',
  shareFacebook:   'Share on Facebook',
  shareWhatsapp:   'Share on WhatsApp',
  shareLinkedin:   'Share on LinkedIn',
})

async function nativeShare() {
  try {
    await navigator.share({
      title: props.title(props.item),
      text:  stripHtml(props.content(props.item)).slice(0, 300),
      url:   shareUrl.value,
    })
  } catch { /* annulé par l'utilisateur */ }
}

function openShare(url) {
  window.open(url, '_blank', 'noopener,noreferrer,width=600,height=500')
}

function onKey(e) {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => {
  document.addEventListener('keydown', onKey)
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <div class="news-modal-backdrop" @click.self="$emit('close')">
      <div class="news-modal__panel" :style="panelStyle" role="dialog" aria-modal="true">
        <button
          class="news-modal__close"
          type="button"
          :style="{ '--close-hover': closeColor }"
          @click="$emit('close')"
          :aria-label="tModal.close"
        >&times;</button>

        <div class="news-modal__head">
          <span class="news-modal__tag" :class="`news-card__tag--${item.tag_variant}`">{{ item.tag }}</span>
          <span class="news-modal__date">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            {{ relativeTime(item.published_at) }}
          </span>
        </div>

        <h2 class="news-modal__title">{{ title(item) }}</h2>

        <img
          v-if="item.illustration_path"
          class="news-modal__illustration"
          :src="getPublicImageUrl(item.illustration_path)"
          :alt="title(item)"
        />

        <div class="news-modal__content" v-html="processedContent"></div>

        <div class="news-modal__share">
          <span class="news-modal__share-label">{{ tModal.share }}</span>
          <div class="news-modal__share-links">
            <!-- Partage natif (mobile + Chrome desktop) : inclut titre + contenu + lien -->
            <button v-if="canNativeShare" type="button"
              class="news-modal__share-btn news-modal__share-btn--native"
              @click.stop="nativeShare()" :aria-label="tModal.shareNative">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" aria-hidden="true">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                <polyline points="16 6 12 2 8 6"/>
                <line x1="12" y1="2" x2="12" y2="15"/>
              </svg>
            </button>
            <!-- Boutons classiques (desktop / navigateurs sans Web Share API) -->
            <template v-else>
              <button type="button" class="news-modal__share-btn news-modal__share-btn--x"
                 @click.stop="openShare(shareLinks.x)" :aria-label="tModal.shareX">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </button>
              <button type="button" class="news-modal__share-btn news-modal__share-btn--facebook"
                 @click.stop="openShare(shareLinks.facebook)" :aria-label="tModal.shareFacebook">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </button>
              <button type="button" class="news-modal__share-btn news-modal__share-btn--whatsapp"
                 @click.stop="openShare(shareLinks.whatsapp)" :aria-label="tModal.shareWhatsapp">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </button>
              <button type="button" class="news-modal__share-btn news-modal__share-btn--linkedin"
                 @click.stop="openShare(shareLinks.linkedin)" :aria-label="tModal.shareLinkedin">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </button>
            </template>
          </div>
        </div>

      </div>
    </div>
  </Teleport>
</template>
