import { ref, watchEffect } from 'vue'

const locale = ref(navigator.language.slice(0, 2) === 'fr' ? 'fr' : 'en')

watchEffect(() => {
  document.documentElement.lang = locale.value
  document.title = locale.value === 'fr'
    ? 'Skyflyer Aviation | Simulation de vol réaliste · IVAO & VATSIM'
    : 'Skyflyer Aviation | Realistic Flight Simulation · IVAO & VATSIM'
})

export function useLocale() {
  return { locale }
}
