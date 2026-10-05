<script setup>
import { onMounted } from 'vue'
import { useAdminAuth } from './useAdminAuth.js'
import LoginForm from './components/LoginForm.vue'
import EventForm from './components/EventForm.vue'
import PartnersManager from './components/PartnersManager.vue'
import SetupManager from './components/SetupManager.vue'
import LegalNoticeForm from './components/LegalNoticeForm.vue'

const { user, loading, init, logout } = useAdminAuth()

// init() lance la vérification de session auprès de Supabase ; tant que
// `loading` est vrai on ne sait pas encore si l'admin est connecté ou non,
// donc on n'affiche ni le formulaire de connexion ni le tableau de bord
// (éviterait un flash du formulaire de connexion pour un admin déjà connecté).
onMounted(init)
</script>

<template>
  <div class="admin">
    <p v-if="loading" class="admin__loading">Chargement…</p>

    <LoginForm v-else-if="!user" />

    <div v-else class="admin__dashboard">
      <header class="admin__header">
        <h1>
          <img class="admin__logo" src="../assets/logo.webp" alt="Logo Skyflyer Aviation">
          Administration Skyflyer Aviation
        </h1>
        <button class="btn btn--error" type="button" @click="logout">Déconnexion</button>
      </header>
      <div class="container">
        <EventForm />
        <LegalNoticeForm />   
      </div> 
      <div class="container">
        <SetupManager />
      </div>
        <PartnersManager />
      

    </div>
  </div>
</template>
