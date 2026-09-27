<script setup>
// Composant "contrôlé" : il ne possède pas lui-même l'état ouvert/fermé, il
// le reçoit via modelValue (l'index de l'image affichée, ou null si fermé)
// et prévient le parent des changements via emit('update:modelValue', ...).
// v-model sur <Lightbox> dans Gallery.vue se traduit exactement en
// :model-value + @update:model-value — c'est le sucre syntaxique que Vue
// propose pour ce pattern props-down/events-up appliqué à un composant.
import { computed, watch, onUnmounted } from 'vue'

const props = defineProps({
  items: { type: Array, required: true },
  modelValue: { type: Number, default: null }
})
const emit = defineEmits(['update:modelValue'])

const isOpen = computed(() => props.modelValue !== null)
const current = computed(() => (isOpen.value ? props.items[props.modelValue] : null))

function close() {
  emit('update:modelValue', null)
}

function prev() {
  emit('update:modelValue', (props.modelValue - 1 + props.items.length) % props.items.length)
}

function next() {
  emit('update:modelValue', (props.modelValue + 1) % props.items.length)
}

// Écouteur sur `window` (pas sur un élément du template) : le clavier doit
// marcher dès que la lightbox est ouverte, sans dépendre du focus DOM exact
// de tel ou tel bouton. On l'attache/le retire au fil de isOpen plutôt que
// de le laisser actif en permanence, pour ne rien capter quand la lightbox
// est fermée.
function onKeydown(e) {
  if (e.key === 'Escape') close()
  else if (e.key === 'ArrowLeft') prev()
  else if (e.key === 'ArrowRight') next()
}

watch(isOpen, (open) => {
  if (open) window.addEventListener('keydown', onKeydown)
  else window.removeEventListener('keydown', onKeydown)
})

onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <!--
    Teleport déplace ce <div> pour qu'il devienne un enfant direct de <body>
    dans le DOM final, tout en restant écrit ici, au même endroit logique
    dans le template. Utile pour une lightbox : sans lui, l'overlay resterait
    imbriqué dans .gallery__grid, et un `overflow`/`transform` posé par un
    parent ailleurs sur la page pourrait le rogner ou fausser son
    position: fixed.
  -->
  <Teleport to="body">
    <Transition name="lightbox-fade">
      <div
        v-if="isOpen"
        class="lightbox"
        role="dialog"
        aria-modal="true"
        :aria-label="current?.alt"
        @click.self="close"
      >
        <button class="lightbox__close" type="button" aria-label="Fermer" @click="close">&times;</button>
        <button class="lightbox__nav lightbox__nav--prev" type="button" aria-label="Image précédente" @click="prev">&larr;</button>
        <img class="lightbox__img" :src="current.src" :alt="current.alt" />
        <button class="lightbox__nav lightbox__nav--next" type="button" aria-label="Image suivante" @click="next">&rarr;</button>
      </div>
    </Transition>
  </Teleport>
</template>
