import { ref, watchEffect } from 'vue'

// isDark est créée ICI, au niveau du module (pas à l'intérieur de la
// fonction useTheme ci-dessous). Un module JS n'est exécuté qu'une seule
// fois puis mis en cache par le navigateur/bundler : peu importe le nombre
// de composants qui font `import { useTheme } from '.../useTheme.js'`, ils
// reçoivent tous la MÊME ref, donc le même état partagé. C'est ce qui rend
// un composable capable de partager de la réactivité entre plusieurs
// composants, sans store (Pinia) ni provide/inject — une simple fonction
// exportée suffit tant que l'état qu'elle expose vit hors de la fonction.
//
// Valeur initiale : priorité au choix déjà enregistré par l'utilisateur
// (localStorage), sinon on retombe sur la préférence système du navigateur
// (prefers-color-scheme).
const storedTheme = localStorage.getItem('theme')
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
const isDark = ref(storedTheme ? storedTheme === 'dark' : prefersDark)

// watchEffect() s'exécute immédiatement (applique le thème initial, avant
// le premier rendu, donc pas de flash du mauvais thème), puis se ré-exécute
// à chaque changement de isDark.value. Vit ici, au niveau du module, pour
// ne s'exécuter qu'une seule fois au total (pas une fois par composant
// utilisateur de useTheme()).
watchEffect(() => {
  document.documentElement.dataset.theme = isDark.value ? 'dark' : 'light'
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
})

// Convention Vue : un composable est une fonction qui commence par "use".
// Ici elle ne fait que redonner accès à la ref partagée ci-dessus — dans un
// composable plus riche, ce serait aussi l'endroit pour dériver des valeurs
// (computed) ou exposer des fonctions (ex. toggleTheme()).
export function useTheme() {
  return { isDark }
}
