<script setup>
import { useLocale } from '../composables/useLocale.js'
import { setupItems } from '../data/setup.js'

const { locale } = useLocale()
</script>

<template>
  <section class="setup" id="setup" aria-labelledby="setup-title">
    <div class="container">

      <h2 class="setup__title" id="setup-title">
        <span class="setup__wing setup__wing--left" aria-hidden="true"><i></i><i></i><i></i></span>
        Setup
        <span class="setup__wing setup__wing--right" aria-hidden="true"><i></i><i></i><i></i></span>
      </h2>

      <div class="setup__layout">

        <div class="setup__col">
          <article v-for="item in setupItems.left" :key="item.id" class="setup__card">
            <div class="setup__card-icon" aria-hidden="true" v-html="item.icon"></div>
            <div class="setup__card-body">
              <span class="setup__card-category">{{ item.category[locale] }}</span>
              <strong class="setup__card-name">{{ item.name }}</strong>
              <span class="setup__card-specs">{{ item.specs }}</span>
            </div>
          </article>
        </div>

        <div class="setup__center" aria-hidden="true">
          <div class="setup__glow"></div>
          <svg class="setup__pc" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 215">
            <!-- Monitor chassis -->
            <rect x="5" y="5" width="230" height="155" rx="10" fill="rgba(10,15,40,0.5)" stroke="rgba(88,101,242,0.65)" stroke-width="2.5"/>
            <!-- Screen -->
            <rect x="16" y="16" width="208" height="133" rx="5" fill="rgba(4,6,18,0.95)"/>
            <!-- Sky half -->
            <rect x="16" y="16" width="208" height="68" rx="5" fill="rgba(0,35,70,0.45)"/>
            <!-- Ground half -->
            <rect x="16" y="84" width="208" height="65" rx="0" fill="rgba(55,38,8,0.35)"/>
            <!-- Clip ground to screen bottom -->
            <rect x="16" y="144" width="208" height="5" rx="0" fill="rgba(4,6,18,0.95)"/>

            <!-- Speed tape left -->
            <rect x="19" y="22" width="20" height="106" rx="2" fill="rgba(0,0,15,0.55)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
            <rect x="19" y="71" width="20" height="18" rx="1" fill="rgba(88,101,242,0.35)" stroke="rgba(88,101,242,0.55)" stroke-width="1"/>
            <line x1="19" y1="38" x2="29" y2="38" stroke="rgba(255,255,255,0.25)" stroke-width="0.8"/>
            <line x1="19" y1="52" x2="29" y2="52" stroke="rgba(255,255,255,0.25)" stroke-width="0.8"/>
            <line x1="19" y1="66" x2="29" y2="66" stroke="rgba(255,255,255,0.25)" stroke-width="0.8"/>
            <line x1="19" y1="100" x2="29" y2="100" stroke="rgba(255,255,255,0.25)" stroke-width="0.8"/>
            <line x1="19" y1="114" x2="29" y2="114" stroke="rgba(255,255,255,0.25)" stroke-width="0.8"/>

            <!-- Altitude tape right -->
            <rect x="201" y="22" width="20" height="106" rx="2" fill="rgba(0,0,15,0.55)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
            <rect x="201" y="71" width="20" height="18" rx="1" fill="rgba(88,101,242,0.35)" stroke="rgba(88,101,242,0.55)" stroke-width="1"/>
            <line x1="211" y1="38" x2="221" y2="38" stroke="rgba(255,255,255,0.25)" stroke-width="0.8"/>
            <line x1="211" y1="52" x2="221" y2="52" stroke="rgba(255,255,255,0.25)" stroke-width="0.8"/>
            <line x1="211" y1="66" x2="221" y2="66" stroke="rgba(255,255,255,0.25)" stroke-width="0.8"/>
            <line x1="211" y1="100" x2="221" y2="100" stroke="rgba(255,255,255,0.25)" stroke-width="0.8"/>
            <line x1="211" y1="114" x2="221" y2="114" stroke="rgba(255,255,255,0.25)" stroke-width="0.8"/>

            <!-- Attitude indicator ring -->
            <circle cx="120" cy="80" r="46" fill="none" stroke="rgba(88,101,242,0.3)" stroke-width="1"/>
            <circle cx="120" cy="80" r="46" fill="none" stroke="rgba(88,101,242,0.12)" stroke-width="10"/>
            <!-- Bank angle arc -->
            <path d="M 88 44 A 46 46 0 0 1 152 44" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
            <!-- Pitch lines -->
            <line x1="95" y1="68" x2="105" y2="68" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
            <line x1="135" y1="68" x2="145" y2="68" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
            <line x1="98" y1="92" x2="108" y2="92" stroke="rgba(255,255,255,0.2)" stroke-width="0.8"/>
            <line x1="132" y1="92" x2="142" y2="92" stroke="rgba(255,255,255,0.2)" stroke-width="0.8"/>

            <!-- Horizon line -->
            <line x1="50" y1="80" x2="170" y2="80" stroke="rgba(245,124,32,0.45)" stroke-width="1"/>

            <!-- Aircraft reference (orange chevron) -->
            <polyline points="96,80 108,86 120,80 132,86 144,80" fill="none" stroke="#f57c20" stroke-width="2.2" stroke-linejoin="round"/>
            <line x1="120" y1="75" x2="120" y2="85" stroke="#f57c20" stroke-width="2"/>

            <!-- Heading tape bottom -->
            <rect x="62" y="134" width="116" height="10" rx="2" fill="rgba(0,0,15,0.55)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
            <rect x="114" y="134" width="12" height="10" rx="1" fill="rgba(88,101,242,0.35)"/>
            <line x1="80"  y1="134" x2="80"  y2="140" stroke="rgba(255,255,255,0.25)" stroke-width="0.8"/>
            <line x1="97"  y1="134" x2="97"  y2="140" stroke="rgba(255,255,255,0.25)" stroke-width="0.8"/>
            <line x1="143" y1="134" x2="143" y2="140" stroke="rgba(255,255,255,0.25)" stroke-width="0.8"/>
            <line x1="160" y1="134" x2="160" y2="140" stroke="rgba(255,255,255,0.25)" stroke-width="0.8"/>

            <!-- Monitor stand neck -->
            <rect x="108" y="160" width="24" height="22" rx="2" fill="rgba(20,25,60,0.7)" stroke="rgba(88,101,242,0.45)" stroke-width="2"/>
            <!-- Stand base -->
            <rect x="74" y="180" width="92" height="10" rx="5" fill="rgba(20,25,60,0.6)" stroke="rgba(88,101,242,0.4)" stroke-width="2"/>

            <!-- Keyboard body -->
            <rect x="56" y="195" width="128" height="16" rx="4" fill="rgba(12,16,40,0.75)" stroke="rgba(88,101,242,0.3)" stroke-width="1.5"/>
            <!-- Key row 1 -->
            <rect x="62"  y="198" width="7" height="5" rx="1" fill="rgba(88,101,242,0.22)"/>
            <rect x="72"  y="198" width="7" height="5" rx="1" fill="rgba(88,101,242,0.22)"/>
            <rect x="82"  y="198" width="7" height="5" rx="1" fill="rgba(88,101,242,0.22)"/>
            <rect x="92"  y="198" width="7" height="5" rx="1" fill="rgba(88,101,242,0.22)"/>
            <rect x="102" y="198" width="7" height="5" rx="1" fill="rgba(88,101,242,0.22)"/>
            <rect x="112" y="198" width="7" height="5" rx="1" fill="rgba(88,101,242,0.22)"/>
            <rect x="122" y="198" width="7" height="5" rx="1" fill="rgba(88,101,242,0.22)"/>
            <rect x="132" y="198" width="7" height="5" rx="1" fill="rgba(88,101,242,0.22)"/>
            <rect x="142" y="198" width="7" height="5" rx="1" fill="rgba(88,101,242,0.22)"/>
            <rect x="152" y="198" width="7" height="5" rx="1" fill="rgba(88,101,242,0.22)"/>
            <!-- Space bar -->
            <rect x="88" y="205" width="64" height="4" rx="2" fill="rgba(88,101,242,0.18)"/>
          </svg>
        </div>

        <div class="setup__col">
          <article v-for="item in setupItems.right" :key="item.id" class="setup__card">
            <div class="setup__card-icon" aria-hidden="true" v-html="item.icon"></div>
            <div class="setup__card-body">
              <span class="setup__card-category">{{ item.category[locale] }}</span>
              <strong class="setup__card-name">{{ item.name }}</strong>
              <span class="setup__card-specs">{{ item.specs }}</span>
            </div>
          </article>
        </div>

      </div>
    </div>
  </section>
</template>
