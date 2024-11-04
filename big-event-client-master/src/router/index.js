import {
  createRouter,
  createWebHistory
} from 'vue-router'

const router = createRouter({
  history: createWebHistory(
    import.meta.env.BASE_URL),
  routes: [{
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/',
      name: 'layout',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Layout.vue'),
      redirect: '/article/manage',
      children: [{
          path: '/article/category',
          component: () => import('../views/article/ArticleCategory.vue')
        },
        {
          path: '/article/manage',
          component: () => import('../views/article/ArticleManage.vue')
        },
        {
          path: '/user/avatar',
          component: () => import('../views/user/UserAvatar.vue')
        },
        {
          path: '/user/info',
          component: () => import('../views/user/UserInfo.vue')
        },
        {
          path: '/user/resetPassword',
          component: () => import('../views/user/UserResetPassword.vue')
        }
      ]
    }
  ]
})

export default router