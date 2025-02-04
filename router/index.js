import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue';
import SubscriptionPage from '../components/SubscriptionPage.vue';

const routes = [
  {
    path: '/login',
    name: 'LoginPage',
    component: () => import('../components/LoginPage.vue'),
  },
  {
    path: '/page-writer',
    name: 'ArticleCreate',
    component: () => import('../components/ArticleCreatePage.vue'),
    meta: { hideNavigation: true }
  },
  {
    path: '/help-center',
    name: 'HelpCenter',
    component: () => import('../components/HelpCenterPage.vue'),
    meta: { hideNavigation: true }
  },
  {
    path: '/auth/google/callback',
    name: 'GoogleCallback',
    component: () => import('../components/GoogleCallback.vue')
  },
  {
    path: '/',
    component: Home,
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../components/DashboardPage.vue') 
      },
      {
        path: 'assets',
        name: 'Assets',
        component: () => import('../components/AssetsPage.vue'),
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('../components/SettingsPage.vue'),
      },
      {
        path: 'keywords',
        name: 'KeywordsTopics',
        component: () => import('../components/KeywordsPlanningPage.vue')
      },
      {
        path: 'task-management',
        name: 'TaskManagement',
        component: () => import('../components/TaskManagementPage.vue')
      },
      {
        path: '',
        redirect: '/dashboard'
      }
    ]
  },
  {
    path: '/subscription',
    name: 'Subscription',
    component: SubscriptionPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/payment-success',
    name: 'PaymentSuccess',
    component: () => import('../components/PaymentSuccess.vue'),
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Add navigation guard
router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('intelickIsLoggedIn');
  
  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login');
  } else {
    next();
  }
});

export default router;