<template>
  <div class="art-page">
    <section class="art-hero">
      <div class="section-container">
        <h1 class="page-title">Art</h1>
        <p class="page-subtitle">Ceramics, mixed media, and things that came from the kiln a little different than expected.</p>
      </div>
    </section>

    <!-- Controls -->
    <div class="section-container art-controls">
      <label class="columns-control">
        <span>Grid density</span>
        <input type="range" :min="2" :max="5" v-model.number="columns" />
        <span class="col-count">{{ columns }}</span>
      </label>
      <div class="view-toggle">
        <button :class="{ active: viewMode === 'grid' }" @click="viewMode = 'grid'">Grid</button>
        <button :class="{ active: viewMode === 'carousel' }" @click="viewMode = 'carousel'">Carousel</button>
      </div>
    </div>

    <!-- GRID VIEW -->
    <section v-if="viewMode === 'grid'" class="section-container">
      <div class="mosaic-grid" :style="{ '--cols': columns }">
        <div
          v-for="(work, i) in artworks"
          :key="work.id"
          class="mosaic-item"
          :class="{ 'mosaic-tall': work.tall }"
          @click="openLightbox(i)"
        >
          <div class="mosaic-img" :style="{ background: work.gradient }">
            <span class="mosaic-placeholder-icon">{{ work.icon }}</span>
            <img :src="work.img" />
          </div>
          <div class="mosaic-overlay">
            <h3 class="mosaic-title">{{ work.title }}</h3>
            <p class="mosaic-meta">{{ work.year }} · {{ work.medium }}</p>
            <p class="mosaic-detail">{{ work.details }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CAROUSEL VIEW -->
    <section v-else class="carousel-section" ref="carouselRef" @wheel.passive="onCarouselWheel">
      <div class="carousel-track" :style="{ transform: `translateY(${carouselOffset}px)` }">
        <div
          v-for="(work, i) in artworks"
          :key="work.id"
          class="carousel-slide"
          @click="openLightbox(i)"
        >
          <div class="carousel-img" :style="{ background: work.gradient }">
            <span class="carousel-placeholder-icon">{{ work.icon }}</span>
          </div>
          <div class="carousel-info">
            <h3>{{ work.title }}</h3>
            <p>{{ work.year }} · {{ work.medium }}</p>
          </div>
        </div>
      </div>
      <div class="carousel-nav">
        <button @click="carouselPrev" class="carousel-btn">↑</button>
        <span class="carousel-counter">{{ carouselIndex + 1 }} / {{ artworks.length }}</span>
        <button @click="carouselNext" class="carousel-btn">↓</button>
      </div>
    </section>

    <!-- LIGHTBOX -->
    <teleport to="body">
      <transition name="lightbox-fade">
        <div v-if="lightboxOpen" class="lightbox" @click.self="closeLightbox">
          <button class="lightbox-close" @click="closeLightbox">×</button>
          <button class="lightbox-prev" @click="lightboxPrev">‹</button>
          <div class="lightbox-content">
            <div class="lightbox-img" :style="{ background: artworks[lightboxIndex].gradient }">
              <span class="lightbox-icon">{{ artworks[lightboxIndex].icon }}</span>
            </div>
            <div class="lightbox-info">
              <h2>{{ artworks[lightboxIndex].title }}</h2>
              <p class="lightbox-meta">{{ artworks[lightboxIndex].year }} · {{ artworks[lightboxIndex].medium }}</p>
              <p class="lightbox-detail">{{ artworks[lightboxIndex].details }}</p>
            </div>
          </div>
          <button class="lightbox-next" @click="lightboxNext">›</button>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const columns = ref(3)
const viewMode = ref('grid')
const lightboxOpen = ref(false)
const lightboxIndex = ref(0)

const artworks = ref([
  { id: 1, title: 'Tidal Memory', year: '2024', medium: 'Stoneware', details: 'Wheel-thrown vessel with salt-fired glaze, inspired by Crystal Cove tide pools.', img: 'src/assets/Public/Collab.jpeg', icon: '🏺', tall: true, gradient: 'linear-gradient(135deg, #CCCCFF 0%, #D4E8E0 100%)' },
  { id: 2, title: 'Drift I', year: '2024', medium: 'Porcelain', details: 'Hand-built slab construction with oxide wash. Embracing the warp.', img: 'src/assets/Public/ceramics/Bricks.jpeg', icon: '🫖', tall: false, gradient: 'linear-gradient(135deg, #E0E0FF 0%, #F0D8D0 100%)' },
  { id: 3, title: 'Erosion Study', year: '2023', medium: 'Mixed Media', details: 'Clay, sand, and found driftwood. An experiment in controlled decay.', img: '#', icon: '🪨', tall: false, gradient: 'linear-gradient(135deg, #C4A882 0%, #CCCCFF 100%)' },
  { id: 4, title: 'Shore Leave', year: '2023', medium: 'Raku', details: 'Copper matte raku with horsehair carbonization. Each firing a surprise.', img: '#', icon: '✨', tall: true, gradient: 'linear-gradient(135deg, #D4E8E0 0%, #E8E0D0 100%)' },
  { id: 5, title: 'Salt & Ash', year: '2023', medium: 'Stoneware', details: 'Wood-fired serving bowl. 36-hour kiln marathon. Worth every hour.', img: '#', icon: '🍶', tall: false, gradient: 'linear-gradient(135deg, #F5F0E8 0%, #CCCCFF 100%)' },
  { id: 6, title: 'Impermanence', year: '2022', medium: 'Porcelain', details: 'Paper-thin translucent porcelain. Cracked intentionally, repaired with gold.', img: '#', icon: '💫', tall: false, gradient: 'linear-gradient(135deg, #CCCCFF 0%, #F0D8D0 100%)' },
  { id: 7, title: 'Coastal Fragment', year: '2022', medium: 'Ceramic + Found Object', details: 'Beach glass and clay composite tile series. 12 pieces, each unique.', img: '#', icon: '🐚', tall: true, gradient: 'linear-gradient(135deg, #B8B8E8 0%, #D4E8E0 100%)' },
  { id: 8, title: 'Morning Glaze', year: '2024', medium: 'Stoneware', details: 'Layered celadon and ash glazes. Fired to cone 10 in reduction.', img: '#', icon: '🫙', tall: false, gradient: 'linear-gradient(135deg, #D4E8E0 0%, #CCCCFF 100%)' },
  { id: 9, title: 'Wabi Bowl Set', year: '2024', medium: 'Stoneware', details: 'Set of 5 intentionally irregular nesting bowls. No two alike.', img: '#', icon: '🥣', tall: false, gradient: 'linear-gradient(135deg, #E8E0D0 0%, #E0E0FF 100%)' },
])

function openLightbox(i) {
  lightboxIndex.value = i
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  lightboxOpen.value = false
  document.body.style.overflow = ''
}

function lightboxNext() {
  lightboxIndex.value = (lightboxIndex.value + 1) % artworks.value.length
}

function lightboxPrev() {
  lightboxIndex.value = (lightboxIndex.value - 1 + artworks.value.length) % artworks.value.length
}

// Carousel
const carouselIndex = ref(0)
const slideHeight = 420
const carouselOffset = computed(() => -carouselIndex.value * slideHeight)

function carouselNext() {
  if (carouselIndex.value < artworks.value.length - 1) carouselIndex.value++
}

function carouselPrev() {
  if (carouselIndex.value > 0) carouselIndex.value--
}

function onCarouselWheel(e) {
  if (e.deltaY > 20) carouselNext()
  else if (e.deltaY < -20) carouselPrev()
}
</script>

<style scoped>
.art-page {
  padding-bottom: 40px;
}

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
  max-width: 500px;
}

/* Controls */
.art-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
  gap: 16px;
}

.columns-control {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.85rem;
  color: var(--driftwood-dark);
}

.columns-control input[type="range"] {
  accent-color: var(--periwinkle-deep);
  width: 100px;
}

.col-count {
  font-weight: 500;
  color: var(--charcoal);
  min-width: 16px;
  text-align: center;
}

.view-toggle {
  display: flex;
  border: 1.5px solid var(--periwinkle-muted);
  border-radius: 100px;
  overflow: hidden;
}

.view-toggle button {
  padding: 8px 20px;
  font-size: 0.82rem;
  letter-spacing: 0.03em;
  transition: all 0.3s;
  color: var(--driftwood-dark);
}

.view-toggle button.active {
  background: var(--periwinkle);
  color: var(--charcoal);
}

/* MOSAIC GRID */
.mosaic-grid {
  display: grid;
  grid-template-columns: repeat(var(--cols), 1fr);
  gap: 16px;
}

.mosaic-item {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.4s var(--ease-out-expo);
}

.mosaic-item:hover {
  transform: scale(1.02);
}

.mosaic-tall {
  grid-row: span 2;
}

.mosaic-img {
  width: 100%;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mosaic-tall .mosaic-img {
  aspect-ratio: auto;
  height: 100%;
  min-height: 300px;
}

.mosaic-placeholder-icon {
  font-size: 3rem;
  opacity: 0.6;
}

.mosaic-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(26,25,24,0.85) 0%, rgba(26,25,24,0.2) 50%, transparent 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 24px;
  opacity: 0;
  transform: translateY(8px);
  transition: all 0.4s var(--ease-out-expo);
  color: white;
}

.mosaic-item:hover .mosaic-overlay {
  opacity: 1;
  transform: translateY(0);
}

.mosaic-title {
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 400;
}

.mosaic-meta {
  font-size: 0.78rem;
  opacity: 0.7;
  margin-top: 4px;
}

.mosaic-detail {
  font-size: 0.82rem;
  margin-top: 8px;
  opacity: 0.8;
  line-height: 1.5;
}

@media (max-width: 600px) {
  .mosaic-grid {
    --cols: 2 !important;
  }
}

/* CAROUSEL */
.carousel-section {
  height: 420px;
  overflow: hidden;
  position: relative;
  max-width: var(--content-max);
  margin: 0 auto;
  padding: 0 clamp(20px, 4vw, 48px);
}

.carousel-track {
  transition: transform 0.6s var(--ease-out-expo);
}

.carousel-slide {
  height: 400px;
  display: flex;
  gap: 32px;
  align-items: center;
  margin-bottom: 20px;
  cursor: pointer;
  border-radius: 20px;
  overflow: hidden;
  background: rgba(255,255,255,0.4);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(204,204,255,0.2);
  transition: transform 0.4s var(--ease-out-expo);
}

.carousel-slide:hover {
  transform: scale(1.01);
}

.carousel-img {
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.carousel-placeholder-icon {
  font-size: 4rem;
  opacity: 0.5;
}

.carousel-info {
  padding: 32px;
}

.carousel-info h3 {
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 400;
  margin-bottom: 8px;
}

.carousel-info p {
  color: var(--driftwood-dark);
  font-size: 0.9rem;
}

.carousel-nav {
  position: absolute;
  right: clamp(20px, 4vw, 48px);
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.carousel-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--periwinkle-soft);
  color: var(--charcoal);
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
}

.carousel-btn:hover {
  background: var(--periwinkle);
}

.carousel-counter {
  font-size: 0.75rem;
  color: var(--driftwood);
  writing-mode: vertical-rl;
  letter-spacing: 0.1em;
}

/* LIGHTBOX */
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(26, 25, 24, 0.92);
  backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.lightbox-close {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 48px;
  height: 48px;
  font-size: 2rem;
  color: white;
  opacity: 0.6;
  transition: opacity 0.3s;
  z-index: 10;
}
.lightbox-close:hover { opacity: 1; }

.lightbox-prev,
.lightbox-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 3rem;
  color: white;
  opacity: 0.5;
  padding: 20px;
  transition: opacity 0.3s;
  z-index: 10;
}
.lightbox-prev { left: 10px; }
.lightbox-next { right: 10px; }
.lightbox-prev:hover,
.lightbox-next:hover { opacity: 1; }

.lightbox-content {
  max-width: 900px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.lightbox-img {
  width: 100%;
  max-height: 60vh;
  aspect-ratio: 4/3;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-icon {
  font-size: 5rem;
  opacity: 0.4;
}

.lightbox-info {
  color: white;
  text-align: center;
  margin-top: 24px;
}

.lightbox-info h2 {
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 300;
}

.lightbox-meta {
  font-size: 0.85rem;
  opacity: 0.6;
  margin-top: 4px;
}

.lightbox-detail {
  font-size: 0.95rem;
  opacity: 0.8;
  margin-top: 12px;
  max-width: 500px;
  line-height: 1.6;
}

.lightbox-fade-enter-active,
.lightbox-fade-leave-active {
  transition: opacity 0.3s;
}
.lightbox-fade-enter-from,
.lightbox-fade-leave-to {
  opacity: 0;
}
</style>
