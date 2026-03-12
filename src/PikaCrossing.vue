<template>
  <div class="simulation-container">
    <!-- UI Panel -->
    <div class="ui-panel">
      <div class="ui-header">
        <h3>🌿 Pika's Crossing</h3>
        <span class="happiness-badge">{{ happinessLabel }}</span>
      </div>
      <div class="controls">
        <label class="time-label">{{ formattedTime }}</label>
        <input type="range" v-model="timeOfDay" min="6" max="18" step="0.1" />
        <p class="solar-readout">☀️ Solar {{ solarPower.toFixed(1) }} kW</p>
      </div>
      <p class="instructions">
        Click wall panels: Window 🪟 → Curtains 🚪 → Solar Panel ⬛
      </p>
    </div>

    <!-- Room -->
    <div class="room" ref="roomRef">
      <div class="sky" :style="{ background: skyColor }"></div>

      <div class="wall">
        <div
          v-for="(panel, index) in wallPanels"
          :key="index"
          class="wall-segment"
          @click="togglePanel(index)"
        >
          <div v-if="panel === 'window-open'" class="segment-content window open">🪟</div>
          <div v-else-if="panel === 'window-closed'" class="segment-content window closed">🚪</div>
          <div v-else-if="panel === 'solar'" class="segment-content solar">⬛</div>
        </div>
      </div>

      <div class="floor" ref="floorRef">
        <!-- Cozy rug -->
        <div v-if="rugOn" class="floor-rug"></div>

        <!-- Cat bed -->
        <div v-if="catBedOn" class="floor-item floor-catbed">🛏️</div>

        <!-- Floor lamp -->
        <div v-if="lampOn" class="floor-item floor-lamp">🪔</div>

        <!-- Plant -->
        <div class="floor-item floor-plant">{{ plantEmoji }}</div>

        <!-- Cats -->
        <div
          v-for="cat in cats"
          :key="cat.id"
          class="cat-wrapper"
          :style="{
            left: (cat.xFrac * 100).toFixed(2) + '%',
            transform: cat.facingLeft ? 'scaleX(-1)' : 'scaleX(1)',
          }"
        >
          <span :class="['cat-emoji', { walking: cat.state === 'wander' || cat.state === 'seeking' }]">
            {{ catFace(cat) }}
          </span>
          <span v-if="cat.state === 'sleeping'" class="cat-zzz">💤</span>
        </div>
      </div>

      <canvas ref="lightCanvas" class="light-overlay"></canvas>
    </div>

    <!-- Homemaking Toolbar -->
    <div class="homemaking-toolbar">
      <button class="hm-btn" @click="waterPlant">
        <span class="hm-icon">💧</span>
        <span class="hm-label">Water</span>
        <span class="hm-sub">{{ plantEmoji }} {{ plantStageLabel }}</span>
      </button>
      <button class="hm-btn" :class="{ active: lampOn }" @click="lampOn = !lampOn; drawLight()">
        <span class="hm-icon">🪔</span>
        <span class="hm-label">Lamp</span>
        <span class="hm-sub">{{ lampOn ? 'glowing' : 'unlit' }}</span>
      </button>
      <button class="hm-btn" :class="{ active: catBedOn }" @click="catBedOn = !catBedOn">
        <span class="hm-icon">🛏️</span>
        <span class="hm-label">Cat Bed</span>
        <span class="hm-sub">{{ catBedOn ? 'cozy spot' : 'put out' }}</span>
      </button>
      <button class="hm-btn" :class="{ active: rugOn }" @click="rugOn = !rugOn">
        <span class="hm-icon">🧺</span>
        <span class="hm-label">Rug</span>
        <span class="hm-sub">{{ rugOn ? 'laid out' : 'roll out' }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount } from 'vue'

// ── Time & Solar ───────────────────────────────────────────────
const timeOfDay = ref(12)
const roomRef = ref(null)
const floorRef = ref(null)
const lightCanvas = ref(null)
const wallPanels = ref(['window-open', 'solar', 'window-open', 'solar'])

const formattedTime = computed(() => {
  const h = Math.floor(timeOfDay.value)
  const m = Math.floor((timeOfDay.value % 1) * 60)
  const ampm = h >= 12 ? 'PM' : 'AM'
  return `${h > 12 ? h - 12 : h}:${String(m).padStart(2, '0')} ${ampm}`
})

const skyColor = computed(() => {
  if (timeOfDay.value < 8 || timeOfDay.value > 16)
    return 'linear-gradient(to bottom, #ff7e5f, #feb47b)'
  return 'linear-gradient(to bottom, #4facfe, #00f2fe)'
})

const solarPower = computed(() => {
  const sun = Math.max(0, 1 - Math.abs(timeOfDay.value - 12) / 6)
  const panels = wallPanels.value.filter(p => p === 'solar').length
  return sun * panels * 2.5
})

const togglePanel = (index) => {
  const states = ['window-open', 'window-closed', 'solar']
  const i = states.indexOf(wallPanels.value[index])
  wallPanels.value[index] = states[(i + 1) % states.length]
  drawLight()
}

// ── Floor Item Positions (as fractions 0–1) ────────────────────
const LAMP_XFRAC  = 0.10
const BED_XFRAC   = 0.52
const RUG_CENTER  = 0.38
const PLANT_XFRAC = 0.90

// ── Homemaking State ───────────────────────────────────────────
const lampOn   = ref(false)
const catBedOn = ref(false)
const rugOn    = ref(false)

const plantStages = ['🌱', '🌿', '🪴', '🌳']
const plantLabels = ['seedling', 'sprout', 'plant', 'tree']
const plantStage  = ref(1)
const plantEmoji  = computed(() => plantStages[plantStage.value])
const plantStageLabel = computed(() => plantLabels[plantStage.value])

function waterPlant() {
  plantStage.value = Math.min(3, plantStage.value + 1)
}

// ── Cat System ─────────────────────────────────────────────────
const cats = reactive([
  { id: 1, xFrac: 0.20, state: 'wander', targetXFrac: 0.20, facingLeft: false, velX: 0.00015, timer: 0, sleepUntil: 0, baseEmoji: '🐈',    offset: -0.04 },
  { id: 2, xFrac: 0.50, state: 'wander', targetXFrac: 0.50, facingLeft: true,  velX: -0.00010, timer: 0, sleepUntil: 0, baseEmoji: '🐈‍⬛', offset:  0.00 },
  { id: 3, xFrac: 0.72, state: 'wander', targetXFrac: 0.72, facingLeft: false, velX: 0.00008,  timer: 0, sleepUntil: 0, baseEmoji: '🐱',   offset:  0.04 },
])

function catFace(cat) {
  if (cat.state === 'sleeping') return '😺'
  if (cat.state === 'waking')   return '🐱'
  return cat.baseEmoji
}

// Returns array of { xFrac, priority } sorted desc
function getWarmSpots() {
  const canvas = lightCanvas.value
  const spots = []

  // Sunspots — computed from geometry, mirrors drawLight logic
  if (canvas && timeOfDay.value > 6 && timeOfDay.value < 18) {
    const progress  = (timeOfDay.value - 6) / 12
    const offsetX   = Math.cos(progress * Math.PI) * (canvas.height * 1.5)
    const panelW    = canvas.width / wallPanels.value.length

    wallPanels.value.forEach((panel, i) => {
      if (panel !== 'window-open') return
      const centerX = (i + 0.5) * panelW - offsetX
      const xFrac   = centerX / canvas.width
      if (xFrac > 0.03 && xFrac < 0.93) spots.push({ xFrac, priority: 3 })
    })
  }

  if (catBedOn.value) spots.push({ xFrac: BED_XFRAC,  priority: 2.5 })
  if (lampOn.value)   spots.push({ xFrac: LAMP_XFRAC, priority: 2   })
  if (rugOn.value)    spots.push({ xFrac: RUG_CENTER,  priority: 1   })

  return spots.sort((a, b) => b.priority - a.priority)
}

// ── Cat Game Loop ──────────────────────────────────────────────
let lastTs = 0
let rafId  = null

function updateCats(ts) {
  const dt   = Math.min(ts - lastTs, 50)
  lastTs     = ts
  const spots = getWarmSpots()

  cats.forEach((cat, idx) => {
    cat.timer += dt

    if (cat.state === 'wander') {
      // Drift
      cat.xFrac = Math.max(0.03, Math.min(0.87, cat.xFrac + cat.velX * dt))
      if (cat.xFrac <= 0.03) cat.velX =  Math.abs(cat.velX)
      if (cat.xFrac >= 0.87) cat.velX = -Math.abs(cat.velX)
      if (cat.velX !== 0) cat.facingLeft = cat.velX < 0

      // Periodic random direction/speed change
      if (cat.timer > 2800 + idx * 700) {
        cat.timer = 0
        const spd = 0.00007 + Math.random() * 0.00016
        cat.velX  = (Math.random() > 0.5 ? 1 : -1) * spd
      }

      // Occasionally seek nearest warm spot
      if (spots.length > 0 && Math.random() < 0.005) {
        const best = spots[0]
        const dest = Math.max(0.03, Math.min(0.87, best.xFrac + cat.offset))
        if (Math.abs(dest - cat.xFrac) > 0.06) {
          cat.targetXFrac = dest
          cat.state       = 'seeking'
          cat.timer       = 0
        }
      }

    } else if (cat.state === 'seeking') {
      const dx  = cat.targetXFrac - cat.xFrac
      if (Math.abs(dx) < 0.018) {
        cat.xFrac    = cat.targetXFrac
        cat.velX     = 0
        cat.state    = 'sleeping'
        cat.timer    = 0
        cat.sleepUntil = 14000 + idx * 2500 + Math.random() * 12000
      } else {
        const spd  = 0.00026
        cat.velX   = Math.sign(dx) * spd
        cat.xFrac  = Math.max(0.03, Math.min(0.87, cat.xFrac + cat.velX * dt))
        cat.facingLeft = cat.velX < 0
      }

    } else if (cat.state === 'sleeping') {
      // Wake if no nearby warm spot (after 5s grace) or natural sleep timer elapsed
      const nearSpot = spots.some(s => Math.abs(s.xFrac - cat.xFrac) < 0.13)
      if ((!nearSpot && cat.timer > 5000) || cat.timer > cat.sleepUntil) {
        cat.state = 'waking'
        cat.timer = 0
      }

    } else if (cat.state === 'waking') {
      if (cat.timer > 1100) {
        cat.state = 'wander'
        cat.timer = 0
        const spd = 0.00008 + Math.random() * 0.00015
        cat.velX  = (Math.random() > 0.5 ? 1 : -1) * spd
      }
    }
  })

  rafId = requestAnimationFrame(updateCats)
}

// ── Happiness ──────────────────────────────────────────────────
const happinessLabel = computed(() => {
  const n = cats.filter(c => c.state === 'sleeping').length
  if (n === 3) return '😻 Pure bliss'
  if (n === 2) return '😸 Very cozy'
  if (n === 1) return '🐱 Getting comfy'
  return '🐾 Cats are restless'
})

// ── Canvas Light Drawing ───────────────────────────────────────
const drawLight = () => {
  const canvas = lightCanvas.value
  const room   = roomRef.value
  if (!canvas || !room) return

  const ctx = canvas.getContext('2d')
  canvas.width  = room.clientWidth
  canvas.height = room.clientHeight
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Lamp warm glow at floor level
  if (lampOn.value) {
    const lx   = LAMP_XFRAC * canvas.width
    const ly   = canvas.height * 0.88
    const grad = ctx.createRadialGradient(lx, ly, 0, lx, ly, canvas.width * 0.26)
    grad.addColorStop(0, 'rgba(255, 215, 90, 0.30)')
    grad.addColorStop(1, 'rgba(255, 170, 40, 0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  // Sunbeams
  if (timeOfDay.value <= 6 || timeOfDay.value >= 18) return

  const progress  = (timeOfDay.value - 6) / 12
  const offsetX   = Math.cos(progress * Math.PI) * (canvas.height * 1.5)
  const panelW    = canvas.width / wallPanels.value.length

  ctx.fillStyle = 'rgba(255, 255, 200, 0.25)'
  wallPanels.value.forEach((panel, i) => {
    if (panel !== 'window-open') return
    const sx = i * panelW
    const ex = sx + panelW
    ctx.beginPath()
    ctx.moveTo(sx, 0)
    ctx.lineTo(ex, 0)
    ctx.lineTo(ex - offsetX, canvas.height)
    ctx.lineTo(sx - offsetX, canvas.height)
    ctx.closePath()
    ctx.fill()
  })
}

// ── Lifecycle ──────────────────────────────────────────────────
let resizeObserver

onMounted(() => {
  drawLight()
  resizeObserver = new ResizeObserver(drawLight)
  resizeObserver.observe(roomRef.value)

  lastTs = performance.now()
  rafId  = requestAnimationFrame(updateCats)
})

onBeforeUnmount(() => {
  if (resizeObserver) resizeObserver.disconnect()
  if (rafId) cancelAnimationFrame(rafId)
})

watch([timeOfDay, wallPanels], drawLight, { deep: true })
</script>

<style scoped>
.simulation-container {
  font-family: var(--font-body, system-ui, sans-serif);
  max-width: 800px;
  margin: 0 auto;
  background: #1e1e26;
  color: white;
  border-radius: 16px;
  overflow: hidden;
}

/* ── UI Panel ── */
.ui-panel {
  padding: 18px 20px 12px;
  background: #2a2a35;
}

.ui-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.ui-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.happiness-badge {
  font-size: 0.8rem;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  padding: 3px 10px;
  border-radius: 20px;
  color: #e0d8c8;
}

.controls {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #1e1e26;
  padding: 10px 14px;
  border-radius: 10px;
  flex-wrap: wrap;
}

.time-label {
  font-size: 0.85rem;
  color: #c8c0b0;
  white-space: nowrap;
  min-width: 70px;
}

input[type="range"] {
  flex-grow: 1;
  min-width: 120px;
  accent-color: #c8a050;
}

.solar-readout {
  margin: 0;
  font-size: 0.8rem;
  color: #a0987e;
  white-space: nowrap;
}

.instructions {
  margin: 8px 0 0;
  font-size: 0.78rem;
  color: #6a6478;
}

/* ── Room ── */
.room {
  position: relative;
  width: 100%;
  height: 400px;
  background: #e0d8c8;
  border-top: 6px solid #3a3542;
  border-bottom: 6px solid #3a3542;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.sky {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  z-index: 1;
}

.wall {
  display: flex;
  height: 50%;
  z-index: 2;
  border-bottom: 4px solid #8c7b6b;
}

.wall-segment {
  flex: 1;
  border-right: 2px solid #333;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255,255,255,0.10);
  transition: background 0.2s;
}
.wall-segment:hover { background: rgba(255,255,255,0.20); }
.wall-segment:last-child { border-right: none; }

.segment-content { font-size: 2.8rem; user-select: none; }

.solar {
  width: 80%;
  height: 80%;
  background: #111;
  border: 2px solid silver;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* ── Floor ── */
.floor {
  flex: 1;
  background: #8c7b6b;
  position: relative;
  z-index: 2;
}

/* Cozy rug — warm oval on the floor */
.floor-rug {
  position: absolute;
  bottom: 0;
  left: 18%;
  width: 46%;
  height: 68%;
  background: radial-gradient(
    ellipse at center,
    rgba(185, 105, 55, 0.48) 0%,
    rgba(155, 80, 35, 0.28) 55%,
    transparent 100%
  );
  border-radius: 50%;
  pointer-events: none;
}

/* Floor items — emoji positioned on the floor */
.floor-item {
  position: absolute;
  bottom: 8px;
  font-size: 2rem;
  user-select: none;
  pointer-events: none;
}

.floor-catbed { left: calc(52% - 1rem); font-size: 2.2rem; }
.floor-lamp   { left: calc(10% - 0.8rem); font-size: 2rem; }
.floor-plant  { left: calc(90% - 1.2rem); font-size: 2.5rem; }

/* ── Cats ── */
.cat-wrapper {
  position: absolute;
  bottom: 10px;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
  transition: transform 0.25s ease;
}

.cat-emoji {
  display: inline-block;
  font-size: 2.4rem;
  line-height: 1;
}

.cat-emoji.walking {
  animation: catBob 0.42s ease-in-out infinite alternate;
}

@keyframes catBob {
  from { transform: translateY(0px); }
  to   { transform: translateY(-5px); }
}

.cat-zzz {
  position: absolute;
  top: -18px;
  font-size: 0.9rem;
  animation: floatZzz 1.8s ease-in-out infinite;
  pointer-events: none;
}

@keyframes floatZzz {
  0%, 100% { opacity: 1;   transform: translateY(0px); }
  50%       { opacity: 0.5; transform: translateY(-6px); }
}

/* ── Canvas overlay ── */
.light-overlay {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  z-index: 3;
  pointer-events: none;
}

/* ── Homemaking Toolbar ── */
.homemaking-toolbar {
  display: flex;
  gap: 8px;
  padding: 14px 16px;
  background: #252530;
  flex-wrap: wrap;
  justify-content: center;
}

.hm-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 10px 14px;
  background: #2e2e3c;
  border: 1px solid #3e3e52;
  border-radius: 12px;
  cursor: pointer;
  color: white;
  transition: background 0.18s, border-color 0.18s;
  min-width: 78px;
  flex: 1;
  max-width: 120px;
}

.hm-btn:hover {
  background: #383850;
  border-color: #5a5a78;
}

.hm-btn.active {
  background: #3d3416;
  border-color: #c8a050;
}

.hm-icon  { font-size: 1.5rem; }
.hm-label { font-size: 0.72rem; font-weight: 600; letter-spacing: 0.05em; }
.hm-sub   { font-size: 0.62rem; color: #7a7490; }
.hm-btn.active .hm-sub { color: #c8a050; }

@media (max-width: 480px) {
  .hm-btn { min-width: 64px; padding: 8px 10px; }
  .hm-icon { font-size: 1.3rem; }
}
</style>
