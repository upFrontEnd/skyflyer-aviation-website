<script setup>
import { ref } from 'vue'
import { useSetupData } from '../../composables/useSetupData.js'

const { items, loading, addItem, updateItem, deleteItem } = useSetupData()

const blank = () => ({
  side: 'left',
  display_order: 0,
  category_fr: '',
  category_en: '',
  name: '',
  specs: '',
  icon_svg: '',
  href: '',
})

const newItem   = ref(blank())
const addStatus = ref('idle')
const editingId = ref(null)

// Sauvegarde inline d'un champ au blur (même pattern que PartnersManager)
async function onEditField(item, field, value) {
  await updateItem(item.id, { [field]: value })
}

async function onAdd() {
  addStatus.value = 'saving'
  try {
    const payload = { ...newItem.value }
    if (!payload.href) delete payload.href
    await addItem(payload)
    newItem.value = blank()
    addStatus.value = 'saved'
  } catch (e) {
    console.error(e)
    addStatus.value = 'error'
  }
}

async function onDelete(item) {
  if (!confirm(`Supprimer « ${item.name} » ?`)) return
  await deleteItem(item.id)
}

const sideLabel = (s) => s === 'left' ? 'Gauche' : 'Droite'
</script>

<template>
  <section class="admin-section">
    <h2>Setup — Matériel</h2>

    <p v-if="loading">Chargement…</p>

    <table v-else class="admin-setup-table">
      <thead>
        <tr>
          <th>Colonne</th>
          <th>Ordre</th>
          <th>Catégorie (fr / en)</th>
          <th>Nom</th>
          <th>Specs</th>
          <th>Lien</th>
          <th>SVG</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <!-- Colonne -->
          <td>
            <select
              :value="item.side"
              @change="onEditField(item, 'side', $event.target.value)"
            >
              <option value="left">Gauche</option>
              <option value="right">Droite</option>
            </select>
          </td>
          <!-- Ordre -->
          <td>
            <input
              type="number"
              :value="item.display_order"
              min="0"
              style="width:4rem"
              @change="onEditField(item, 'display_order', Number($event.target.value))"
            />
          </td>
          <!-- Catégorie fr / en -->
          <td>
            <input
              type="text"
              :value="item.category_fr"
              placeholder="fr"
              @change="onEditField(item, 'category_fr', $event.target.value)"
            />
            <input
              type="text"
              :value="item.category_en"
              placeholder="en"
              @change="onEditField(item, 'category_en', $event.target.value)"
            />
          </td>
          <!-- Nom -->
          <td>
            <input
              type="text"
              :value="item.name"
              @change="onEditField(item, 'name', $event.target.value)"
            />
          </td>
          <!-- Specs -->
          <td>
            <input
              type="text"
              :value="item.specs"
              @change="onEditField(item, 'specs', $event.target.value)"
            />
          </td>
          <!-- Lien -->
          <td>
            <input
              type="url"
              :value="item.href ?? ''"
              placeholder="https://…"
              @change="onEditField(item, 'href', $event.target.value || null)"
            />
          </td>
          <!-- SVG -->
          <td>
            <div class="admin-setup-svg-cell">
              <!-- Aperçu -->
              <span class="admin-setup-svg-preview" v-html="item.icon_svg"></span>
              <button
                type="button"
                class="btn"
                style="font-size:.7rem;padding:.25rem .5rem"
                @click="editingId = editingId === item.id ? null : item.id"
              >
                {{ editingId === item.id ? 'Fermer' : 'Éditer SVG' }}
              </button>
              <textarea
                v-if="editingId === item.id"
                :value="item.icon_svg"
                rows="4"
                placeholder="<svg …>…</svg>"
                @change="onEditField(item, 'icon_svg', $event.target.value)"
              ></textarea>
            </div>
          </td>
          <!-- Supprimer -->
          <td>
            <button type="button" class="btn admin-partners-list__delete" @click="onDelete(item)">
              Supprimer
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Formulaire d'ajout -->
    <form class="admin-form" @submit.prevent="onAdd">
      <h3>Ajouter un item</h3>

      <div class="admin-form__row">
        <div class="admin-field">
          <label>Colonne</label>
          <select v-model="newItem.side">
            <option value="left">Gauche</option>
            <option value="right">Droite</option>
          </select>
        </div>
        <div class="admin-field">
          <label>Ordre</label>
          <input v-model.number="newItem.display_order" type="number" min="0" style="width:5rem" />
        </div>
      </div>

      <div class="admin-form__row">
        <div class="admin-field">
          <label>Catégorie (fr)</label>
          <input v-model="newItem.category_fr" type="text" required />
        </div>
        <div class="admin-field">
          <label>Catégorie (en)</label>
          <input v-model="newItem.category_en" type="text" required />
        </div>
      </div>

      <div class="admin-form__row">
        <div class="admin-field">
          <label>Nom</label>
          <input v-model="newItem.name" type="text" required />
        </div>
        <div class="admin-field">
          <label>Specs</label>
          <input v-model="newItem.specs" type="text" />
        </div>
      </div>

      <div class="admin-field">
        <label>Lien (optionnel)</label>
        <input v-model="newItem.href" type="url" placeholder="https://…" />
      </div>

      <div class="admin-field">
        <label>Icône SVG</label>
        <textarea v-model="newItem.icon_svg" rows="4" placeholder="<svg width=&quot;22&quot; height=&quot;22&quot; viewBox=&quot;0 0 24 24&quot; …>…</svg>" required></textarea>
        <div v-if="newItem.icon_svg" class="admin-setup-svg-preview" v-html="newItem.icon_svg"></div>
      </div>

      <button class="btn" type="submit" :disabled="addStatus === 'saving'">
        {{ addStatus === 'saving' ? 'Ajout…' : 'Ajouter' }}
      </button>
      <span v-if="addStatus === 'error'" style="color:red;margin-left:.5rem">Erreur lors de l'ajout</span>
    </form>
  </section>
</template>
