import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'
import { setupPageGuard } from './permission'
import { ChatLayout } from '@/views/chat/layout'
import MainLayout from '@/views/main/MainLayout.vue'
import Login from '@/views/login/login.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/',
    name: 'Root',
    component: MainLayout,
    redirect: '/chat',
    children: [
      {
        path: '/chatLayout',
        name: 'ChatLayout',
        component: ChatLayout,
        children: [{
          path: '/chat/:uuid?',
          name: 'Chat',
          component: () => import('@/views/chat/index.vue'),
          meta: { requiresAuth: true },
        }],
      },
      {
        path: '/settings',
        name: 'Settings',
        component: () => import('@/views/settings/index.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/botSettings',
        name: 'BotSettings',
        component: () => import('@/views/bot-settings/index.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/user',
        name: 'User',
        component: () => import('@/views/user/index.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/exception/404/index.vue'),
  },

  {
    path: '/500',
    name: '500',
    component: () => import('@/views/exception/500/index.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    redirect: '/404',
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

setupPageGuard(router)

export async function setupRouter(app: App) {
  app.use(router)
  await router.isReady()
}
