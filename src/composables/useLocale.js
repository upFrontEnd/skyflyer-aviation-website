import { ref } from 'vue'

// navigator.language renvoie un code du type "fr-FR", "en-US", "de-DE"... :
// on ne garde que les deux premières lettres pour savoir si le visiteur est
// francophone, sinon on bascule sur l'anglais par défaut.
const locale = ref(navigator.language.slice(0, 2) === 'fr' ? 'fr' : 'en')

export function useLocale() {
  return { locale }
}
