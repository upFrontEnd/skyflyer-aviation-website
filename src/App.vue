<script setup>

import { defineAsyncComponent } from 'vue'
import Header from './components/Header.vue'
import LiveStream from './components/LiveStream.vue'
import UpcomingEvent from './components/UpcomingEvent.vue'
import Gallery from './components/Gallery.vue'
import LatestVideo from './components/LatestVideo.vue'
import Footer from './components/Footer.vue'
import AboutMe from './components/AboutMe.vue'
import Setup from './components/Setup.vue'

// Sections jamais visibles au premier rendu (plus bas dans la page, ou
// n'affichant rien tant qu'on ne clique pas dessus pour Contact) : import()
// dynamique plutôt qu'un import statique, pour que Vite les compile dans des
// fichiers JS séparés, téléchargés seulement quand Vue les monte réellement
// — au lieu d'alourdir le bundle initial avec du code pas encore utile.
const Partners = defineAsyncComponent(() => import('./components/Partners.vue'))
const Contributions = defineAsyncComponent(() => import('./components/Contributions.vue'))
const Shop = defineAsyncComponent(() => import('./components/Shop.vue'))
const Contact = defineAsyncComponent(() => import('./components/Contact.vue'))
const LegalNotice = defineAsyncComponent(() => import('./components/LegalNotice.vue'))
</script>

<template>
  <Header />
  <main>
    <LiveStream />
    <UpcomingEvent />
    <AboutMe />
    <Setup />
    <Contributions />
    <!-- <Gallery /> -->
    <Shop />
    <!-- <LatestVideo /> -->
    <Partners />
  </main>
  <Footer />
  <Contact />
  <LegalNotice />
</template>
