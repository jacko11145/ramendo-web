import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/DefaultLayout.vue'),
      children: [
        { path: '', name: 'home', component: () => import('@/views/HomeView.vue') },
        { path: 'ramen-shops', name: 'shop-list', component: () => import('@/views/ShopListView.vue') },
        { path: 'ramen-shops/:guid', name: 'shop-detail', component: () => import('@/views/ShopDetailView.vue') },
        { path: 'rankings', name: 'rankings', component: () => import('@/views/RankingsView.vue') },
        {
          path: 'user',
          meta: { requiresAuth: true },
          children: [
            { path: 'dashboard', name: 'dashboard', component: () => import('@/views/user/DashboardView.vue') },
            { path: 'submit-shop', name: 'submit-shop', component: () => import('@/views/user/SubmitShopView.vue') },
          ],
        },
      ],
    },
    {
      path: '/auth',
      component: () => import('@/layouts/AuthLayout.vue'),
      meta: { guestOnly: true },
      children: [
        { path: 'login', name: 'login', component: () => import('@/views/auth/LoginView.vue') },
        { path: 'register', name: 'register', component: () => import('@/views/auth/RegisterView.vue') },
      ],
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior(_, __, savedPosition) {
    return savedPosition ?? { top: 0 }
  },
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.meta.guestOnly && auth.isLoggedIn) {
    return { name: 'home' }
  }
})

export default router
