<script setup>
import { watch, onUnmounted } from 'vue'
import { useLegalModal } from '../composables/useLegalModal.js'

const { isOpen, close } = useLegalModal()

// Même pattern que Contact.vue/Lightbox.vue pour la fermeture au clavier.
function onKeydown(e) {
  if (e.key === 'Escape') close()
}

watch(isOpen, (open) => {
  if (open) window.addEventListener('keydown', onKeydown)
  else window.removeEventListener('keydown', onKeydown)
})

onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <Transition name="contact-modal-fade">
      <div v-if="isOpen" class="contact-modal" role="dialog" aria-modal="true" aria-labelledby="legal-title" @click.self="close">
        <div class="contact-modal__panel legal-notice">
          <button class="contact-modal__close" type="button" aria-label="Fermer" @click="close">&times;</button>

          <h2 class="contact__title" id="legal-title">Mentions légales</h2>

          <section class="legal-notice__section">
            <h3>Éditeur du site</h3>
            <p>
              Le site Skyflyer Aviation est un projet personnel, édité à titre non professionnel.
              Conformément à l'article 6-III-2 de la loi n° 2004-575 du 21 juin 2004 pour la confiance
              dans l'économie numérique (LCEN), l'éditeur, personne physique agissant à titre non
              professionnel, a transmis ses coordonnées complètes à l'hébergeur du site et a exercé son
              droit à la confidentialité de ces données à l'égard des tiers.
            </p>
            <p>Contact : via le formulaire de contact du site.</p>
          </section>

          <section class="legal-notice__section">
            <h3>Directeur de la publication</h3>
            <p>Skyflyer Aviation.</p>
          </section>

          <section class="legal-notice__section">
            <h3>Hébergement</h3>
            <p class="legal-notice__todo">
              À compléter dès que l'hébergeur du site sera choisi (nom, adresse et contact) — cette
              information est obligatoire et ne peut pas rester confidentielle.
            </p>
          </section>

          <section class="legal-notice__section">
            <h3>Propriété intellectuelle</h3>
            <p>
              L'ensemble des contenus présents sur ce site (textes, photographies, captures d'écran,
              logo, mise en page) est la propriété de l'éditeur, sauf mention contraire, et protégé par
              le droit d'auteur. Toute reproduction ou réutilisation sans autorisation préalable est
              interdite — les captures d'écran de simulation affichées dans la galerie portent
              d'ailleurs un filigrane à cet effet.
            </p>
            <p>
              Les logos et marques de tiers cités ou affichés sur ce site (Twitch, Discord, YouTube,
              Displate, Navigraph, Instant Gaming, Microsoft Flight Simulator, X-Plane, VATSIM, IVAO...)
              demeurent la propriété de leurs détenteurs respectifs et sont utilisés à titre de
              référence, sans lien d'affiliation officielle sauf mention contraire.
            </p>
          </section>

          <section class="legal-notice__section">
            <h3>Liens et contenus tiers</h3>
            <p>
              Ce site fait appel à des services tiers pour certaines fonctionnalités : Twitch (lecteur
              vidéo et tchat en direct), Google reCAPTCHA (protection anti-spam du formulaire de
              contact), Web3Forms (envoi du formulaire de contact), ainsi que des liens vers Discord,
              YouTube, Displate, Behance, flightsim.to, X-Plane.org, VATSIM et IVAO. L'éditeur n'est pas
              responsable du contenu, des pratiques ou des conditions d'utilisation de ces services
              tiers, qui disposent de leurs propres politiques de confidentialité.
            </p>
          </section>

          <section class="legal-notice__section">
            <h3>Données personnelles</h3>
            <p>
              Le formulaire de contact collecte votre nom, votre adresse e-mail et votre message, dans
              le seul but d'y répondre. Ces informations sont transmises via le service tiers Web3Forms
              et ne sont ni revendues ni utilisées à des fins commerciales. Conformément au RGPD, vous
              disposez d'un droit d'accès, de rectification et de suppression de vos données, exerçable
              via ce même formulaire de contact.
            </p>
          </section>

          <section class="legal-notice__section">
            <h3>Gestion des cookies</h3>
            <p>
              Ce site ne dépose aucun cookie ni traceur publicitaire ou de mesure d'audience de son
              propre fait, et n'utilise aucun stockage local pour suivre votre navigation.
            </p>
            <p>
              Deux fonctionnalités, chargées uniquement lorsque vous choisissez explicitement de les
              utiliser, font appel à des services tiers qui déposent alors leurs propres cookies :
            </p>
            <ul>
              <li>
                Le lecteur et le tchat Twitch (section "Live") ne se chargent qu'après un clic
                volontaire sur la miniature — Twitch peut alors déposer ses propres cookies
                (authentification, mesure d'audience, publicité), avec son propre bandeau de gestion
                des cookies affiché à l'intérieur du lecteur. Tant que vous ne cliquez pas, aucun cookie
                Twitch n'est déposé.
              </li>
              <li>
                Le contrôle anti-robot Google reCAPTCHA ne se charge qu'à l'ouverture du formulaire de
                contact, et dépose alors des cookies Google nécessaires à son fonctionnement.
              </li>
            </ul>
            <p>
              Vous pouvez à tout moment refuser ces cookies en n'activant pas ces deux fonctionnalités,
              ou en les bloquant via les réglages de votre navigateur.
            </p>
          </section>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
