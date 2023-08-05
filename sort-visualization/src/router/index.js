import { createRouter, createWebHistory } from "vue-router"
const routes = [
    {
        path: '/',
        name: 'userpage',
        component: () => import('../view/userpage.vue')
    }
]
const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router

