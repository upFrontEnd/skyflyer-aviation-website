<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useAdminAuth } from './useAdminAuth.js'
import { useAdminNav } from './useAdminNav.js'
import { ADMIN_PAGES, EXTERNAL_TOOLS } from './navigation.js'
import { usePartnersData } from '../composables/usePartnersData.js'
import { useSetupData } from '../composables/useSetupData.js'
import LoginForm from './components/LoginForm.vue'
import AdminIcon from './components/AdminIcon.vue'
import logoUrl from '../assets/logo.webp'

const { user, loading, init, logout } = useAdminAuth()
const { current, go } = useAdminNav()

// init() lance la vérification de session auprès de Supabase ; tant que
// `loading` est vrai on ne sait pas encore si l'admin est connecté ou non,
// donc on n'affiche ni le formulaire de connexion ni le tableau de bord
// (évite un flash du formulaire de connexion pour un admin déjà connecté).
onMounted(init)

const page = computed(() => ADMIN_PAGES.find(p => p.key === current.value) ?? ADMIN_PAGES[0])

// Pages regroupées par section de la barre latérale, dans l'ordre de
// ADMIN_PAGES (null = en tête, sans titre de section).
const navGroups = computed(() => {
  const groups = []
  for (const p of ADMIN_PAGES) {
    let group = groups.find(g => g.title === p.group)
    if (!group) groups.push(group = { title: p.group, pages: [] })
    group.pages.push(p)
  }
  return groups
})

// Compteurs affichés à droite de certaines entrées du menu.
const { partners } = usePartnersData()
const { items: setupItems } = useSetupData()
const counts = computed(() => ({
  partners: partners.value?.length || null,
  setup: setupItems.value?.length || null
}))

// Sur mobile, la barre latérale devient un tiroir : on le referme dès
// qu'une page est choisie.
const sidebarOpen = ref(false)
function navigate(key) {
  go(key)
  sidebarOpen.value = false
}

watch(page, (p) => {
  document.title = `${p.label} · Admin Skyflyer Aviation`
  document.querySelector('.shell__main')?.scrollTo({ top: 0 })
}, { immediate: true })
</script>

<template>
  <div class="admin">
    <p v-if="loading" class="admin__loading">Chargement…</p>

    <LoginForm v-else-if="!user" />

    <div v-else class="shell" :class="{ 'shell--nav-open': sidebarOpen }">
      <aside class="sidebar" aria-label="Navigation de l'admin">
        <div class="sidebar__brand">
          <img class="sidebar__logo" :src="logoUrl" alt="" width="40" height="40" />
          <div>
            <p class="sidebar__name">Skyflyer Aviation</p>
            <p class="sidebar__role">Administration</p>
          </div>
        </div>

        <nav class="sidebar__nav">
          <div v-for="group in navGroups" :key="group.title ?? 'main'" class="sidebar__group">
            <p v-if="group.title" class="sidebar__group-title">{{ group.title }}</p>
            <a
              v-for="p in group.pages"
              :key="p.key"
              :href="`#${p.key === 'overview' ? '' : p.key}`"
              class="sidebar__link"
              :class="[{ 'sidebar__link--active': p.key === page.key }, p.tone && `tone-${p.tone}`]"
              :aria-current="p.key === page.key ? 'page' : undefined"
              @click.prevent="navigate(p.key)"
            >
              <AdminIcon :name="p.icon" class="sidebar__icon" />
              <span>{{ p.label }}</span>
              <span v-if="counts[p.key]" class="sidebar__count">{{ counts[p.key] }}</span>
            </a>
          </div>

          <div class="sidebar__group">
            <p class="sidebar__group-title">Outils de stream</p>
            <a
              v-for="tool in EXTERNAL_TOOLS"
              :key="tool.key"
              :href="tool.href"
              class="sidebar__link"
              :class="`tone-${tool.tone}`"
            >
              <AdminIcon :name="tool.icon" class="sidebar__icon" />
              <span>{{ tool.label }}</span>
            </a>
          </div>
        </nav>

        <div class="sidebar__footer">
          <a class="sidebar__link" href="/" target="_blank" rel="noopener">
            <AdminIcon name="external" class="sidebar__icon" />
            <span>Voir le site</span>
          </a>
          <div class="sidebar__user">
            <span class="sidebar__avatar" aria-hidden="true">{{ user.email?.[0]?.toUpperCase() }}</span>
            <span class="sidebar__email" :title="user.email">{{ user.email }}</span>
            <button class="icon-btn" type="button" title="Déconnexion" aria-label="Déconnexion" @click="logout">
              <AdminIcon name="logout" :size="18" />
            </button>
          </div>
        </div>
      </aside>

      <div class="shell__scrim" @click="sidebarOpen = false"></div>

      <div class="shell__main">
        <header class="topbar">
          <button class="icon-btn topbar__menu" type="button" aria-label="Ouvrir le menu" @click="sidebarOpen = true">
            <AdminIcon name="menu" />
          </button>
          <AdminIcon :name="page.icon" class="topbar__icon" />
          <span class="topbar__title">{{ page.label }}</span>
        </header>

        <main class="page">
          <header v-if="page.key !== 'overview'" class="page__header">
            <h1 class="page__title">{{ page.label }}</h1>
            <p v-if="page.description" class="page__lead">{{ page.description }}</p>
          </header>
          <component :is="page.component" />
        </main>
      </div>
    </div>
  </div>
</template>
