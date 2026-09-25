<!--
  Une SFC (Single File Component) Vue peut n'avoir qu'un <template>, sans
  <script setup> du tout : c'est valable dès qu'il n'y a ni donnée, ni état,
  ni logique JS à exécuter — uniquement du HTML statique. Pas besoin de
  "faire semblant" d'avoir un script vide.
-->
<template>
  <section id="event" class="event" aria-labelledby="event-title">
    <div class="container">
      <div class="event__panel">
        <div class="event__glow" aria-hidden="true"></div>
        <span class="event__kicker">Prochain événement</span>
        <div class="event__body">
          <div class="event__main">
            <h2 class="event__title" id="event-title">VATSIM - Cross the Pond</h2>
            <p class="event__description">
              Traversée de l'Atlantique au départ de l'Europe pour une arrivée aux USA ou aux
              Caraïbes avec un full staff au niveau des contrôleurs.
            </p>

            <dl class="event__details">
              <div class="event__detail">
                <dt>Vol programmé</dt>
                <dd>Paris LFPG - Houston KIAH</dd>
              </div>
              <div class="event__detail">
                <dt>Avion</dt>
                <dd>Airbus A-340-600 de Toliss</dd>
              </div>
              <div class="event__detail">
                <dt>Simulateur</dt>
                <dd>X-Plane</dd>
              </div>
            </dl>
          </div>
          <div class="event__visual" aria-hidden="true">
            <span class="event__visual-text">CROSS<br />THE POND</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
