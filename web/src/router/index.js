import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/:catchAll(.*)',
        component: () => import('../views/404.vue')
    },
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue')
    },
    {
        path: '/search/:query',
        name: 'Search',
        component: () => import('../views/Search.vue')
    },
    {
        path: '/album/:query',
        name: 'Album',
        component: () => import('../views/elements/Album.vue')
    }
]
const router = createRouter({
    history: createWebHistory(),
    routes,
})
export default router
