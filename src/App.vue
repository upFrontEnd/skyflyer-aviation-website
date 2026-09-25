<script setup>
import Header from './components/Header.vue'
import LiveStream from './components/LiveStream.vue'
import UpcomingEvent from './components/UpcomingEvent.vue'
import NewsList from './components/NewsList.vue'
import Gallery from './components/Gallery.vue'
import LatestVideo from './components/LatestVideo.vue'
import Partners from './components/Partners.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <Header />
  <main>
    <LiveStream />
    <UpcomingEvent />
    <NewsList />
    <Gallery />
    <LatestVideo />
    <Partners />
  </main>
  <Footer />
</template>
