import { createRouter, createWebHistory } from 'vue-router'
import Home from './Home.vue'

// 1. Define your routes
const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/Games',
    name: 'Games',
    component: () => import('./Games.vue')
  },
  {
    path: '/art',
    name: 'art',
    component: () => import('./Art.vue'),
    props: true
  },
  {
    path: '/travel',
    name: 'travel',
    component: () => import('./Travel.vue'),
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
