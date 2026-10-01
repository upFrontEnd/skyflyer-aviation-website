// Script à exécuter UNE SEULE FOIS, à la main (`node scripts/seed-supabase.js`),
// juste après avoir créé les tables/policies Supabase (voir README, section
// "Espace admin"). Jamais exécuté en CI/CD, contrairement à
// fetch-contributions.js : il écrirait les mêmes données à chaque fois,
// écrasant d'éventuelles modifications faites depuis l'admin.
//
// Utilise la clé "service_role" (jamais VITE_*, donc jamais exposée au
// navigateur) car elle contourne les policies RLS — nécessaire ici pour
// écrire avant même qu'un compte admin existe. Ne JAMAIS utiliser cette clé
// ailleurs que dans un script Node exécuté localement.
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    'SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être définies dans l\'environnement (pas dans .env, voir README) avant de lancer ce script.'
  )
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async function uploadFile(localPath, destPath) {
  const buffer = readFileSync(join(__dirname, localPath))
  const { error } = await supabase.storage
    .from('site-uploads')
    .upload(destPath, buffer, { upsert: true, contentType: 'image/webp' })
  if (error) throw error
  return destPath
}

async function seedEvent() {
  const imagePath = await uploadFile('../src/assets/event.webp', 'event/event.webp')

  const { error } = await supabase.from('event').upsert({
    id: 1,
    title: 'VATSIM - Cross the Pond',
    description_fr:
      "Traversée de l'Atlantique au départ de l'Europe pour une arrivée aux USA ou aux Caraïbes avec un full staff au niveau des contrôleurs.",
    description_en: 'A transatlantic crossing departing from Europe and arriving in the USA or the Caribbean, with full ATC staffing.',
    scheduled_flight: 'Paris LFPG - Houston KIAH',
    aircraft: 'Toliss Airbus A-340-600',
    simulator: 'X-Plane',
    image_path: imagePath,
    image_width: 1100,
    image_height: 619
  })
  if (error) throw error
  console.log('✓ event')
}

async function seedPartners() {
  const instantGamingLogo = await uploadFile('../src/logo/box-orange-light.webp', 'partners/instant-gaming.webp')
  const navigraphLogo = await uploadFile('../src/logo/navigraph.webp', 'partners/navigraph.webp')

  const { error } = await supabase.from('partners').upsert([
    {
      name: 'Instant Gaming',
      href: 'https://www.instant-gaming.com/?igr=skyflyeraviation',
      logo_path: instantGamingLogo,
      logo_width: 400,
      logo_height: 367,
      display_order: 0
    },
    {
      // Corrige un bug repéré dans data/partners.js : cette entrée portait
      // le nom "Instant Gaming" en double alors qu'elle affiche le logo
      // Navigraph.
      name: 'Navigraph',
      href: 'https://navigraph.com/',
      logo_path: navigraphLogo,
      logo_width: 400,
      logo_height: 94,
      display_order: 1
    }
  ])
  if (error) throw error
  console.log('✓ partners')
}

async function seedLegalNotice() {
  const content_html = `
<h3>Éditeur du site</h3>
<p>Le site Skyflyer Aviation est un projet personnel, édité à titre non professionnel. Conformément à l'article 6-III-2 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique (LCEN), l'éditeur, personne physique agissant à titre non professionnel, a transmis ses coordonnées complètes à l'hébergeur du site et a exercé son droit à la confidentialité de ces données à l'égard des tiers.</p>
<p>Contact : via le formulaire de contact du site.</p>

<h3>Directeur de la publication</h3>
<p>Skyflyer Aviation.</p>

<h3>Hébergement</h3>
<p class="legal-notice__todo">À compléter dès que l'hébergeur du site sera choisi (nom, adresse et contact) — cette information est obligatoire et ne peut pas rester confidentielle.</p>

<h3>Propriété intellectuelle</h3>
<p>L'ensemble des contenus présents sur ce site (textes, photographies, captures d'écran, logo, mise en page) est la propriété de l'éditeur, sauf mention contraire, et protégé par le droit d'auteur. Toute reproduction ou réutilisation sans autorisation préalable est interdite — les captures d'écran de simulation affichées dans la galerie portent d'ailleurs un filigrane à cet effet.</p>
<p>Les logos et marques de tiers cités ou affichés sur ce site (Twitch, Discord, YouTube, Displate, Navigraph, Instant Gaming, Microsoft Flight Simulator, X-Plane, VATSIM, IVAO...) demeurent la propriété de leurs détenteurs respectifs et sont utilisés à titre de référence, sans lien d'affiliation officielle sauf mention contraire.</p>

<h3>Liens et contenus tiers</h3>
<p>Ce site fait appel à des services tiers pour certaines fonctionnalités : Twitch (lecteur vidéo et tchat en direct), Google reCAPTCHA (protection anti-spam du formulaire de contact), Web3Forms (envoi du formulaire de contact), ainsi que des liens vers Discord, YouTube, Displate, Behance, flightsim.to, X-Plane.org, VATSIM et IVAO. L'éditeur n'est pas responsable du contenu, des pratiques ou des conditions d'utilisation de ces services tiers, qui disposent de leurs propres politiques de confidentialité.</p>

<h3>Données personnelles</h3>
<p>Le formulaire de contact collecte votre nom, votre adresse e-mail et votre message, dans le seul but d'y répondre. Ces informations sont transmises via le service tiers Web3Forms et ne sont ni revendues ni utilisées à des fins commerciales. Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données, exerçable via ce même formulaire de contact.</p>

<h3>Gestion des cookies</h3>
<p>Ce site ne dépose aucun cookie ni traceur publicitaire ou de mesure d'audience de son propre fait, et n'utilise aucun stockage local pour suivre votre navigation.</p>
<p>Deux fonctionnalités, chargées uniquement lorsque vous choisissez explicitement de les utiliser, font appel à des services tiers qui déposent alors leurs propres cookies :</p>
<ul>
<li>Le lecteur et le tchat Twitch (section "Live") ne se chargent qu'après un clic volontaire sur la miniature — Twitch peut alors déposer ses propres cookies (authentification, mesure d'audience, publicité), avec son propre bandeau de gestion des cookies affiché à l'intérieur du lecteur. Tant que vous ne cliquez pas, aucun cookie Twitch n'est déposé.</li>
<li>Le contrôle anti-robot Google reCAPTCHA ne se charge qu'à l'ouverture du formulaire de contact, et dépose alors des cookies Google nécessaires à son fonctionnement.</li>
</ul>
<p>Vous pouvez à tout moment refuser ces cookies en n'activant pas ces deux fonctionnalités, ou en les bloquant via les réglages de votre navigateur.</p>
`.trim()

  const { error } = await supabase.from('legal_notice').upsert({ id: 1, content_html })
  if (error) throw error
  console.log('✓ legal_notice')
}

await seedEvent()
await seedPartners()
await seedLegalNotice()
console.log('Seed terminé.')
