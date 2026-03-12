<template>
  <div class="travel-page">
    <section class="art-hero">
      <div class="section-container">
        <h1 class="page-title">OC Travel Guide</h1>
        <p class="page-subtitle">Courtney's curated spots along the Orange County coast. Hover to explore, click for details.</p>
      </div>
    </section>

    <section class="section-container map-section">
      <div class="map-wrapper">
        <!-- Stylized OC coast SVG -->
        <svg class="oc-map" viewBox="0 0 800 900" xmlns="http://www.w3.org/2000/svg">
          <!-- Water background -->
          <rect width="800" height="900" fill="#E8EEFF" rx="24"/>

          <!-- Ocean -->
          <path d="M0,200 Q200,180 350,300 Q450,380 500,500 Q530,580 480,700 Q440,800 400,900 L0,900 Z"
                fill="#CCCCFF" opacity="0.35"/>
          <path d="M0,240 Q180,220 320,340 Q420,420 460,540 Q490,620 440,740 Q400,840 360,900 L0,900 Z"
                fill="#B8C8FF" opacity="0.25"/>

          <!-- Coastline -->
          <path d="M280,100 Q300,180 360,280 Q400,350 430,430 Q460,520 450,600 Q440,680 410,760 Q390,820 370,900"
                fill="none" stroke="#9999DD" stroke-width="2.5" stroke-dasharray="8,6" opacity="0.6"/>

          <!-- Land mass hint -->
          <path d="M280,100 Q300,180 360,280 Q400,350 430,430 Q460,520 450,600 Q440,680 410,760 Q390,820 370,900 L800,900 L800,0 L280,0 Z"
                fill="#F5F0E8" opacity="0.5"/>

          <!-- Road lines -->
          <path d="M500,80 L500,860" stroke="#E0D8C8" stroke-width="3" opacity="0.5"/>
          <path d="M580,80 L580,860" stroke="#E0D8C8" stroke-width="1.5" opacity="0.3"/>

          <!-- City labels -->
          <text x="540" y="150" class="map-city-label">Crystal Cove</text>
          <text x="540" y="280" class="map-city-label">Laguna Beach</text>
          <text x="520" y="470" class="map-city-label">Dana Point</text>
          <text x="520" y="680" class="map-city-label">Capistrano Beach</text>
          <text x="540" y="800" class="map-city-label">San Juan Capistrano</text>

          <!-- Location pins -->
          <g v-for="(loc, i) in locations" :key="loc.name"
             :transform="`translate(${loc.x}, ${loc.y})`"
             class="map-pin-group"
             @mouseenter="hoveredPin = i"
             @mouseleave="hoveredPin = null"
             @click="selectedPin = selectedPin === i ? null : i"
             style="cursor:pointer;">
            <!-- Pin shadow -->
            <ellipse cx="0" cy="4" rx="8" ry="3" fill="rgba(0,0,0,0.1)"/>
            <!-- Pin body -->
            <path d="M0,-28 C-11,-28 -16,-20 -16,-14 C-16,-4 0,6 0,6 C0,6 16,-4 16,-14 C16,-20 11,-28 0,-28 Z"
                  :fill="hoveredPin === i || selectedPin === i ? '#9999DD' : '#CCCCFF'"
                  stroke="#fff" stroke-width="2"
                  class="pin-shape"/>
            <!-- Pin dot -->
            <circle cx="0" cy="-16" r="4" fill="white" opacity="0.9"/>
          </g>
        </svg>

        <!-- Popup cards -->
        <transition name="popup-fade">
          <div v-if="activeLocation" class="map-popup organic-card"
               :style="popupStyle">
            <button class="popup-close" @click="selectedPin = null">×</button>
            <span class="popup-area">{{ activeLocation.area }}</span>
            <h3 class="popup-name">{{ activeLocation.name }}</h3>
            <p class="popup-summary">{{ activeLocation.summary }}</p>
          </div>
        </transition>
      </div>
    </section>

    <!-- Location list for mobile -->
    <section class="section-container location-list">
      <h2 class="section-title" style="margin-bottom: 24px;">All Spots</h2>
      <div class="loc-cards">
        <div v-for="loc in locations" :key="loc.name" class="loc-card organic-card">
          <span class="loc-area">{{ loc.area }}</span>
          <h3 class="loc-name">{{ loc.name }}</h3>
          <p class="loc-summary">{{ loc.summary }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const hoveredPin = ref(null)
const selectedPin = ref(null)

const locations = [
  { name: 'Bear Flag Fish Co', area: 'Crystal Cove', x: 420, y: 140, summary: 'Amazing Poke and Fish Tacos, great ocean view.' },
  { name: 'Sawdust Festival', area: 'Laguna Beach', x: 400, y: 270, summary: 'Local tradition of artists. You have to see the glass blowing and hang out for some music or drinks' },
  { name: 'Strands Beach', area: 'Dana Point', x: 430, y: 440, summary: 'Gorgeous secluded walk to a little basketball court and Youngs Beach Shack.' },
  { name: 'Farmers Market', area: 'Dana Point', x: 470, y: 490, summary: 'Soaps, honeys, veggies and cuties.' },
  { name: "Bruster's Ice Cream", area: 'Dana Point', x: 490, y: 530, summary: 'Best spot in town.' },
  { name: 'Capistrano Beach', area: 'Capistrano Beach', x: 440, y: 670, summary: 'Lovely.' },
  { name: "Trevor's at the Tracks", area: 'San Juan Capistrano', x: 500, y: 780, summary: 'Live music, food and drinks.' },
  { name: 'The Ecology Center', area: 'San Juan Capistrano', x: 540, y: 830, summary: 'Local farming, yoga, sound baths, permaculture classes and strawberry picking' },
  { name: 'Victoria Beach Sand Castle', area: 'Laguna Beach', x: 350, y: 260, summary: 'Photoesque famous.' },
]

const activeIndex = computed(() => selectedPin.value ?? hoveredPin.value)
const activeLocation = computed(() => activeIndex.value !== null ? locations[activeIndex.value] : null)

const popupStyle = computed(() => {
  if (activeIndex.value === null) return {}
  const loc = locations[activeIndex.value]
  // Position popup to the right of pin, clamped
  const left = Math.min(loc.x / 800 * 100 + 5, 55)
  const top = Math.max(loc.y / 900 * 100 - 5, 5)
  return {
    left: `${left}%`,
    top: `${top}%`,
  }
})
</script>

<style scoped>
.art-hero {
  padding: 80px 0 40px;
}

.page-title {
  font-family: var(--font-display);
  font-weight: 300;
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  color: var(--charcoal);
  letter-spacing: -0.02em;
}

.page-subtitle {
  font-size: 1rem;
  color: var(--driftwood-dark);
  margin-top: 8px;
  max-width: 520px;
}

/* MAP */
.map-section {
  margin-top: 20px;
}

.map-wrapper {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
}

.oc-map {
  width: 100%;
  height: auto;
  border-radius: 24px;
  box-shadow: 0 8px 40px rgba(153, 153, 221, 0.15);
}

.map-city-label {
  font-family: var(--font-body);
  font-size: 13px;
  fill: var(--driftwood);
  letter-spacing: 0.06em;
  font-weight: 400;
}

.pin-shape {
  transition: fill 0.3s, transform 0.3s;
  transform-origin: center bottom;
}

.map-pin-group:hover .pin-shape {
  transform: scale(1.15);
}

/* Popup */
.map-popup {
  position: absolute;
  width: 260px;
  padding: 24px;
  z-index: 10;
  pointer-events: auto;
}

.popup-close {
  position: absolute;
  top: 12px;
  right: 16px;
  font-size: 1.3rem;
  color: var(--driftwood);
  opacity: 0.6;
  transition: opacity 0.3s;
}
.popup-close:hover { opacity: 1; }

.popup-area {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--periwinkle-deep);
  font-weight: 500;
}

.popup-name {
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 400;
  margin: 6px 0 8px;
}

.popup-summary {
  font-size: 0.85rem;
  color: var(--driftwood-dark);
  line-height: 1.6;
}

.popup-fade-enter-active,
.popup-fade-leave-active {
  transition: opacity 0.25s, transform 0.25s var(--ease-out-expo);
}
.popup-fade-enter-from,
.popup-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

/* Location list (supplementary / mobile) */
.location-list {
  margin-top: var(--section-gap);
}

.loc-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.loc-card {
  padding: 24px;
}

.loc-area {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--periwinkle-deep);
  font-weight: 500;
}

.loc-name {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 400;
  margin: 6px 0 8px;
}

.loc-summary {
  font-size: 0.85rem;
  color: var(--driftwood-dark);
  line-height: 1.5;
}
</style>
