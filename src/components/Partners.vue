<script setup>
import { usePartnersData } from '../composables/usePartnersData.js'
import { getPublicImageUrl } from '../lib/supabase.js'

// Remplace l'ancien `import { partners } from '../data/partners.js'` : la
// liste vient maintenant de Supabase, modifiable depuis /admin.html 
const { partners } = usePartnersData()
</script>

<template>
  <section class="partners" id="partenaires" aria-labelledby="partners-title">
    <div class="container">
      <ul class="partners__grid">
        <!--
          v-for + :key comme dans le reste du projet. `partner.logo_path` est
          soit le chemin d'un logo uploadé via l'admin, soit `null` pour un
          partenaire qui n'en a pas encore. v-if/v-else bascule entre les
          deux rendus : c'est la façon Vue de faire du rendu conditionnel,
          équivalent déclaratif d'un `if/else` en JS classique.
        -->
        <li v-for="partner in partners" :key="partner.id" class="partners__item">
          <a :href="partner.href" :aria-label="partner.name" target="_blank">
            <img
              v-if="partner.logo_path"
              class="partners__logo"
              :src="getPublicImageUrl(partner.logo_path)"
              :width="partner.logo_width"
              :height="partner.logo_height"
              :alt="partner.name"
            />
            <span v-else class="partners__badge"></span>
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>
