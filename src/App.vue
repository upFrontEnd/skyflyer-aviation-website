<script setup>

import Header from './components/Header.vue'
import LiveStream from './components/LiveStream.vue'
import UpcomingEvent from './components/UpcomingEvent.vue'
import Gallery from './components/Gallery.vue'
import Volanta from './components/Volanta.vue'
import LatestVideo from './components/LatestVideo.vue'
import Partners from './components/Partners.vue'
import Contributions from './components/Contributions.vue'
import Footer from './components/Footer.vue'
import AboutMe from './components/AboutMe.vue'
import Contact from './components/Contact.vue'
</script>

<template>
  <Header />
  <main>
    <LiveStream />
    <UpcomingEvent />
    <AboutMe />
    <Contributions />
    <Gallery />
    <Volanta />
    <LatestVideo />
    <Partners />
  </main>
  <Footer />
  <Contact />
</template>
