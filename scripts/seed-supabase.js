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
    date_fr: 'Vendredi 9 octobre - 21:00 Heure Française',
    date_en: 'Friday 9 october - 1900Z',
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

async function seedSetupItems() {
  // Schéma SQL à créer dans Supabase avant de lancer ce script :
  //
  // CREATE TABLE setup_items (
  //   id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  //   side          TEXT NOT NULL CHECK (side IN ('left', 'right')),
  //   display_order INTEGER NOT NULL DEFAULT 0,
  //   category_fr   TEXT NOT NULL DEFAULT '',
  //   category_en   TEXT NOT NULL DEFAULT '',
  //   name          TEXT NOT NULL DEFAULT '',
  //   specs         TEXT NOT NULL DEFAULT '',
  //   icon_svg      TEXT NOT NULL DEFAULT '',
  //   href          TEXT
  // );
  // ALTER TABLE setup_items ENABLE ROW LEVEL SECURITY;
  // CREATE POLICY "Public read"  ON setup_items FOR SELECT USING (true);
  // CREATE POLICY "Auth write"   ON setup_items FOR ALL    USING (auth.role() = 'authenticated');

  const svg = (path) =>
    `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`

  const { error } = await supabase.from('setup_items').upsert([
    {
      side: 'left', display_order: 0,
      category_fr: 'Processeur', category_en: 'Processor',
      name: 'AMD Ryzen 9 9950X', specs: '16 cœurs · 5.7 GHz boost',
      icon_svg: svg('<rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M9 7V3M12 7V3M15 7V3M9 21v-4M12 21v-4M15 21v-4M7 9H3M7 12H3M7 15H3M21 9h-4M21 12h-4M21 15h-4"/>'),
    },
    {
      side: 'left', display_order: 1,
      category_fr: 'Carte graphique', category_en: 'Graphics card',
      name: 'NVIDIA RTX 4080 Super', specs: '16 Go GDDR6X',
      icon_svg: svg('<rect x="2" y="8" width="20" height="10" rx="2"/><path d="M7 8V5M12 8V5M17 8V5"/><rect x="5" y="10.5" width="3.5" height="4" rx="0.5"/><rect x="10" y="10.5" width="3.5" height="4" rx="0.5"/>'),
    },
    {
      side: 'left', display_order: 2,
      category_fr: 'Mémoire vive', category_en: 'RAM',
      name: '64 Go DDR5', specs: '6 000 MHz · Kingston Fury',
      icon_svg: svg('<rect x="3" y="6" width="18" height="11" rx="2"/><path d="M8 6V4M12 6V4M16 6V4M8 17v2M16 17v2"/><line x1="8" y1="11" x2="8" y2="13"/><line x1="12" y1="11" x2="12" y2="13"/><line x1="16" y1="11" x2="16" y2="13"/>'),
    },
    {
      side: 'left', display_order: 3,
      category_fr: 'Stockage', category_en: 'Storage',
      name: 'Samsung 990 Pro 2 To', specs: 'NVMe PCIe 4.0',
      icon_svg: svg('<rect x="2" y="6" width="20" height="12" rx="3"/><line x1="6" y1="10" x2="10" y2="10"/><line x1="6" y1="13" x2="10" y2="13"/><circle cx="17" cy="12" r="2.5"/>'),
    },
    {
      side: 'right', display_order: 0,
      category_fr: 'Écran', category_en: 'Monitor',
      name: 'LG 27GR95QE 27"', specs: '1440p · 240 Hz · OLED',
      icon_svg: svg('<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>'),
    },
    {
      side: 'right', display_order: 1,
      category_fr: 'Joystick / HOTAS', category_en: 'Joystick / HOTAS',
      name: 'Thrustmaster TCA Capt. Pack', specs: 'Airbus Edition',
      icon_svg: svg('<path d="M12 3v5"/><circle cx="12" cy="4" r="1.5"/><path d="M9.5 8c0-1.4 1.1-2.5 2.5-2.5s2.5 1.1 2.5 2.5v3.5"/><rect x="6.5" y="11.5" width="11" height="8" rx="3"/><line x1="9.5" y1="16.5" x2="14.5" y2="16.5"/>'),
    },
    {
      side: 'right', display_order: 2,
      category_fr: 'Pédalier', category_en: 'Rudder pedals',
      name: 'Thrustmaster TFRP', specs: 'T.Flight Rudder Pedals',
      icon_svg: svg('<path d="M4 20h16"/><rect x="3" y="13" width="7" height="7" rx="2"/><rect x="14" y="13" width="7" height="7" rx="2"/><path d="M5.5 13V9.5L7.5 5M18.5 13V9.5L16.5 5"/>'),
    },
    {
      side: 'right', display_order: 3,
      category_fr: 'Casque audio', category_en: 'Headset',
      name: 'Sennheiser HD 599', specs: 'Open-back · 50 Ω',
      icon_svg: svg('<path d="M3 12a9 9 0 0 1 18 0"/><path d="M3 12v3a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3"/><path d="M21 12v3a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3"/>'),
    },
  ])
  if (error) throw error
  console.log('✓ setup_items')
}

await seedEvent()
await seedSetupItems()
await seedPartners()
await seedLegalNotice()
console.log('Seed terminé.')
