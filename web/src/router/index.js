import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    { path: '/:catchAll(.*)', redirect: '/' },
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue')
    },
    {
        path: '/discover',
        name: 'Discover',
        component: () => import('../views/Discover.vue')
    }
]
const router = createRouter({
    history: createWebHistory(),
    routes,
})
export default router
