<script setup>
// Dans <script setup>, importer un composant .vue suffit à le "enregistrer" :
// pas besoin de `components: { Header, ... }` comme dans l'ancienne syntaxe.
// Le compilateur Vue détecte l'import et rend le tag <Header /> disponible
// dans le template ci-dessous.
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
  <!--
    App.vue est le composant "racine" : il assemble les autres composants
    comme des briques (composition de composants), chacun gérant sa propre
    section de la page (voir main.js, qui monte <App /> sur #app).

    À noter : contrairement à Vue 2 (qui imposait un seul élément racine dans
    le template), Vue 3 autorise plusieurs éléments au premier niveau — ici
    <Header>, <main> et <Footer> sont trois "racines" du template, sans avoir
    besoin de les envelopper dans un <div> englobant inutile.
  -->
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
