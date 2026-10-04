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

// Seule chaîne suivie par tout le site : vivait avant en double (une copie
// dans LiveStream.vue pour construire les URLs d'iframe, une autre ici
// implicitement via le paramètre channelLogin) — exportée d'ici, c'est
// désormais la seule source de vérité, pour ne plus jamais avoir à la
// changer à deux endroits.
export const TWITCH_CHANNEL = 'GrauAdler'

// Twitch régénère cette image toutes les quelques minutes mais garde la même
// URL par chaîne — sans un paramètre qui change, le navigateur réafficherait
// la version mise en cache au lieu d'aller chercher la nouvelle capture à
// chaque sondage (voir POLL_INTERVAL_MS plus bas).
function withCacheBust(url) {
  return `${url}?cb=${Date.now()}`
}

const POLL_INTERVAL_MS = 60_000

// État PARTAGÉ : ces refs vivent au niveau du module (en dehors de la
// fonction useTwitchStream exportée plus bas), donc créées UNE SEULE FOIS au
// premier import, peu importe combien de composants appellent
// useTwitchStream() ensuite. Même principe que useContactModal.js /
// useLocale.js. Sans ça, Header.vue (pour la pastille rouge à côté du menu
// "Live") et LiveStream.vue interrogeraient chacun l'API Twitch de leur
// côté : deux requêtes réseau au lieu d'une, et un risque que les deux
// affichent un état légèrement désynchronisé pendant une fraction de
// seconde.
const stream = ref(null)
const loading = ref(true)
const error = ref(null)
let hasStarted = false

// silent: true pour les sondages périodiques en arrière-plan — on ne veut
// pas que "Chargement du live…" clignote toutes les 60s alors que le
// contenu est déjà affiché, ni qu'un aléa réseau ponctuel efface un stream
// déjà détecté comme en ligne.
async function fetchStream({ silent = false } = {}) {
  if (!silent) {
    loading.value = true
    error.value = null
  }

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
      `https://api.twitch.tv/helix/streams?user_login=${encodeURIComponent(TWITCH_CHANNEL)}`,
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

    // thumbnail_url est une vraie capture du flux en direct (pas la
    // jaquette du jeu), régénérée régulièrement par Twitch — on s'en sert
    // pour que la façade cliquable (voir LiveStream.vue) ait l'air
    // "vivante" sans charger le vrai lecteur.
    const thumbnailUrl = liveData.thumbnail_url
      ? withCacheBust(liveData.thumbnail_url.replace('{width}', '640').replace('{height}', '360'))
      : null

    stream.value = {
      title: liveData.title,
      gameName: liveData.game_name,
      boxArtUrl,
      thumbnailUrl
    }
  } catch (e) {
    error.value = e.message
    if (!silent) stream.value = null
  } finally {
    if (!silent) loading.value = false
  }
}

export function useTwitchStream() {
  // onMounted : hook de cycle de vie Vue, exécuté une fois le composant
  // inséré dans le DOM. hasStarted protège contre le double démarrage : si
  // Header.vue ET LiveStream.vue appellent tous les deux useTwitchStream(),
  // seul le premier à se monter lance réellement fetchStream() et le
  // setInterval — le second ne fait que lire le même état déjà en route.
  onMounted(() => {
    if (hasStarted) return
    hasStarted = true
    fetchStream()
    setInterval(() => fetchStream({ silent: true }), POLL_INTERVAL_MS)
  })

  return { stream, loading, error }
}
