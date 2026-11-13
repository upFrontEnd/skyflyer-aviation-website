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
