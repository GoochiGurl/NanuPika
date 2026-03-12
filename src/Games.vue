<template>
  <div class="games-page">
    <section class="art-hero">
      <div class="section-container">
        <h1 class="page-title">Games</h1>
        <p class="page-subtitle">Take a break. Play with the fam.</p>
      </div>
    </section>

    <section class="section-container">

      <div class="game-card">
        <PikasCrossing />
      </div>

      <div class="game-card organic-card">
        <div class="game-header">
          <div>
            <h2 class="game-title">Chase</h2>
            <p class="game-desc">Meet the fam mini-game — wake up the critters and try to catch them all.</p>
          </div>
          <div class="game-score">
            <span class="score-label">Catches</span>
            <span class="score-value">{{ score }}</span>
          </div>
        </div>

        <div
          class="game-zone"
          ref="gameZone"
          @mousemove="onMouseMove"
          @mouseenter="onMouseEnter"
          @mouseleave="onMouseLeave"
          @click="onClick"
          @touchstart.passive="onTouchStart"
          @touchmove.passive="onTouchMove"
        >
          <!-- Sleeping state -->
          <div v-if="!isAwake" class="game-sleeping">
            <span class="sleeping-emoji">😴</span>
            <p>Move your {{ isMobile ? 'finger' : 'mouse' }} here to wake up the critters!</p>
          </div>

          <!-- Critters -->
          <div
            v-for="critter in critters"
            :key="critter.id"
            class="critter"
            :class="{ caught: critter.caught }"
            :style="{
              left: critter.x + 'px',
              top: critter.y + 'px',
              transform: `scale(${critter.caught ? 1.8 : 1})`,
              opacity: critter.caught ? 0 : 1,
              transition: critter.caught
                ? 'transform 0.4s ease-out, opacity 0.4s ease-out'
                : 'left 0.15s linear, top 0.15s linear'
            }"
          >
            {{ critter.emoji }}
          </div>

          <!-- Sparkle particles -->
          <div
            v-for="p in particles"
            :key="p.id"
            class="sparkle"
            :style="{
              left: p.x + 'px',
              top: p.y + 'px',
              '--dx': p.dx + 'px',
              '--dy': p.dy + 'px',
            }"
          >
            {{ p.emoji }}
          </div>

          <!-- Cursor indicator -->
          <div
            v-if="isAwake && !isMobile"
            class="cursor-ring"
            :style="{ left: mouseX + 'px', top: mouseY + 'px' }"
          ></div>
        </div>

        <div class="game-instructions">
          <p>{{ isMobile ? 'Tap' : 'Click' }} a critter to catch it! They'll flee your {{ isMobile ? 'finger' : 'cursor' }}, so be quick.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, onUnmounted, nextTick } from 'vue'
import PikasCrossing from './PikaCrossing.vue'

const EMOJIS = ['🐕', '🐱', '🐈', '💜', '🩷', '🐾', '🐕', '🐱']
const SPARKLE_EMOJIS = ['✨', '💫', '⭐', '🌟', '💜', '🩷', '💖', '🐾', '✧', '♡']
const CRITTER_COUNT = 8
const FLEE_RADIUS = 150
const FLEE_SPEED = 3.5
const DRIFT_SPEED = 0.4

const score = ref(0)
const isAwake = ref(false)
const mouseX = ref(0)
const mouseY = ref(0)
const gameZone = ref(null)
const isMobile = ref(false)

let nextId = 100
let animFrame = null

const critters = reactive([])
const particles = reactive([])

function spawnCritter(x, y) {
  const zone = gameZone.value
  if (!zone) return
  const rect = zone.getBoundingClientRect()
  const w = rect.width - 40
  const h = rect.height - 40
  return {
    id: nextId++,
    emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    x: x ?? 20 + Math.random() * w,
    y: y ?? 20 + Math.random() * h,
    vx: (Math.random() - 0.5) * DRIFT_SPEED,
    vy: (Math.random() - 0.5) * DRIFT_SPEED,
    caught: false,
  }
}

function initCritters() {
  critters.length = 0
  for (let i = 0; i < CRITTER_COUNT; i++) {
    critters.push(spawnCritter())
  }
}

function updatePositions() {
  const zone = gameZone.value
  if (!zone) return
  const rect = zone.getBoundingClientRect()
  const w = rect.width - 40
  const h = rect.height - 40
  const mx = mouseX.value
  const my = mouseY.value

  for (const c of critters) {
    if (c.caught) continue

    let fx = 0, fy = 0
    const dx = c.x - mx
    const dy = c.y - my
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist < FLEE_RADIUS && dist > 0) {
      const strength = (FLEE_RADIUS - dist) / FLEE_RADIUS
      fx = (dx / dist) * FLEE_SPEED * strength
      fy = (dy / dist) * FLEE_SPEED * strength
    }

    c.x += c.vx + fx
    c.y += c.vy + fy

    // Bounce off walls
    if (c.x < 10) { c.x = 10; c.vx = Math.abs(c.vx); }
    if (c.x > w) { c.x = w; c.vx = -Math.abs(c.vx); }
    if (c.y < 10) { c.y = 10; c.vy = Math.abs(c.vy); }
    if (c.y > h) { c.y = h; c.vy = -Math.abs(c.vy); }

    // Random drift changes
    if (Math.random() < 0.01) {
      c.vx = (Math.random() - 0.5) * DRIFT_SPEED
      c.vy = (Math.random() - 0.5) * DRIFT_SPEED
    }
  }

  animFrame = requestAnimationFrame(updatePositions)
}

function onMouseEnter() {
  if (!isAwake.value) {
    isAwake.value = true
    initCritters()
    animFrame = requestAnimationFrame(updatePositions)
  }
}

function onMouseLeave() {
  // Keep running, just stop fleeing
}

function onMouseMove(e) {
  const zone = gameZone.value
  if (!zone) return
  const rect = zone.getBoundingClientRect()
  mouseX.value = e.clientX - rect.left
  mouseY.value = e.clientY - rect.top
}

function onTouchStart(e) {
  isMobile.value = true
  if (!isAwake.value) {
    isAwake.value = true
    initCritters()
    animFrame = requestAnimationFrame(updatePositions)
  }
  const touch = e.touches[0]
  updateTouchPos(touch)
}

function onTouchMove(e) {
  const touch = e.touches[0]
  updateTouchPos(touch)
}

function updateTouchPos(touch) {
  const zone = gameZone.value
  if (!zone) return
  const rect = zone.getBoundingClientRect()
  mouseX.value = touch.clientX - rect.left
  mouseY.value = touch.clientY - rect.top
}

function onClick(e) {
  const zone = gameZone.value
  if (!zone) return
  const rect = zone.getBoundingClientRect()
  const cx = e.clientX - rect.left
  const cy = e.clientY - rect.top

  for (let i = 0; i < critters.length; i++) {
    const c = critters[i]
    if (c.caught) continue
    const dx = c.x - cx
    const dy = c.y - cy
    if (Math.sqrt(dx * dx + dy * dy) < 35) {
      catchCritter(i)
      return
    }
  }
}

function catchCritter(index) {
  const c = critters[index]
  c.caught = true
  score.value++

  // Spawn sparkle particles
  for (let i = 0; i < 10; i++) {
    const angle = (Math.PI * 2 * i) / 10
    const dist = 40 + Math.random() * 60
    particles.push({
      id: nextId++,
      emoji: SPARKLE_EMOJIS[Math.floor(Math.random() * SPARKLE_EMOJIS.length)],
      x: c.x,
      y: c.y,
      dx: Math.cos(angle) * dist,
      dy: Math.sin(angle) * dist,
    })
  }

  // Remove particles after animation
  setTimeout(() => {
    particles.splice(0, 10)
  }, 700)

  // Replace critter after fade
  setTimeout(() => {
    critters[index] = spawnCritter()
  }, 500)
}

onUnmounted(() => {
  if (animFrame) cancelAnimationFrame(animFrame)
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
}

.game-card {
  margin-top: 20px;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.game-title {
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 400;
  margin-bottom: 4px;
}

.game-desc {
  font-size: 0.9rem;
  color: var(--driftwood-dark);
}

.game-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--periwinkle-soft);
  border-radius: 16px;
  padding: 12px 24px;
  min-width: 80px;
}

.score-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--driftwood-dark);
}

.score-value {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 500;
  color: var(--periwinkle-deep);
  line-height: 1;
}

/* Game Zone */
.game-zone {
  position: relative;
  width: 100%;
  height: clamp(350px, 50vw, 500px);
  background: linear-gradient(135deg, var(--sand-light) 0%, var(--periwinkle-soft) 50%, var(--sea-foam) 100%);
  border-radius: 20px;
  border: 2px solid var(--periwinkle-soft);
  overflow: hidden;
  cursor: none;
  user-select: none;
  -webkit-user-select: none;
  touch-action: none;
}

.game-sleeping {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: var(--driftwood);
  font-size: 0.95rem;
}

.sleeping-emoji {
  font-size: 3rem;
  animation: sleepBob 2s ease-in-out infinite;
}

@keyframes sleepBob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.critter {
  position: absolute;
  font-size: 2rem;
  pointer-events: none;
  z-index: 2;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}

.cursor-ring {
  position: absolute;
  width: 24px;
  height: 24px;
  border: 2px solid var(--periwinkle-deep);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 5;
  opacity: 0.6;
  transition: width 0.15s, height 0.15s;
}

/* Sparkle particles */
.sparkle {
  position: absolute;
  font-size: 1rem;
  pointer-events: none;
  z-index: 3;
  animation: sparkleExplode 0.65s ease-out forwards;
}

@keyframes sparkleExplode {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(var(--dx), var(--dy)) scale(0.3);
    opacity: 0;
  }
}

.game-instructions {
  margin-top: 16px;
  text-align: center;
  font-size: 0.85rem;
  color: var(--driftwood);
}

@media (max-width: 600px) {
  .game-zone {
    cursor: default;
  }
}
</style>
