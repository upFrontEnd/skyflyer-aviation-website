<script setup>
import { ref } from 'vue'
import { useAdminAuth } from '../useAdminAuth.js'

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
    // connexion — AdminApp.vue bascule alors automatiquement vers le
    // tableau de bord, sans qu'on ait besoin de le faire ici.
    await login(email.value, password.value)
  } catch (err) {
    errorMessage.value = 'Identifiants incorrects.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="admin-login">
    <form class="admin-login__form" @submit.prevent="onSubmit">
      <h1>Administration</h1>
      <div class="admin-field">
        <label for="admin-email">E-mail</label>
        <input id="admin-email" v-model="email" type="email" required autocomplete="username" />
      </div>
      <div class="admin-field">
        <label for="admin-password">Mot de passe</label>
        <input id="admin-password" v-model="password" type="password" required autocomplete="current-password" />
      </div>
      <button class="btn" type="submit" :disabled="submitting">
        {{ submitting ? 'Connexion…' : 'Se connecter' }}
      </button>
      <p v-if="errorMessage" class="admin-login__error">{{ errorMessage }}</p>
    </form>
  </div>
</template>
