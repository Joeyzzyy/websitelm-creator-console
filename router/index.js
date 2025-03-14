import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue';
import SubscriptionPage from '../components/SubscriptionPage.vue';

const routes = [
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('../components/Auth.vue'),
    meta: { hideNavigation: true }
  },
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
        path: 'analytics',
        name: 'Analytics',
        component: () => import('../components/AnalyticsPage.vue')
      },
      {
        path: 'product-assets',
        name: 'ProductAssets',
        component: () => import('../components/AssetsPage.vue'),
      },
      {
        path: 'keywords',
        name: 'KeywordsTopics',
        component: () => import('../components/KeywordsPlanningPage.vue')
      },
      {
        path: 'outlines',
        name: 'OutlinePlanning',
        component: () => import('../components/OutlinePlanningPage.vue')
      },
      {
        path: 'task-management',
        name: 'TaskManagement',
        component: () => import('../components/TaskManagementPage.vue')
      },
      {
        path: 'account',
        name: 'Account',
        component: () => import('../components/AccountPage.vue'),
      },
      {
        path: '',
        redirect: '/keywords'
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
  },
  {
    path: '/onboarding',
    name: 'Onboarding',
    component: () => import('../components/OnboardingPage.vue'),
    meta: { 
      requiresAuth: true,
      hideNavigation: true
    }
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