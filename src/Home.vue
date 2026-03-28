<template>
  <div class="home">

    <!-- ====== HERO ====== -->
    <section class="hero">
      <div class="hero-inner section-container">
        <div class="hero-text">
          <p class="hero-kicker" ref="kicker">Leader · Ceramicist · Coastal Wanderer</p>
          <h1 class="hero-title" ref="title">
            <span class="hero-line">Courtney</span>
            <span class="hero-line hero-line--accent">Gooch</span>
          </h1>
          <div class="hero-organic-line" ref="orgLine"></div>
        </div>
        <div class="hero-links" ref="heroLinks">
          <router-link to="/art" class="hero-link-pill">Art</router-link>
          <router-link to="/travel" class="hero-link-pill">OC Guide</router-link>
          <router-link to="/games" class="hero-link-pill">Games</router-link>
          <a href="#about" class="hero-link-pill">About Me</a>
        </div>
      </div>
      <!-- Decorative coastal wave -->
      <svg class="hero-wave" viewBox="0 0 1440 120" preserveAspectRatio="none">
        <path d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,70 1440,60 L1440,120 L0,120 Z" fill="var(--sand-light)" opacity="0.5"/>
        <path d="M0,80 C320,30 640,110 960,60 C1120,35 1300,80 1440,70 L1440,120 L0,120 Z" fill="var(--sand-light)"/>
      </svg>
    </section>

    <hr class="section-divider" />

    <!-- ====== ABOUT ====== -->
    <section class="about-section section-container" id="about">
      <div class="about-grid">
        <div class="about-photo-wrap">
          <div class="about-photo organic-card">
            <img :src="imgSpunky" alt="Courtney Gooch" class="about-img" />
          </div>
          <div class="about-photo organic-card about-photo--secondary">
            <img :src="imgVacation" alt="Courtney Gooch" class="about-img" />
          </div>
        </div>
        <div class="about-content">
          <h2 class="section-title">About Me</h2>
          <p class="about-bio">
            I’m a solar industry leader with more than a decade of experience building and scaling operations that power growth. I currently serve as Senior Director of Operations Effectiveness at the nation’s leading residential solar company, where I also act as Chief of Staff to the COO. My work sits at the intersection of strategy and execution — translating big ideas into systems, programs, and teams that deliver results.
          </p>
          <p class="about-bio">
            Over the course of my career, I’ve led initiatives across training, technology, and large-scale operational transformation. But more than processes or programs, my focus has always been people. I’m particularly passionate about leadership that works in the real world — practical, human-centered approaches that help teams grow, navigate change, and perform at a high level. Whether I’m building programs, leading teams, or advising executives, my goal is the same: create clarity, unlock potential, and drive meaningful progress.
          </p>
          <p class="about-bio">
            Outside of work, I spend my time throwing clay in the pottery studio, experimenting with new recipes, and chasing sunsets.
          </p>
          <p class="about-bio">
            Welcome to my corner of the coast.
          </p>

          <div class="about-social-links">
            <a href="https://substack.com" target="_blank" class="hero-link-pill">Substack</a>
            <a href="https://instagram.com/saltysweetoc" target="_blank" class="hero-link-pill">Instagram</a>
          </div>
        </div>
      </div>
    </section>

    <hr class="section-divider" />

    <!-- ====== MEDIA ====== -->
    <section class="media-section section-container">
      <h2 class="section-title" style="text-align:center;">Media</h2>
      <div class="carousel-container" ref="mediaCarousel" @scroll="onCarouselScroll">
        <div class="carousel-spacer"></div>
        <a v-for="item in mediaItems" :key="item.title" :href="item.url" target="_blank"
           class="media-card organic-card carousel-item">
          <span class="media-type">{{ item.type }}</span>
          <h3 class="media-title">{{ item.title }}</h3>
          <p class="media-desc">{{ item.description }}</p>
          <span class="media-arrow">→</span>
        </a>
        <div class="carousel-spacer"></div>
      </div>
    </section>

    <hr class="section-divider" />

    <!-- ====== RESUME ====== -->
    <section class="resume-section section-container">
      <h2 class="section-title" style="text-align:center;">Resume</h2>
      <div class="carousel-container" ref="resumeCarousel" @scroll="onCarouselScroll">
        <div class="carousel-spacer"></div>
        
        <div class="resume-card organic-card carousel-item" v-for="exp in experience" :key="exp.role">
           <h3 class="resume-category">Experience</h3>
           <span class="resume-dates">{{ exp.dates }}</span>
           <h4 class="resume-role">{{ exp.role }}</h4>
           <p class="resume-org">{{ exp.org }}</p>
        </div>
        
        <div class="resume-card organic-card carousel-item" v-for="edu in education" :key="edu.degree">
           <h3 class="resume-category">Education</h3>
           <span class="resume-dates">{{ edu.dates }}</span>
           <h4 class="resume-role">{{ edu.degree }}</h4>
           <p class="resume-org">{{ edu.school }}</p>
        </div>
        
        <div class="resume-card organic-card carousel-item">
           <h3 class="resume-category">Skills</h3>
           <div class="skills-wrap">
             <span v-for="skill in skills" :key="skill" class="skill-tag">{{ skill }}</span>
           </div>
        </div>

        <div class="carousel-spacer"></div>
      </div>
    </section>

    <hr class="section-divider" />    <!-- ====== MEET THE FAM ====== -->
    <section class="fam-section section-container">
      <h2 class="section-title" style="text-align:center;">Meet the Fam</h2>
      <p style="text-align:center; opacity:0.6; margin-bottom:40px;">The real stars of the show.</p>
      <div class="fam-grid">
        <div class="fam-card organic-card" v-for="cat in cats" :key="cat.name">
          <div class="fam-photo">
            <img :src="cat.img" :alt="cat.name" class="cat-photo" />
          </div>
          <h3 class="fam-name">{{ cat.name }}</h3>
          <p class="fam-desc">{{ cat.desc }}</p>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import imgSpunky  from './assets/Public/Spunky.jpg'
import imgVacation from './assets/Public/Vacation.jpg'
import imgNanu    from './assets/Public/Nanu.jpeg'
import imgPika    from './assets/Public/Pika.jpeg'

const mediaCarousel = ref(null)
const resumeCarousel = ref(null)

function onCarouselScroll(e) {
  const container = e.target
  const rect = container.getBoundingClientRect()
  const centerY = rect.top + rect.height / 2
  
  const items = container.querySelectorAll('.carousel-item')
  items.forEach(child => {
    const childRect = child.getBoundingClientRect()
    const childCenterY = childRect.top + childRect.height / 2
    const dist = Math.abs(centerY - childCenterY)
    
    // Normalize mapping (0 at center, 1 at edge of container)
    let normalized = Math.min(dist / (rect.height / 2), 1)
    
    // Physics easing
    let ease = Math.pow(normalized, 1.25)
    
    // Apply transform: scale down and fade out when not centered
    const scale = 1 - (ease * 0.15)
    const opacity = 1 - (ease * 0.75)
    
    child.style.transform = `scale(${scale})`
    child.style.opacity = opacity.toFixed(3)
  })
}

onMounted(async () => {
  await nextTick()
  if (mediaCarousel.value) onCarouselScroll({ target: mediaCarousel.value })
  if (resumeCarousel.value) onCarouselScroll({ target: resumeCarousel.value })
})

const mediaItems = [
  {
    type: 'Interview',
    title: 'FairyGodBoss',
    description: 'Women in the Workplace: Insights From Successful Leaders',
    url: 'https://fairygodboss.com/events/BIQGMptEZ/women-in-the-workplace-insights'
  },
]

const experience = [
  { role: 'Studio Ceramicist', org: 'Independent Practice', dates: '2021 – Present' },
]

const education = [
  { degree: 'Associates, Interior Architecture', school: 'Interior Designers Institute', dates: '2012' },
]

const skills = [
  'Wheel Throwing', 'Hand Building', 'Raku Firing', 'Glaze Chemistry',
  'Community Building', 'Program Design', 'Content Strategy', 'Photography'
]

const cats = [
  { name: 'Nanu', img: imgNanu, desc: 'The dignified one. Prefers high places, morning sun, and judging humans.' },
  { name: 'Pika', img: imgPika, desc: 'The chaos agent. Knocks things off tables with zero remorse and endless charm.' }
]
</script>

<style scoped>
/* ====== HERO ====== */
.hero {
  position: relative;
  min-height: 85vh;
  display: flex;
  align-items: center;
  padding: 80px 0 120px;
  overflow: hidden;
  background: linear-gradient(160deg, var(--periwinkle-soft) 0%, var(--sand-light) 40%, var(--sea-foam) 100%);
}

.hero-inner {
  position: relative;
  z-index: 1;
}

.hero-kicker {
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 400;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--driftwood-dark);
  margin-bottom: 20px;
  animation: fadeUp 0.8s var(--ease-out-expo) both;
}

.hero-title {
  font-family: var(--font-display);
  font-weight: 300;
  font-size: clamp(3.5rem, 10vw, 8rem);
  line-height: 0.95;
  letter-spacing: -0.03em;
  color: var(--charcoal);
}

.hero-line {
  display: block;
  animation: fadeUp 0.8s var(--ease-out-expo) both;
  animation-delay: 0.15s;
}

.hero-line--accent {
  color: var(--periwinkle-deep);
  font-style: italic;
  animation-delay: 0.3s;
}

.hero-organic-line {
  width: 80px;
  height: 3px;
  margin-top: 32px;
  background: var(--periwinkle-muted);
  border-radius: 3px;
  animation: fadeUp 0.8s var(--ease-out-expo) both;
  animation-delay: 0.45s;
}

.hero-links {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 48px;
  animation: fadeUp 0.8s var(--ease-out-expo) both;
  animation-delay: 0.6s;
}

.hero-link-pill {
  display: inline-block;
  padding: 10px 24px;
  font-size: 0.85rem;
  font-weight: 400;
  letter-spacing: 0.03em;
  border: 1.5px solid var(--periwinkle-muted);
  border-radius: 100px;
  color: var(--charcoal);
  transition: all 0.3s var(--ease-out-soft);
  background: rgba(255,255,255,0.3);
  backdrop-filter: blur(4px);
}

.hero-link-pill:hover {
  background: var(--periwinkle);
  border-color: var(--periwinkle);
  color: var(--ink);
  transform: translateY(-2px);
}

.hero-wave {
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 120px;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ====== BIO ====== */
.about-grid {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 60px;
  align-items: start;
}

.about-photo-wrap {
  position: sticky;
  top: calc(var(--nav-height) + 24px);
}

.about-photo {
  overflow: hidden;
  padding: 0;
}

.about-img {
  width: 100%;
  display: block;
  object-fit: cover;
  aspect-ratio: 3/4;
  border-radius: 20px;
}

.about-photo--secondary {
  margin-top: 16px;
  transform: translateX(12px);
}

.about-bio {
  font-size: 1.05rem;
  line-height: 1.8;
  margin-bottom: 16px;
  color: var(--driftwood-dark);
}

.about-social-links {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

@media (max-width: 768px) {
  .about-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .about-photo-wrap {
    position: static;
    max-width: 280px;
    margin: 0 auto;
  }
}

/* ====== EXPANDABLE SECTIONS ====== */
.expand-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 0;
  cursor: pointer;
}

.expand-header .section-title {
  margin-bottom: 0;
}

.expand-icon {
  transition: transform 0.4s var(--ease-out-expo);
  color: var(--driftwood);
}
.expand-icon.open {
  transform: rotate(180deg);
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.5s var(--ease-out-expo);
  overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-8px);
}
.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 2000px;
}

.expand-body {
  padding-top: 32px;
}

/* ====== MEDIA CARDS ====== */
.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.media-card {
  display: flex;
  flex-direction: column;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.4s var(--ease-out-expo);
}

.media-card:hover {
  border-color: var(--periwinkle-muted);
}

.media-type {
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--periwinkle-deep);
  margin-bottom: 8px;
}

.media-title {
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 400;
  margin-bottom: 8px;
}

.media-desc {
  font-size: 0.88rem;
  line-height: 1.6;
  color: var(--driftwood-dark);
  flex: 1;
}

.media-arrow {
  margin-top: 16px;
  font-size: 1.2rem;
  color: var(--periwinkle-deep);
  transition: transform 0.3s;
}

.media-card:hover .media-arrow {
  transform: translateX(6px);
}

/* ====== RESUME ====== */
.resume-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
}

@media (max-width: 600px) {
  .resume-grid { grid-template-columns: 1fr; }
}

.resume-category {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--periwinkle-deep);
  margin-bottom: 20px;
  letter-spacing: 0.02em;
}

.resume-item {
  margin-bottom: 24px;
  padding-left: 16px;
  border-left: 2px solid var(--periwinkle-soft);
}

.resume-dates {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--driftwood);
}

.resume-role {
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 400;
  margin: 4px 0 2px;
}

.resume-org {
  font-size: 0.88rem;
  color: var(--driftwood-dark);
}

.skills-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag {
  padding: 6px 16px;
  font-size: 0.8rem;
  border-radius: 100px;
  background: var(--periwinkle-soft);
  color: var(--charcoal);
  letter-spacing: 0.02em;
}

/* ====== ABOUT ====== */
.about-grid {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 60px;
  align-items: start;
}

.about-photo-wrap {
  position: sticky;
  top: calc(var(--nav-height) + 24px);
}

.about-photo {
  overflow: hidden;
  padding: 0;
}

.about-img {
  width: 100%;
  display: block;
  object-fit: cover;
  aspect-ratio: 3/4;
  border-radius: 20px;
}

.about-photo--secondary {
  margin-top: 16px;
  transform: translateX(12px);
}

.about-bio {
  font-size: 1.05rem;
  line-height: 1.8;
  margin-bottom: 16px;
  color: var(--driftwood-dark);
}

@media (max-width: 768px) {
  .about-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .about-photo-wrap {
    position: static;
    max-width: 280px;
    margin: 0 auto;
  }
}

/* ====== EXPANDABLE SECTIONS ====== */
.expand-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 0;
  cursor: pointer;
}

.expand-header .section-title {
  margin-bottom: 0;
}

.expand-icon {
  transition: transform 0.4s var(--ease-out-expo);
  color: var(--driftwood);
}
.expand-icon.open {
  transform: rotate(180deg);
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.5s var(--ease-out-expo);
  overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-8px);
}
.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 2000px;
}

.expand-body {
  padding-top: 32px;
}

/* ====== MEDIA CARDS ====== */
.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.media-card {
  display: flex;
  flex-direction: column;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.4s var(--ease-out-expo);
}

.media-card:hover {
  border-color: var(--periwinkle-muted);
}

.media-type {
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--periwinkle-deep);
  margin-bottom: 8px;
}

.media-title {
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 400;
  margin-bottom: 8px;
}

.media-desc {
  font-size: 0.88rem;
  line-height: 1.6;
  color: var(--driftwood-dark);
  flex: 1;
}

.media-arrow {
  margin-top: 16px;
  font-size: 1.2rem;
  color: var(--periwinkle-deep);
  transition: transform 0.3s;
}

.media-card:hover .media-arrow {
  transform: translateX(6px);
}

/* ====== RESUME ====== */
.resume-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
}

@media (max-width: 600px) {
  .resume-grid { grid-template-columns: 1fr; }
}

.resume-category {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--periwinkle-deep);
  margin-bottom: 20px;
  letter-spacing: 0.02em;
}

.resume-item {
  margin-bottom: 24px;
  padding-left: 16px;
  border-left: 2px solid var(--periwinkle-soft);
}

.resume-dates {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--driftwood);
}

.resume-role {
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 400;
  margin: 4px 0 2px;
}

.resume-org {
  font-size: 0.88rem;
  color: var(--driftwood-dark);
}

.skills-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag {
  padding: 6px 16px;
  font-size: 0.8rem;
  border-radius: 100px;
  background: var(--periwinkle-soft);
  color: var(--charcoal);
  letter-spacing: 0.02em;
}

/* ====== MEET THE FAM ====== */
.fam-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 32px;
  max-width: 640px;
  margin: 0 auto;
}

.fam-card {
  text-align: center;
}

.fam-photo {
  margin-bottom: 20px;
}

.cat-photo {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  object-position: center top;
  margin: 0 auto;
  display: block;
  border: 3px solid var(--periwinkle-soft);
}

.fam-name {
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 400;
  margin-bottom: 8px;
  font-style: italic;
}

.fam-desc {
  font-size: 0.9rem;
  color: var(--driftwood-dark);
  line-height: 1.6;
}
</style>
