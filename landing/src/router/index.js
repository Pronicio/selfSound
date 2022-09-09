const routes = [
    {
        path: "/",
        alias: ['/:catchAll(.*)'],
        component: () => import('../pages/Home.vue')
    },
    {
        path: "/login",
        component: () => import('../pages/Login.vue')
    },
]

export default routes
