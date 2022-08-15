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
        path: '/radio',
        name: 'Radio',
        component: () => import('../views/Radio.vue')
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
    },
    {
        path: '/artist/:query',
        name: 'Artist',
        component: () => import('../views/elements/Artist.vue')
    },
    {
        path: '/playlist/:query',
        name: 'Playlist',
        component: () => import('../views/elements/Playlist.vue')
    },
    {
        path: '/profile/:query',
        name: 'Profile',
        component: () => import('../views/elements/Profile.vue')
    }
]
const router = createRouter({
    history: createWebHistory(),
    routes,
})
export default router
