import { createRouter, createWebHistory,createWebHashHistory } from "vue-router"
const routes = [
    {
        path: '/',
        name: 'userpage',
        component: () => import('../view/userpage.vue')
    }
]
const router = createRouter({
    //history: createWebHistory(),
    //history: process.env.IS_ELECTRON ? createWebHashHistory() : createWebHistory(),
    history: createWebHashHistory(),
    routes
})


export default router

