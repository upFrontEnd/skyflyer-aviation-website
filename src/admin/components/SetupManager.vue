<script setup>
import { computed, ref } from 'vue'
import { useSetupData } from '../../composables/useSetupData.js'
import AdminIcon from './AdminIcon.vue'
import FormStatus from './FormStatus.vue'

const { items, loading, addItem, updateItem, deleteItem } = useSetupData()

const blank = () => ({
  side: 'left',
  display_order: 0,
  category_fr: '',
  category_en: '',
  name: '',
  specs: '',
  icon_svg: '',
  href: ''
})

const tab = ref('list')
const newItem = ref(blank())
const addStatus = ref('idle')
const editingId = ref(null)

const feedback = computed(() => ({
  saved: { tone: 'success', message: 'Élément ajouté.' },
  error: { tone: 'error', message: 'Erreur lors de l\'ajout.' }
}[addStatus.value] ?? { message: '' }))

// Sauvegarde inline d'un champ au blur (même principe que PartnersManager).
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
    tab.value = 'list'
  } catch (e) {
    console.error(e)
    addStatus.value = 'error'
  }
}

async function onDelete(item) {
  if (!confirm(`Supprimer « ${item.name} » ?`)) return
  await deleteItem(item.id)
}
</script>

<template>
  <p v-if="loading" class="muted">Chargement…</p>
  <section v-else class="card">
    <div class="card__header card__header--tabs">
      <div class="tabs" role="tablist">
        <button type="button" role="tab" class="tabs__tab" :class="{ 'tabs__tab--active': tab === 'list' }" :aria-selected="tab === 'list'" @click="tab = 'list'">
          Éléments <span class="tabs__count">{{ items.length }}</span>
        </button>
        <button type="button" role="tab" class="tabs__tab" :class="{ 'tabs__tab--active': tab === 'add' }" :aria-selected="tab === 'add'" @click="tab = 'add'">
          Ajouter
        </button>
      </div>
      <FormStatus :tone="feedback.tone" :message="feedback.message" />
    </div>

    <div v-if="tab === 'list'" class="table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th class="table__icon">Icône</th>
            <th>Colonne</th>
            <th>Ordre</th>
            <th>Catégorie (fr / en)</th>
            <th>Nom</th>
            <th>Specs</th>
            <th>Lien</th>
            <th><span class="visually-hidden">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          <template v-for="item in items" :key="item.id">
            <tr>
              <td class="table__icon">
                <button
                  type="button"
                  class="svg-chip"
                  :class="{ 'svg-chip--active': editingId === item.id }"
                  :title="editingId === item.id ? 'Fermer' : 'Modifier le SVG'"
                  @click="editingId = editingId === item.id ? null : item.id"
                >
                  <!-- eslint-disable-next-line vue/no-v-html : SVG saisi par l'admin -->
                  <span v-html="item.icon_svg"></span>
                </button>
              </td>
              <td>
                <select class="input input--sm" :value="item.side" @change="onEditField(item, 'side', $event.target.value)">
                  <option value="left">Gauche</option>
                  <option value="right">Droite</option>
                </select>
              </td>
              <td>
                <input class="input input--sm input--num" type="number" :value="item.display_order" min="0" @change="onEditField(item, 'display_order', Number($event.target.value))" />
              </td>
              <td>
                <div class="stack">
                  <input class="input input--sm" type="text" :value="item.category_fr" placeholder="🇫🇷" @change="onEditField(item, 'category_fr', $event.target.value)" />
                  <input class="input input--sm" type="text" :value="item.category_en" placeholder="🇬🇧" @change="onEditField(item, 'category_en', $event.target.value)" />
                </div>
              </td>
              <td><input class="input input--sm" type="text" :value="item.name" @change="onEditField(item, 'name', $event.target.value)" /></td>
              <td><input class="input input--sm" type="text" :value="item.specs" @change="onEditField(item, 'specs', $event.target.value)" /></td>
              <td><input class="input input--sm" type="url" :value="item.href ?? ''" placeholder="https://..." @change="onEditField(item, 'href', $event.target.value || null)" /></td>
              <td>
                <button type="button" class="icon-btn icon-btn--danger" :aria-label="`Supprimer ${item.name}`" title="Supprimer" @click="onDelete(item)">
                  <AdminIcon name="trash" :size="18" />
                </button>
              </td>
            </tr>
            <tr v-if="editingId === item.id" class="table__editor">
              <td colspan="8">
                <label class="field__label" :for="`svg-${item.id}`">Code SVG de l'icône</label>
                <textarea :id="`svg-${item.id}`" class="input input--code" :value="item.icon_svg" rows="4" placeholder="<svg ...>...</svg>" @change="onEditField(item, 'icon_svg', $event.target.value)"></textarea>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      <p class="hint">Chaque champ est enregistré dès que tu le quittes. Clique sur une icône pour modifier son SVG.</p>
    </div>

    <form v-else class="fields setup-add" @submit.prevent="onAdd">
      <div class="field-row">
        <div class="field">
          <label class="field__label" for="new-side">Colonne</label>
          <select id="new-side" v-model="newItem.side" class="input">
            <option value="left">Gauche</option>
            <option value="right">Droite</option>
          </select>
        </div>
        <div class="field">
          <label class="field__label" for="new-order">Ordre</label>
          <input id="new-order" v-model.number="newItem.display_order" class="input" type="number" min="0" />
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label class="field__label" for="new-cat-fr">🇫🇷 Catégorie</label>
          <input id="new-cat-fr" v-model="newItem.category_fr" class="input" type="text" required />
        </div>
        <div class="field">
          <label class="field__label" for="new-cat-en">🇬🇧 Catégorie</label>
          <input id="new-cat-en" v-model="newItem.category_en" class="input" type="text" required />
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label class="field__label" for="new-name">Nom</label>
          <input id="new-name" v-model="newItem.name" class="input" type="text" required />
        </div>
        <div class="field">
          <label class="field__label" for="new-specs">Specs</label>
          <input id="new-specs" v-model="newItem.specs" class="input" type="text" />
        </div>
      </div>
      <div class="field">
        <label class="field__label" for="new-href">Lien <span class="field__optional">optionnel</span></label>
        <input id="new-href" v-model="newItem.href" class="input" type="url" placeholder="https://..." />
      </div>
      <div class="field">
        <label class="field__label" for="new-svg">Icône SVG</label>
        <div class="svg-field">
          <textarea id="new-svg" v-model="newItem.icon_svg" class="input input--code" rows="4" placeholder="<svg width=&quot;22&quot; height=&quot;22&quot; viewBox=&quot;0 0 24 24&quot; ...>...</svg>" required></textarea>
          <!-- eslint-disable-next-line vue/no-v-html : SVG saisi par l'admin -->
          <span class="svg-chip svg-chip--lg" aria-hidden="true" v-html="newItem.icon_svg"></span>
        </div>
      </div>
      <div>
        <button class="btn btn--primary" type="submit" :disabled="addStatus === 'saving'">
          <AdminIcon name="plus" :size="18" />
          {{ addStatus === 'saving' ? 'Ajout…' : 'Ajouter l\'élément' }}
        </button>
      </div>
    </form>
  </section>
</template>
