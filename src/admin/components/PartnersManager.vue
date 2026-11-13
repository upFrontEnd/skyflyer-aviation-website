<script setup>
import { computed, ref } from 'vue'
import { usePartnersData } from '../../composables/usePartnersData.js'
import { getPublicImageUrl } from '../../lib/supabase.js'
import ImageUploader from './ImageUploader.vue'
import AdminIcon from './AdminIcon.vue'
import FormStatus from './FormStatus.vue'

const { partners, loading, addPartner, updatePartner, deletePartner } = usePartnersData()

const blank = () => ({ name: '', href: '', logo_path: null, logo_width: null, logo_height: null })
const newPartner = ref(blank())
const addStatus = ref('idle')
// Change de valeur après chaque ajout pour remonter un ImageUploader vide.
const uploaderKey = ref(0)

const feedback = computed(() => ({
  saved: { tone: 'success', message: 'Partenaire ajouté.' },
  error: { tone: 'error', message: 'Impossible d\'ajouter le partenaire.' }
}[addStatus.value] ?? { message: '' }))

function onNewLogoUploaded({ path, width, height }) {
  newPartner.value.logo_path = path
  newPartner.value.logo_width = width
  newPartner.value.logo_height = height
}

async function onAdd() {
  addStatus.value = 'saving'
  try {
    await addPartner({ ...newPartner.value, display_order: partners.value.length })
    newPartner.value = blank()
    uploaderKey.value++
    addStatus.value = 'saved'
  } catch {
    addStatus.value = 'error'
  }
}

// updatePartner() réécrit la ligne entière à chaque modif (nom, lien ou
// logo). @change plutôt que @input sur les champs texte, pour n'appeler
// Supabase qu'une fois la saisie terminée (au blur), pas à chaque lettre.
async function onEditField(partner, field, value) {
  await updatePartner(partner.id, { [field]: value })
}

async function onEditLogo(partner, { path, width, height }) {
  await updatePartner(partner.id, { logo_path: path, logo_width: width, logo_height: height })
}

async function onDelete(partner) {
  if (!confirm(`Supprimer ${partner.name} ?`)) return
  await deletePartner(partner.id)
}
</script>

<template>
  <p v-if="loading" class="muted">Chargement…</p>
  <div v-else class="form-layout">
    <div class="form-layout__main">
      <p v-if="!partners.length" class="card empty">Aucun partenaire pour le moment.</p>
      <ul v-else class="partner-grid">
        <li v-for="partner in partners" :key="partner.id" class="card partner">
          <ImageUploader
            folder="partners"
            :current-url="getPublicImageUrl(partner.logo_path)"
            @uploaded="(result) => onEditLogo(partner, result)"
          />
          <div class="partner__fields">
            <div class="field">
              <label class="field__label" :for="`partner-name-${partner.id}`">Nom</label>
              <input :id="`partner-name-${partner.id}`" class="input" type="text" :value="partner.name" @change="onEditField(partner, 'name', $event.target.value)" />
            </div>
            <div class="field">
              <label class="field__label" :for="`partner-href-${partner.id}`">Lien</label>
              <input :id="`partner-href-${partner.id}`" class="input" type="url" :value="partner.href" @change="onEditField(partner, 'href', $event.target.value)" />
            </div>
          </div>
          <button class="icon-btn icon-btn--danger partner__delete" type="button" :aria-label="`Supprimer ${partner.name}`" title="Supprimer" @click="onDelete(partner)">
            <AdminIcon name="trash" :size="18" />
          </button>
        </li>
      </ul>
      <p class="hint">Les modifications d'un partenaire existant sont enregistrées dès que tu quittes le champ.</p>
    </div>

    <aside class="form-layout__aside">
      <form class="card" @submit.prevent="onAdd">
        <div class="card__header">
          <div>
            <h2 class="card__title">Ajouter un partenaire</h2>
            <p class="card__subtitle">Le logo est obligatoire</p>
          </div>
        </div>
        <div class="fields">
          <div class="field">
            <span class="field__label">Logo</span>
            <ImageUploader :key="uploaderKey" folder="partners" @uploaded="onNewLogoUploaded" />
          </div>
          <div class="field">
            <label class="field__label" for="new-partner-name">Nom</label>
            <input id="new-partner-name" v-model="newPartner.name" class="input" type="text" required />
          </div>
          <div class="field">
            <label class="field__label" for="new-partner-href">Lien</label>
            <input id="new-partner-href" v-model="newPartner.href" class="input" type="url" placeholder="https://..." required />
          </div>
        </div>
        <div class="card__actions">
          <button class="btn btn--primary btn--block" type="submit" :disabled="addStatus === 'saving' || !newPartner.logo_path">
            <AdminIcon name="plus" :size="18" />
            {{ addStatus === 'saving' ? 'Ajout…' : 'Ajouter' }}
          </button>
          <FormStatus :tone="feedback.tone" :message="feedback.message" />
        </div>
      </form>
    </aside>
  </div>
</template>
