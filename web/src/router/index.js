import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    { path: '/:catchAll(.*)', redirect: '/' },
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue')
    },
    {
        path: '/search',
        name: 'Search',
        component: () => import('../views/Search.vue')
    }
]
const router = createRouter({
    history: createWebHistory(),
    routes,
})
export default router
