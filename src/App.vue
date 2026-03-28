<template>
  <div class="app-shell">
    <!-- Gas / Plasma background -->
    <div class="plasma-bg" aria-hidden="true">
      <div class="water-base"></div>
      <div class="water-layer water-layer-1"></div>
      <div class="water-layer water-layer-2"></div>
      <canvas ref="canvasRef" class="plasma-canvas"></canvas>
    </div>

    <!-- Navigation -->
    <nav class="site-nav" :class="{ scrolled: isScrolled }">
      <div class="nav-inner">
        <router-link to="/" class="nav-logo">CG</router-link>
        <button class="nav-toggle" @click="menuOpen = !menuOpen" :class="{ open: menuOpen }">
          <span></span><span></span><span></span>
        </button>
        <ul class="nav-links" :class="{ open: menuOpen }">
          <li><router-link to="/" @click="menuOpen = false">Home</router-link></li>
          <li><router-link to="/art" @click="menuOpen = false">Art</router-link></li>
          <li><router-link to="/travel" @click="menuOpen = false">OC Guide</router-link></li>
          <li><router-link to="/games" @click="menuOpen = false">Games</router-link></li>
        </ul>
      </div>
    </nav>

    <!-- Page content -->
    <main class="site-main">
      <router-view v-slot="{ Component, route }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </main>

    <!-- Footer -->
    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <img :src="imgHere" alt="" class="footer-photo" />
          <span class="footer-name">Courtney Gooch</span>
          <span class="footer-tagline">Ceramicist · Leader · Coastal Wanderer</span>
        </div>
        <nav class="footer-nav">
          <router-link to="/">Home</router-link>
          <router-link to="/art">Art</router-link>
          <router-link to="/travel">Travel</router-link>
          <router-link to="/games">Games</router-link>
        </nav>
        <div class="footer-social">
        </div>
        <p class="footer-copy">&copy; {{ new Date().getFullYear() }} Courtney Gooch. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import imgHere from './assets/Public/here.jpg'

const canvasRef = ref(null)
let reqFrame = null
let lastMouse = { x: -300, y: -300 }
let particles = []

function onGlobalMouseMove(e) {
  const dx = e.clientX - lastMouse.x
  const dy = e.clientY - lastMouse.y
  const dist = Math.sqrt(dx * dx + dy * dy)
  
  if (dist > 5 && canvasRef.value) {
    particles.push({
      x: e.clientX,
      y: e.clientY,
      vx: dx * 0.08, // Keep some momentum
      vy: dy * 0.08,
      radius: 40 + Math.min(dist * 1.5, 120), // Faster moving = broader spread
      life: 1.0,
      color: Math.random() > 0.5 ? 'rgba(204, 204, 255, ' : 'rgba(212, 232, 224, ' // Periwinkle or Sea-foam base
    })
    lastMouse.x = e.clientX
    lastMouse.y = e.clientY
  }
}

function renderCanvas() {
  if (!canvasRef.value) return
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  const w = window.innerWidth
  const h = window.innerHeight
  
  ctx.clearRect(0, 0, w, h)
  ctx.globalCompositeOperation = 'multiply'
  
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i]
    p.life -= 0.012
    p.x += p.vx
    p.y += p.vy
    p.radius += 0.8 // Fluid expansion
    
    if (p.life <= 0) {
      particles.splice(i, 1)
      continue
    }

    const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius)
    grad.addColorStop(0, p.color + (p.life * 0.5) + ')')
    grad.addColorStop(1, p.color + '0)')
    
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
    ctx.fill()
  }
  
  reqFrame = requestAnimationFrame(renderCanvas)
}

function handleResize() {
  if (canvasRef.value) {
    canvasRef.value.width = window.innerWidth
    canvasRef.value.height = window.innerHeight
  }
}

const isScrolled = ref(false)
const menuOpen = ref(false)

function onScroll() {
  isScrolled.value = window.scrollY > 40
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    handleResize()
    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('mousemove', onGlobalMouseMove, { passive: true })
    renderCanvas()
  }
})
onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('mousemove', onGlobalMouseMove)
    window.removeEventListener('resize', handleResize)
    cancelAnimationFrame(reqFrame)
  }
})
</script>

<style>
/* ============================================
   CSS CUSTOM PROPERTIES — WABI-SABI COASTAL
   ============================================ */
:root {
  --periwinkle: #CCCCFF;
  --periwinkle-soft: #E0E0FF;
  --periwinkle-deep: #9999DD;
  --periwinkle-muted: #B8B8E8;
  --sand: #F5F0E8;
  --sand-light: #FAF8F3;
  --sand-dark: #E8E0D0;
  --driftwood: #A89F91;
  --driftwood-dark: #6B6358;
  --charcoal: #2D2B28;
  --ink: #1A1918;
  --sea-foam: #D4E8E0;
  --clay: #C4A882;
  --clay-dark: #8B7355;
  --white-wash: #FEFDFB;
  --coral-faint: #F0D8D0;

  --font-display: 'Cormorant Garamond', Georgia, serif;
  --font-body: 'DM Sans', system-ui, sans-serif;

  --nav-height: 72px;
  --section-gap: clamp(80px, 12vw, 160px);
  --content-max: 1200px;
  --content-narrow: 800px;

  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out-soft: cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* RESET */
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
}

body {
  font-family: var(--font-body);
  font-weight: 300;
  color: var(--charcoal);
  background: var(--sand-light);
  line-height: 1.7;
  overflow-x: hidden;
}

img {
  max-width: 100%;
  display: block;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  font: inherit;
  cursor: pointer;
  border: none;
  background: none;
}

/* ============================================
   PAGE TRANSITIONS
   ============================================ */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.4s var(--ease-out-soft), transform 0.4s var(--ease-out-soft);
}
.page-fade-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* ============================================
   PLASMA / WATER BACKGROUND
   ============================================ */
.plasma-bg {
  position: fixed;
  inset: 0;
  z-index: -2;
  pointer-events: none;
  overflow: hidden;
  background: var(--sand-light);
}

.water-base {
  position: absolute;
  inset: -50%;
  background: radial-gradient(circle at 50% 50%, var(--sea-foam) 0%, var(--periwinkle-soft) 40%, var(--sand-light) 80%);
  animation: breatheWater 14s ease-in-out infinite alternate;
  opacity: 0.6;
}

.water-layer {
  position: absolute;
  inset: -100px;
  background-size: 200% 200%;
  opacity: 0.5;
  filter: blur(60px);
}

.water-layer-1 {
  background-image: radial-gradient(ellipse at 20% 80%, var(--periwinkle) 0%, transparent 50%),
                    radial-gradient(ellipse at 80% 20%, var(--coral-faint) 0%, transparent 50%);
  animation: driftWater 20s linear infinite;
}

.water-layer-2 {
  background-image: radial-gradient(circle at 70% 70%, var(--sea-foam) 0%, transparent 60%),
                    radial-gradient(circle at 30% 30%, var(--periwinkle-deep) 0%, transparent 60%);
  animation: driftWater 25s linear infinite reverse;
  mix-blend-mode: soft-light;
}

.plasma-canvas {
  position: absolute;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 10;
  filter: blur(20px);
}

@keyframes breatheWater {
  0% { transform: scale(1); opacity: 0.5; }
  100% { transform: scale(1.15); opacity: 0.8; }
}

@keyframes driftWater {
  0% { background-position: 0% 0%; }
  50% { background-position: 100% 100%; }
  100% { background-position: 0% 0%; }
}

/* ============================================
   NAVIGATION
   ============================================ */
.site-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: var(--nav-height);
  transition: background 0.4s, box-shadow 0.4s, backdrop-filter 0.4s;
  background: transparent;
}

.site-nav.scrolled {
  background: rgba(250, 248, 243, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 1px 0 rgba(0,0,0,0.06);
}

.nav-inner {
  max-width: var(--content-max);
  margin: 0 auto;
  padding: 0 clamp(20px, 4vw, 48px);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-logo {
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  color: var(--charcoal);
  transition: color 0.3s;
}
.nav-logo:hover { color: var(--periwinkle-deep); }

.nav-links {
  list-style: none;
  display: flex;
  gap: 32px;
  align-items: center;
}

.nav-links a {
  font-size: 0.85rem;
  font-weight: 400;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  position: relative;
  transition: color 0.3s;
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 1.5px;
  background: var(--periwinkle-deep);
  transition: width 0.3s var(--ease-out-expo);
}

.nav-links a:hover::after,
.nav-links a.router-link-exact-active::after {
  width: 100%;
}

.nav-links a.router-link-exact-active {
  color: var(--periwinkle-deep);
}

/* Mobile toggle */
.nav-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  width: 28px;
  padding: 4px 0;
}
.nav-toggle span {
  display: block;
  height: 2px;
  background: var(--charcoal);
  border-radius: 2px;
  transition: transform 0.3s, opacity 0.3s;
}
.nav-toggle.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.nav-toggle.open span:nth-child(2) { opacity: 0; }
.nav-toggle.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

@media (max-width: 768px) {
  .nav-toggle { display: flex; }
  .nav-links {
    position: fixed;
    top: var(--nav-height);
    left: 0;
    right: 0;
    background: rgba(250, 248, 243, 0.97);
    backdrop-filter: blur(20px);
    flex-direction: column;
    gap: 0;
    padding: 16px 0 24px;
    transform: translateY(-120%);
    opacity: 0;
    transition: transform 0.4s var(--ease-out-expo), opacity 0.3s;
    box-shadow: 0 8px 32px rgba(0,0,0,0.08);
  }
  .nav-links.open {
    transform: translateY(0);
    opacity: 1;
  }
  .nav-links li { width: 100%; text-align: center; }
  .nav-links a {
    display: block;
    padding: 14px 24px;
    font-size: 0.95rem;
  }
  .nav-links a::after { display: none; }
}

/* ============================================
   MAIN CONTENT
   ============================================ */
.site-main {
  min-height: 100vh;
  padding-top: var(--nav-height);
}

/* ============================================
   FOOTER
   ============================================ */
.site-footer {
  background: var(--ink);
  color: rgba(255, 255, 255, 0.6);
  padding: 60px 0 40px;
  margin-top: var(--section-gap);
}

.footer-inner {
  max-width: var(--content-max);
  margin: 0 auto;
  padding: 0 clamp(20px, 4vw, 48px);
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 40px;
  align-items: start;
}

.footer-photo {
  width: 100%;
  height: 120px;
  object-fit: contain;
  border-radius: 12px;
  margin-bottom: 16px;
  opacity: 0.75;
  display: block;
}

.footer-name {
  display: block;
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 400;
  color: rgba(255,255,255,0.9);
  margin-bottom: 4px;
}

.footer-tagline {
  font-size: 0.8rem;
  letter-spacing: 0.05em;
}

.footer-nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-nav a,
.footer-social a {
  font-size: 0.85rem;
  transition: color 0.3s;
}

.footer-nav a:hover,
.footer-social a:hover {
  color: var(--periwinkle-soft);
}

.footer-social {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-copy {
  grid-column: 1 / -1;
  font-size: 0.75rem;
  padding-top: 24px;
  border-top: 1px solid rgba(255,255,255,0.08);
  opacity: 0.5;
}

@media (max-width: 600px) {
  .footer-inner {
    grid-template-columns: 1fr 1fr;
  }
  .footer-brand { grid-column: 1 / -1; }
}

/* ============================================
   SHARED UTILITY CLASSES
   ============================================ */
.section-container {
  max-width: var(--content-max);
  margin: 0 auto;
  padding: 0 clamp(20px, 4vw, 48px);
}

.section-narrow {
  max-width: var(--content-narrow);
  margin: 0 auto;
  padding: 0 clamp(20px, 4vw, 48px);
}

.section-title {
  font-family: var(--font-display);
  font-weight: 300;
  font-size: clamp(1.6rem, 3vw, 2.4rem);
  color: var(--charcoal);
  margin-bottom: 12px;
  letter-spacing: -0.01em;
}

.section-divider {
  width: 48px;
  height: 1.5px;
  background: var(--periwinkle-muted);
  border: none;
  margin: var(--section-gap) auto;
  border-radius: 1px;
}

/* Organic card style */
.organic-card {
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(204, 204, 255, 0.2);
  border-radius: 20px;
  padding: clamp(24px, 4vw, 40px);
  transition: transform 0.4s var(--ease-out-expo), box-shadow 0.4s;
}

.organic-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(153, 153, 221, 0.1);
}

/* Grain overlay on sections */
.grain-overlay {
  position: relative;
}
.grain-overlay::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 0;
  border-radius: inherit;
}
</style>
