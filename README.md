# Skyflyer Aviation

Site vitrine de la chaine Twitch/Youtube Skyflyer Aviation 

## Preview

![Aperçu de la page d'accueil](docs/preview.jpg)

## Stack

- [Vue 3](https://vuejs.org/) (`<script setup>`, JavaScript uniquement, pas de TypeScript)
- [Vite](https://vitejs.dev/)
- SCSS
- [Bun](https://bun.sh/) comme gestionnaire de paquets

## Démarrage

```bash
bun install
bun run dev
```

L'application est servie sur [http://localhost:5173](http://localhost:5173).

## Scripts

| Commande         | Description                              |
| ---------------- | ----------------------------------------- |
| `bun run dev`     | Lance le serveur de développement Vite   |
| `bun run build`   | Build de production dans `dist/`         |
| `bun run preview` | Sert le build de production localement   |

## Intégration Twitch

La section "Live en cours" (`src/components/LiveStream.vue`) affiche le vrai lecteur Twitch, plus le jeu joué et le titre du live via l'API Twitch (Helix). Ça nécessite deux identifiants dans un fichier `.env` (jamais commité — copier `.env.example`) :

```bash
cp .env.example .env
```

1. Créer une application sur [dev.twitch.tv/console/apps](https://dev.twitch.tv/console/apps) (catégorie "Website Integration", n'importe quelle OAuth Redirect URL, ex. `http://localhost:5173`).
2. Récupérer le **Client ID** et le **Client Secret** de cette application.
3. Générer un **App Access Token** (une seule fois, en local, jamais depuis le navigateur) :
   ```bash
   curl -X POST 'https://id.twitch.tv/oauth2/token' \
     -d 'client_id=TON_CLIENT_ID' \
     -d 'client_secret=TON_CLIENT_SECRET' \
     -d 'grant_type=client_credentials'
   ```
   Renseigner le `client_id` et l'`access_token` de la réponse dans `.env` (`VITE_TWITCH_CLIENT_ID` / `VITE_TWITCH_ACCESS_TOKEN`).

⚠️ **Le Client Secret ne doit jamais aller dans `.env` ni dans le code** : seul l'access token généré ci-dessus y va. Ce token expire au bout d'environ 60 jours et devra être régénéré manuellement (pas de backend ici pour l'automatiser) — il sera aussi visible dans le bundle JS une fois le site déployé, car c'est un site 100% statique. C'est un compromis assumé : le token ne permet que de lire des données publiques (streams/jeux en cours), rien de sensible.

Sans `.env` renseigné, le lecteur Twitch fonctionne quand même (il n'a besoin d'aucune clé), seuls le jeu et le titre du live affichent un message d'indisponibilité.

## Structure

```
src/
  App.vue              # composant racine, assemble les sections de la page
  main.js              # point d'entrée, monte l'app Vue
  components/          # une SFC .vue par section (Header, Gallery, NewsList, ...)
  data/                 # données statiques (navigation, actus, partenaires, réseaux sociaux)
  styles/               # SCSS, un partiel par composant
  assets/               # images importées par les composants (logo, visuels)
  screenshots/          # captures d'écran affichées dans la galerie
public/                 # favicons et fichiers statiques servis tels quels
```
