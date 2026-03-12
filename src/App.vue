<template>
  <div class="app-shell">
    <!-- Organic blob background decorations -->
    <div class="bg-blobs" aria-hidden="true">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
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
          <li><router-link to="/travel" @click="menuOpen = false">OC Travel Guide</router-link></li>
          <li><router-link to="/games" @click="menuOpen = false">Games</router-link></li>
          <li><a href="https://substack.com" target="_blank" rel="noopener">Substack</a></li>
          <li><a href="https://instagram.com" target="_blank" rel="noopener">Instagram</a></li>
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
          <a href="https://substack.com" target="_blank" rel="noopener">Substack</a>
          <a href="https://instagram.com" target="_blank" rel="noopener">Instagram</a>
        </div>
        <p class="footer-copy">&copy; {{ new Date().getFullYear() }} Courtney Gooch. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import imgHere from './assets/Public/here.jpg'

const isScrolled = ref(false)
const menuOpen = ref(false)

function onScroll() {
  isScrolled.value = window.scrollY > 40
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
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
   BACKGROUND BLOBS — organic shapes
   ============================================ */
.bg-blobs {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.3;
}

.blob-1 {
  width: 600px;
  height: 600px;
  background: var(--periwinkle);
  top: -200px;
  right: -100px;
  animation: blobDrift1 25s ease-in-out infinite;
}

.blob-2 {
  width: 400px;
  height: 400px;
  background: var(--sea-foam);
  bottom: 20%;
  left: -150px;
  animation: blobDrift2 30s ease-in-out infinite;
}

.blob-3 {
  width: 350px;
  height: 350px;
  background: var(--coral-faint);
  top: 50%;
  right: 10%;
  animation: blobDrift3 20s ease-in-out infinite;
}

@keyframes blobDrift1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-40px, 60px) scale(1.05); }
  66% { transform: translate(30px, -30px) scale(0.95); }
}
@keyframes blobDrift2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(50px, -40px) scale(1.08); }
}
@keyframes blobDrift3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  40% { transform: translate(-30px, 30px) scale(1.04); }
  80% { transform: translate(20px, -20px) scale(0.96); }
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
