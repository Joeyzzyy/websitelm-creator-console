import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue';
import AssetsPage from '../components/AssetsPage.vue'
import SettingsPage from '../components/SettingsPage.vue'

const routes = [
  {
    path: '/login',
    name: 'LoginPage',
    component: () => import('../components/LoginPage.vue'),
  },
  {
    path: '/article-edit',
    name: 'ArticleEdit',
    component: () => import('../components/ArticleEditPage.vue'),
    meta: { hideNavigation: true }
  },
  {
    path: '/help-center',
    name: 'HelpCenter',
    component: () => import('../components/HelpCenterPage.vue'),
    meta: { hideNavigation: true }
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
        component: AssetsPage,
        meta: { requiresAuth: true }
      },
      {
        path: 'settings',
        name: 'Settings',
        component: SettingsPage,
        meta: { requiresAuth: true }
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
  }
];

export default createRouter({
  history: createWebHistory(),
  routes
});