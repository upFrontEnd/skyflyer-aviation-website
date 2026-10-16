<script setup>
import { ref, computed, watch } from 'vue'
import { useNewsData } from '../../composables/useNewsData.js'
import { getPublicImageUrl } from '../../lib/supabase.js'
import ImageUploader from './ImageUploader.vue'
import { useCollapsible } from '../useCollapsible.js'

const { news, loading, addNews, updateNews, deleteNews } = useNewsData()
const { isOpen, toggle } = useCollapsible('news')

const TAG_VARIANTS = [
  { label: 'MSFS',    value: 'msfs',   color: '#009fe3' },
  { label: 'X-Plane', value: 'xp',     color: '#0fb5e8' },
  { label: 'IVAO',    value: 'ivao',   color: 'linear-gradient(135deg, #0D2C99, #3b5bdb)' },
  { label: 'VATSIM',  value: 'vatsim', color: '#29B473' },
]

function tagStyle(variant) {
  const v = TAG_VARIANTS.find(t => t.value === variant)
  if (!v) return {}
  return v.color.includes('gradient')
    ? { background: v.color }
    : { backgroundColor: v.color }
}

function toDatetimeLocal(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// État local du contenu par item.id pour éviter les réécritures lors du refetch Supabase
const localContent = ref({})
const localContentEn = ref({})
watch(news, (items) => {
  items.forEach(item => {
    if (!(item.id in localContent.value)) {
      localContent.value[item.id] = item.content ?? ''
    }
    if (!(item.id in localContentEn.value)) {
      localContentEn.value[item.id] = item.content_en ?? ''
    }
  })
}, { immediate: true })

const contentSaveStatus = ref({})
const contentSaveError = ref({})
async function saveContent(item) {
  contentSaveStatus.value[item.id] = 'saving'
  contentSaveError.value[item.id] = null
  try {
    await updateNews(item.id, {
      content:    localContent.value[item.id],
      content_en: localContentEn.value[item.id] || null,
    })
    contentSaveStatus.value[item.id] = 'saved'
  } catch (err) {
    contentSaveStatus.value[item.id] = 'error'
    contentSaveError.value[item.id] = err?.message ?? String(err)
    console.error('saveContent error:', err)
  }
}

const newItem = ref({
  title: '', title_en: '', tag: '', tag_variant: 'msfs',
  published_at: new Date().toISOString(),
  thumbnail_path: null, illustration_path: null, link: '', content: '', content_en: '', active: true,
})
const addStatus = ref('idle')

const newTagStyle = computed(() => tagStyle(newItem.value.tag_variant))
const canAdd = computed(() =>
  newItem.value.thumbnail_path &&
  newItem.value.illustration_path &&
  newItem.value.link &&
  newItem.value.content.trim()
)

function onSelectVariant(item, value) {
  updateNews(item.id, { tag_variant: value })
}
function onNewThumbnailUploaded({ path }) { newItem.value.thumbnail_path = path }
function onNewIllustrationUploaded({ path }) { newItem.value.illustration_path = path }
async function onEditThumbnail(item, { path }) { await updateNews(item.id, { thumbnail_path: path }) }
async function onEditIllustration(item, { path }) { await updateNews(item.id, { illustration_path: path }) }

async function onAdd() {
  addStatus.value = 'saving'
  try {
    const variant = TAG_VARIANTS.find(t => t.value === newItem.value.tag_variant)
    await addNews({
      title: newItem.value.title,
      title_en: newItem.value.title_en || null,
      tag: newItem.value.tag || variant?.label || newItem.value.tag_variant,
      tag_variant: newItem.value.tag_variant,
      published_at: newItem.value.published_at,
      thumbnail_path: newItem.value.thumbnail_path,
      illustration_path: newItem.value.illustration_path || null,
      link: newItem.value.link,
      content: newItem.value.content,
      content_en: newItem.value.content_en || null,
      active: newItem.value.active,
      display_order: news.value.length,
    })
    newItem.value = {
      title: '', title_en: '', tag: '', tag_variant: 'msfs',
      published_at: new Date().toISOString(),
      thumbnail_path: null, illustration_path: null, link: '', content: '', content_en: '', active: true,
    }
    addStatus.value = 'saved'
  } catch {
    addStatus.value = 'error'
  }
}

async function onEditField(item, field, value) {
  await updateNews(item.id, { [field]: value })
}

async function onDelete(item) {
  if (!confirm(`Supprimer "${item.title}" ?`)) return
  await deleteNews(item.id)
}
</script>

<template>
  <section class="admin-news" :class="{ 'admin-panel-closed': !isOpen }">
    <h2 class="admin-panel__title" @click="toggle">
      Actualités
      <svg class="admin-panel__arrow" :class="{ 'admin-panel__arrow--open': isOpen }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
    </h2>
    <div class="admin-collapse" :class="{ 'admin-collapse--closed': !isOpen }">
      <div class="admin-collapse__inner">
    <p v-if="loading">Chargement…</p>

    <ul v-else class="admin-news-list">
      <li v-for="item in news" :key="item.id" class="admin-news-list__item" :class="{ 'admin-news-list__item--active': item.active }">

        <div class="admin-news-list__row">
          <div class="admin-field">
            <label>Plateforme</label>
            <div class="admin-news-platform">
              <span class="admin-news-tag-preview" :style="tagStyle(item.tag_variant)">
                {{ item.tag || TAG_VARIANTS.find(t => t.value === item.tag_variant)?.label }}
              </span>
              <select :value="item.tag_variant" @change="onSelectVariant(item, $event.target.value)">
                <option v-for="v in TAG_VARIANTS" :key="v.value" :value="v.value">{{ v.label }}</option>
              </select>
            </div>
          </div>
          <div class="admin-field">
            <label>Label du tag (optionnel)</label>
            <input type="text" :value="item.tag" @change="onEditField(item, 'tag', $event.target.value)" placeholder="Laissez vide = nom plateforme" />
          </div>
        </div>

        <div class="admin-news-list__row">
          <div class="admin-field">
            <label>🇫🇷 Titre</label>
            <input type="text" :value="item.title" @change="onEditField(item, 'title', $event.target.value)" />
          </div>
          <div class="admin-field">
            <label>🇬🇧 Titre</label>
            <input type="text" :value="item.title_en" @change="onEditField(item, 'title_en', $event.target.value)" placeholder="Optionnel" />
          </div>
        </div>

        <div class="admin-news-list__row">
          <div class="admin-field">
            <label>Date de publication *</label>
            <input type="datetime-local" :value="toDatetimeLocal(item.published_at)" @change="onEditField(item, 'published_at', new Date($event.target.value).toISOString())" required />
          </div>
          <div class="admin-field">
            <label>Lien *</label>
            <input type="url" :value="item.link" @change="onEditField(item, 'link', $event.target.value)" required />
          </div>
        </div>

        <div class="admin-news-list__row">
          <div class="admin-field">
            <label>Miniature *</label>
            <ImageUploader folder="news" :current-url="getPublicImageUrl(item.thumbnail_path)" @uploaded="(r) => onEditThumbnail(item, r)" />
          </div>
          <div class="admin-field">
            <label>Illustration de l'article (optionnel)</label>
            <ImageUploader folder="news" :current-url="getPublicImageUrl(item.illustration_path)" @uploaded="(r) => onEditIllustration(item, r)" />
          </div>
        </div>

        <div class="admin-news-list__row">
          <div class="admin-field">
            <label>🇫🇷 Contenu * <span class="admin-field__hint">— HTML accepté : &lt;p&gt;, &lt;a href=""&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;br&gt;</span></label>
            <textarea rows="8" v-model="localContent[item.id]" placeholder="Texte de l'article (français). HTML accepté." />
          </div>
          <div class="admin-field">
            <label>🇬🇧 Contenu <span class="admin-field__hint">— optionnel, même HTML accepté</span></label>
            <textarea rows="8" v-model="localContentEn[item.id]" placeholder="Article content (English). Optional." />
          </div>
        </div>
        <div class="admin-news-content-footer">
          <button class="btn btn--success" type="button" :disabled="contentSaveStatus[item.id] === 'saving'" @click="saveContent(item)">
            {{ contentSaveStatus[item.id] === 'saving' ? 'Sauvegarde…' : 'Sauvegarder le contenu' }}
          </button>
          <span v-if="contentSaveStatus[item.id] === 'saved'" class="admin-feedback admin-feedback--success">Sauvegardé ✓</span>
          <span v-if="contentSaveStatus[item.id] === 'error'" class="admin-feedback admin-feedback--error">{{ contentSaveError[item.id] || 'Erreur' }}</span>
        </div>

        <div class="admin-news-list__footer">
          <label :for="`news-active-${item.id}`">
            <input type="checkbox" :id="`news-active-${item.id}`" :checked="item.active" @change="onEditField(item, 'active', $event.target.checked)" />
            Afficher sur le site
          </label>
          <button class="admin-news-list__delete btn" type="button" @click="onDelete(item)">Supprimer</button>
        </div>
      </li>
    </ul>

    <form class="admin-form" @submit.prevent="onAdd">
      <h3>Ajouter une actualité</h3>
      <div class="admin-news-list__row">
        <div class="admin-field">
          <label for="new-news-variant">Plateforme</label>
          <div class="admin-news-platform">
            <span class="admin-news-tag-preview" :style="newTagStyle">
              {{ newItem.tag || TAG_VARIANTS.find(t => t.value === newItem.tag_variant)?.label }}
            </span>
            <select id="new-news-variant" v-model="newItem.tag_variant">
              <option v-for="v in TAG_VARIANTS" :key="v.value" :value="v.value">{{ v.label }}</option>
            </select>
          </div>
        </div>
        <div class="admin-field">
          <label for="new-news-tag">Label du tag (optionnel)</label>
          <input id="new-news-tag" v-model="newItem.tag" type="text" placeholder="Laissez vide = nom plateforme" />
        </div>
      </div>
      <div class="admin-news-list__row">
        <div class="admin-field">
          <label for="new-news-title">🇫🇷 Titre</label>
          <input id="new-news-title" v-model="newItem.title" type="text" required />
        </div>
        <div class="admin-field">
          <label for="new-news-title-en">🇬🇧 Titre</label>
          <input id="new-news-title-en" v-model="newItem.title_en" type="text" placeholder="Optionnel" />
        </div>
      </div>
      <div class="admin-news-list__row">
        <div class="admin-field">
          <label for="new-news-date">Date de publication *</label>
          <input id="new-news-date" type="datetime-local" :value="toDatetimeLocal(newItem.published_at)" @change="newItem.published_at = new Date($event.target.value).toISOString()" required />
        </div>
        <div class="admin-field">
          <label for="new-news-link">Lien *</label>
          <input id="new-news-link" v-model="newItem.link" type="url" required />
        </div>
      </div>
      <div class="admin-news-list__row">
        <div class="admin-field">
          <label>Miniature *</label>
          <ImageUploader folder="news" @uploaded="onNewThumbnailUploaded" />
        </div>
        <div class="admin-field">
          <label>Illustration de l'article *</label>
          <ImageUploader folder="news" @uploaded="onNewIllustrationUploaded" />
        </div>
      </div>
      <div class="admin-news-list__row">
        <div class="admin-field">
          <label for="new-news-content">🇫🇷 Contenu * <span class="admin-field__hint">— HTML accepté : &lt;p&gt;, &lt;a href=""&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;br&gt;</span></label>
          <textarea id="new-news-content" v-model="newItem.content" rows="8" required placeholder="Texte de l'article (français). HTML accepté." />
        </div>
        <div class="admin-field">
          <label for="new-news-content-en">🇬🇧 Contenu <span class="admin-field__hint">— optionnel</span></label>
          <textarea id="new-news-content-en" v-model="newItem.content_en" rows="8" placeholder="Article content (English). Optional." />
        </div>
      </div>
      <div class="admin-news-form-footer">
        <button class="btn btn--success" type="submit" :disabled="addStatus === 'saving' || !canAdd">
          {{ addStatus === 'saving' ? 'Ajout…' : 'Ajouter' }}
        </button>
        <label for="new-news-active">
          <input id="new-news-active" v-model="newItem.active" type="checkbox" />
          Afficher sur le site
        </label>
        <span v-if="!canAdd" class="admin-feedback admin-feedback--error">Miniature, illustration, lien et contenu requis</span>
        <span v-else-if="addStatus === 'error'" class="admin-feedback admin-feedback--error">Erreur lors de l'ajout</span>
        <span v-else-if="addStatus === 'saved'" class="admin-feedback admin-feedback--success">Ajouté ✓</span>
      </div>
    </form>
      </div>
    </div>
  </section>
</template>
