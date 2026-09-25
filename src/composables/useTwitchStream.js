import { ref, onMounted } from 'vue'

// import.meta.env.VITE_* : la façon dont Vite expose des variables
// d'environnement (définies dans .env, jamais commité) au code client. Tout
// ce qui est préfixé VITE_ finit dans le bundle JS final, donc VISIBLE par
// n'importe qui inspectant le site déployé — jamais un vrai secret ici. Le
// Client ID est public par nature ; l'access token, lui, est volontairement
// un "App Access Token" à portée limitée (lecture de données publiques,
// expire de lui-même après ~60 jours) plutôt que le Client Secret de
// l'application, qui ne doit JAMAIS être exposé côté client (voir README).
const TWITCH_CLIENT_ID = import.meta.env.VITE_TWITCH_CLIENT_ID
const TWITCH_ACCESS_TOKEN = import.meta.env.VITE_TWITCH_ACCESS_TOKEN

// Composable dédié à UNE chaîne : contrairement à useTheme.js (un seul état
// partagé par toute l'app), ici chaque composant appelant useTwitchStream()
// avec un channelLogin obtient son PROPRE état (stream/loading/error) — la
// ref est créée à l'intérieur de la fonction, pas au niveau du module.
export function useTwitchStream(channelLogin) {
  // null tant qu'on ne sait pas / que la chaîne est hors ligne, sinon
  // { title, gameName, boxArtUrl }.
  const stream = ref(null)
  const loading = ref(true)
  const error = ref(null)

  async function fetchStream() {
    loading.value = true
    error.value = null

    try {
      if (!TWITCH_CLIENT_ID || !TWITCH_ACCESS_TOKEN) {
        throw new Error('identifiants Twitch manquants dans .env')
      }

      const headers = {
        'Client-Id': TWITCH_CLIENT_ID,
        Authorization: `Bearer ${TWITCH_ACCESS_TOKEN}`
      }

      // Get Streams : renvoie un tableau vide si la chaîne n'est pas en
      // direct (ce n'est pas une erreur HTTP, juste `data: []`).
      const streamsRes = await fetch(
        `https://api.twitch.tv/helix/streams?user_login=${encodeURIComponent(channelLogin)}`,
        { headers }
      )
      if (!streamsRes.ok) {
        throw new Error(`API Twitch (streams) : ${streamsRes.status}`)
      }
      const { data: streams } = await streamsRes.json()
      const liveData = streams[0]

      if (!liveData) {
        stream.value = null
        return
      }

      // La jaquette du jeu n'est pas dans la réponse "streams" : il faut un
      // second appel (Get Games) à partir de game_id pour obtenir
      // box_art_url, qui contient les gabarits littéraux {width}/{height} à
      // remplacer nous-mêmes par les dimensions voulues.
      let boxArtUrl = null
      if (liveData.game_id) {
        const gamesRes = await fetch(`https://api.twitch.tv/helix/games?id=${liveData.game_id}`, { headers })
        if (gamesRes.ok) {
          const { data: games } = await gamesRes.json()
          const game = games[0]
          if (game) {
            boxArtUrl = game.box_art_url.replace('{width}', '188').replace('{height}', '250')
          }
        }
      }

      stream.value = {
        title: liveData.title,
        gameName: liveData.game_name,
        boxArtUrl
      }
    } catch (e) {
      error.value = e.message
      stream.value = null
    } finally {
      loading.value = false
    }
  }

  // onMounted : hook de cycle de vie Vue, exécuté une fois le composant
  // inséré dans le DOM. On y déclenche l'appel réseau plutôt qu'au niveau
  // racine du composable, pour ne pas lancer de fetch avant que le
  // composant qui l'utilise soit réellement monté.
  onMounted(fetchStream)

  return { stream, loading, error }
}
