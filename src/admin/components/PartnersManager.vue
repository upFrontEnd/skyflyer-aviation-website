<script setup>
import { ref } from 'vue'
import { usePartnersData } from '../../composables/usePartnersData.js'
import { getPublicImageUrl } from '../../lib/supabase.js'
import ImageUploader from './ImageUploader.vue'

const { partners, loading, addPartner, updatePartner, deletePartner } = usePartnersData()

const newPartner = ref({ name: '', href: '', logo_path: null, logo_width: null, logo_height: null })
const addStatus = ref('idle')

function onNewLogoUploaded({ path, width, height }) {
  newPartner.value.logo_path = path
  newPartner.value.logo_width = width
  newPartner.value.logo_height = height
}

async function onAdd() {
  addStatus.value = 'saving'
  try {
    await addPartner({ ...newPartner.value, display_order: partners.value.length })
    newPartner.value = { name: '', href: '', logo_path: null, logo_width: null, logo_height: null }
    addStatus.value = 'saved'
  } catch {
    addStatus.value = 'error'
  }
}

// updatePartner() réécrit la ligne entière à chaque modif (nom, lien ou
// logo) — @change plutôt que @input sur les champs texte, pour n'appeler
// Supabase qu'une fois la saisie terminée (au blur), pas à chaque lettre
// tapée.
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
  <section class="admin-section">
    <h2>Partenaires</h2>
    <p v-if="loading">Chargement…</p>

    <ul v-else class="admin-partners-list">
      <li v-for="partner in partners" :key="partner.id" class="admin-partners-list__item">
        <ImageUploader
          folder="partners"
          :current-url="getPublicImageUrl(partner.logo_path)"
          @uploaded="(result) => onEditLogo(partner, result)"
        />
        <div class="admin-field">
          <label>Nom</label>
          <input type="text" :value="partner.name" @change="onEditField(partner, 'name', $event.target.value)" />
        </div>
        <div class="admin-field">
          <label>Lien</label>
          <input type="url" :value="partner.href" @change="onEditField(partner, 'href', $event.target.value)" />
        </div>
        <button class="btn admin-partners-list__delete" type="button" @click="onDelete(partner)">
          Supprimer
        </button>
      </li>
    </ul>

    <form class="admin-form" @submit.prevent="onAdd">
      <h3>Ajouter un partenaire</h3>
      <div class="admin-field">
        <label for="new-partner-name">Nom</label>
        <input id="new-partner-name" v-model="newPartner.name" type="text" required />
      </div>
      <div class="admin-field">
        <label for="new-partner-href">Lien</label>
        <input id="new-partner-href" v-model="newPartner.href" type="url" required />
      </div>
      <div class="admin-field">
        <label>Logo</label>
        <ImageUploader folder="partners" @uploaded="onNewLogoUploaded" />
      </div>
      <button class="btn" type="submit" :disabled="addStatus === 'saving' || !newPartner.logo_path">
        {{ addStatus === 'saving' ? 'Ajout…' : 'Ajouter' }}
      </button>
    </form>
  </section>
</template>
