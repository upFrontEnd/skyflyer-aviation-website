<script setup>
import { ref } from 'vue'
import { useAdminAuth } from '../useAdminAuth.js'
import logoUrl from '../../assets/logo.webp'

const { login } = useAdminAuth()

const email = ref('')
const password = ref('')
const errorMessage = ref(null)
const submitting = ref(false)

async function onSubmit() {
  submitting.value = true
  errorMessage.value = null
  try {
    // login() ne retourne rien explicitement : useAdminAuth() met à jour sa
    // ref `user` partagée via onAuthStateChange dès que Supabase confirme la
    // connexion. AdminApp.vue bascule alors automatiquement vers le tableau
    // de bord, sans qu'on ait besoin de le faire ici.
    await login(email.value, password.value)
  } catch {
    errorMessage.value = 'Identifiants incorrects.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="login">
    <form class="login__card" @submit.prevent="onSubmit">
      <img class="login__logo" :src="logoUrl" alt="" width="56" height="56" />
      <div class="login__heading">
        <h1 class="login__title">Administration</h1>
        <p class="login__subtitle">Connecte-toi pour gérer le site Skyflyer Aviation.</p>
      </div>
      <div class="fields">
        <div class="field">
          <label class="field__label" for="admin-email">E-mail</label>
          <input id="admin-email" v-model="email" class="input" type="email" required autocomplete="username" />
        </div>
        <div class="field">
          <label class="field__label" for="admin-password">Mot de passe</label>
          <input id="admin-password" v-model="password" class="input" type="password" required autocomplete="current-password" />
        </div>
      </div>
      <button class="btn btn--primary btn--block" type="submit" :disabled="submitting">
        {{ submitting ? 'Connexion…' : 'Se connecter' }}
      </button>
      <p v-if="errorMessage" class="status status--error" role="alert">{{ errorMessage }}</p>
    </form>
  </div>
</template>
