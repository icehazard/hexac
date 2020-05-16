import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

  const routes = [
    {
      path: '/',
      name: 'community',
      component: () => import('../views/Community.vue')
    },
    {
      path: '/comments',
      name: 'comments',
      component: () => import('../views/Comments.vue')
    },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/Profile.vue')
  },
  {
    path: '*',
    name: 'catchAll',
    component: Home
 }
]

const router = new VueRouter({
  //mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior () {
    return { x: 0, y: 0 }
  },
})

export default router
