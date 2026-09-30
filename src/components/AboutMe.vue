<script setup>
import { computed } from 'vue'
import { useLocale } from '../composables/useLocale.js'

const { locale } = useLocale()

const a320Alt = computed(() =>
  locale.value === 'fr' ? "Aux commande d'un simulateur A320" : 'At the controls of an A320 simulator'
)
const a320Caption = computed(() =>
  locale.value === 'fr' ? "Aux commande d'un simulateur A320" : 'At the controls of an A320 simulator'
)
</script>

<template>
  <section class="apropos" id="apropos" aria-labelledby="apropos-title">
    <div class="container">
        <h2 class="apropos__title" id="apropos-title">
          <span class="apropos__wing wing-left" aria-hidden="true"><i></i><i></i><i></i></span>
          {{ locale === 'fr' ? 'Bienvenue à bord !' : 'Welcome aboard!' }}
          <span class="apropos__wing wing-right" aria-hidden="true"><i></i><i></i><i></i></span>
        </h2>

        <div class="sub-container">
          <p v-if="locale === 'fr'" class="apropos__speach">
            Passionné par l’aviation et la simulation de vol sur PC depuis mon enfance, j’ai créé cet espace pour partager avec vous une passion qui m’accompagne depuis toujours.
            <br> <br>
            À travers mes vols sur <strong>IVAO</strong> et <strong>VATSIM</strong>, j’essaie de recréer une expérience aussi réaliste et immersive que possible, tout en gardant à l’esprit l’essentiel : au-delà du réalisme, je souhaite avant tout proposer un environnement où l’on se retrouve entre passionnés pour échanger, apprendre, découvrir et surtout passer un excellent moment ensemble.
            <br> <br>
            Que vous soyez pilote <strong>réel</strong> ou <strong>virtuel</strong>, débutant dans la simulation ou simplement curieux de découvrir cet univers, n’hésitez pas à nous rejoindre sur <a href="https://discord.com/invite/7b8kKh55sG" about="_blank">Discord</a>. Vous pouvez également me contacter via le formulaire de contact.
            <br> <br>
            <strong>Portez-vous bien et faites de bons vols </strong>
          </p>
          <p v-else class="apropos__speach">
            Passionate about aviation and PC flight simulation since childhood, I created this space to share with you a passion that has stayed with me all my life.
            <br> <br>
            Through my flights on <strong>IVAO</strong> and <strong>VATSIM</strong>, I try to recreate an experience that's as realistic and immersive as possible, while keeping the essential in mind: beyond realism, my main goal is to offer a place where enthusiasts can meet, share, learn, discover and above all have a great time together.
            <br> <br>
            Whether you're a <strong>real</strong> or <strong>virtual</strong> pilot, a beginner in simulation or simply curious to discover this world, feel free to join us on <a href="https://discord.com/invite/7b8kKh55sG" about="_blank">Discord</a>. You can also reach me through the contact form.
            <br> <br>
            <strong>Take care and have great flights!</strong>
          </p>

          <div class="apropos__photos">
            <figure class="apropos__photos--photo photo-01">
              <img src="../assets/piper.webp" width="640" height="427" :alt="locale === 'fr' ? 'Mon premier vol en Piper' : 'My first flight in a Piper'">
              <figcaption>{{ locale === 'fr' ? 'Mon premier vol en Piper' : 'My first flight in a Piper' }}</figcaption>
            </figure>

            <figure class="apropos__photos--photo photo-02">
              <img src="../assets/a320.webp" width="640" height="427" :alt="a320Alt">
              <figcaption>{{ a320Caption }}</figcaption>
            </figure>

          </div>
        </div>
    </div>
  </section>
</template>
