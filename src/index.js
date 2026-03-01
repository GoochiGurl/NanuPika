import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Art from '../views/Art.vue'
import Travel from '../views/Travel.vue'
import Games from '../views/Games.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/art', name: 'Art', component: Art },
  { path: '/travel', name: 'Travel', component: Travel },
  { path: '/games', name: 'Games', component: Games },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
