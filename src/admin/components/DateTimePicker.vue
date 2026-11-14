<script setup>
// Bouton calendrier qui ouvre le sélecteur date + heure natif du navigateur
// (input datetime-local, caché derrière le bouton). L'input natif n'a pas de
// fuseau : en mode "utc", la valeur choisie est lue comme une heure Zulu.
// Émet un objet Date (instant absolu), au parent de le mettre en forme.
import { computed, ref } from 'vue'
import AdminIcon from './AdminIcon.vue'

const props = defineProps({
  // Instant déjà choisi (pour rouvrir le calendrier dessus), ou null
  value: { type: Date, default: null },
  utc: { type: Boolean, default: false },
  label: { type: String, required: true }
})
const emit = defineEmits(['pick'])

const input = ref(null)
const pad = (n) => String(n).padStart(2, '0')

// Date -> "AAAA-MM-JJTHH:MM", dans le fuseau du navigateur ou en UTC
const inputValue = computed(() => {
  const d = props.value
  if (!d) return ''
  return props.utc
    ? `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`
    : `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
})

function open() {
  const el = input.value
  if (typeof el.showPicker === 'function') {
    try { el.showPicker(); return } catch { /* repli ci-dessous */ }
  }
  el.focus()
  el.click()
}

function onChange(e) {
  const raw = e.target.value
  if (!raw) return
  // "AAAA-MM-JJTHH:MM" sans suffixe = heure locale ; avec "Z" = UTC
  const date = new Date(props.utc ? `${raw}:00Z` : raw)
  if (!Number.isNaN(date.getTime())) emit('pick', date)
}
</script>

<template>
  <span class="dt-picker">
    <button type="button" class="icon-btn dt-picker__btn" :aria-label="label" :title="label" @click="open">
      <AdminIcon name="calendar" :size="18" />
    </button>
    <input
      ref="input"
      class="dt-picker__native"
      type="datetime-local"
      tabindex="-1"
      aria-hidden="true"
      :value="inputValue"
      @change="onChange"
    />
  </span>
</template>

<style scoped>
.dt-picker {
  display: inline-flex;
  position: relative;
}

/* Invisible mais présent dans la mise en page : showPicker() positionne le
   calendrier sous l'input, donc sous le bouton. */
.dt-picker__native {
  border: 0;
  bottom: 0;
  height: 1px;
  left: 0;
  opacity: 0;
  padding: 0;
  pointer-events: none;
  position: absolute;
  width: 100%;
}
</style>
