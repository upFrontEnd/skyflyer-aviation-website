import { markRaw } from 'vue'
import AdminOverview from './components/AdminOverview.vue'
import EventForm from './components/EventForm.vue'
import SiteSettingsForm from './components/SiteSettingsForm.vue'
import SetupManager from './components/SetupManager.vue'
import PartnersManager from './components/PartnersManager.vue'
import LegalNoticeForm from './components/LegalNoticeForm.vue'
import DiscordAnnounceForm from './components/DiscordAnnounceForm.vue'

// Une entrée = une page de l'admin. La clé sert aussi d'ancre dans l'URL
// (admin.html#discord) pour qu'un rechargement garde la page ouverte.
// `tone` donne la couleur de l'icône dans la barre latérale.
export const ADMIN_PAGES = [
  {
    key: 'overview',
    group: null,
    label: 'Accueil',
    icon: 'home',
    component: markRaw(AdminOverview)
  },
  {
    key: 'event',
    group: 'Contenu du site',
    label: 'Événement',
    icon: 'calendar',
    tone: 'orange',
    description: 'L\'encart « Prochain événement » affiché sur la page d\'accueil.',
    component: markRaw(EventForm)
  },
  {
    key: 'channels',
    group: 'Contenu du site',
    label: 'Twitch et YouTube',
    icon: 'tv',
    tone: 'violet',
    description: 'La chaîne Twitch suivie pour le live et la dernière vidéo YouTube mise en avant.',
    component: markRaw(SiteSettingsForm)
  },
  {
    key: 'setup',
    group: 'Contenu du site',
    label: 'Setup',
    icon: 'monitor',
    tone: 'amber',
    description: 'Le matériel présenté dans la section Setup, réparti en deux colonnes.',
    component: markRaw(SetupManager)
  },
  {
    key: 'partners',
    group: 'Contenu du site',
    label: 'Partenaires',
    icon: 'users',
    tone: 'green',
    description: 'Les logos et liens des partenaires affichés sur le site.',
    component: markRaw(PartnersManager)
  },
  {
    key: 'legal',
    group: 'Contenu du site',
    label: 'Mentions légales',
    icon: 'file',
    tone: 'blue',
    description: 'Le contenu de la fenêtre « Mentions légales », en HTML.',
    component: markRaw(LegalNoticeForm)
  },
  {
    key: 'discord',
    group: 'Communication',
    label: 'Annonce Discord',
    icon: 'megaphone',
    tone: 'blurple',
    description: 'Prépare et publie une annonce sur le salon Discord, avec photo si besoin.',
    component: markRaw(DiscordAnnounceForm)
  }
]

// Admins des outils de stream, hébergés dans d'autres projets. En dev
// (bun run dev), on pointe sur leurs serveurs Vite locaux, sinon sur
// GitHub Pages. Les ports sont ceux fixés dans leurs vite.config.js
// (stream-checklist : 5190, stream-command : 5183). Les onglets du
// dashboard stream-command s'ouvrent via l'ancre (#vol, #sons, #annonces).
const CHECKLIST_URL = import.meta.env.DEV
  ? 'http://localhost:5190/admin.html'
  : 'https://upfrontend.github.io/stream-inflight-checklist/admin.html'

const COMMAND_URL = import.meta.env.DEV
  ? 'http://localhost:5183/'
  : 'https://upfrontend.github.io/stream-inflight-command/'

export const EXTERNAL_TOOLS = [
  { key: 'checklists', label: 'Checklists', icon: 'checklist', tone: 'teal', href: CHECKLIST_URL },
  { key: 'vol', label: 'Commandes de vol', icon: 'plane', tone: 'sky', href: `${COMMAND_URL}#vol` },
  { key: 'sons', label: 'Sons', icon: 'volume', tone: 'pink', href: `${COMMAND_URL}#sons` },
  { key: 'annonces', label: 'Annonces', icon: 'message', tone: 'lime', href: `${COMMAND_URL}#annonces` }
]
