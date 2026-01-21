import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home/index.vue'),
  },
  {
    path: '/chart-example',
    name: 'ChartExample',
    component: () => import('@/views/ChartExample/index.vue'),
  },
  {
    path: '/advanced-search-example',
    name: 'AdvancedSearchExample',
    component: () => import('@/views/AdvancedSearchExample/index.vue'),
  },
  {
    path: '/new-example',
    name: 'NewExample',
    component: () => import('@/views/PhotoHalo/index.vue'),
  },
  {
    path: '/poker-carousel',
    name: 'PokerCarousel',
    component: () => import('@/views/PokerCarousel/index.vue'),
  },
  {
    path: '/bar-chart-example',
    name: 'BarChartExample',
    component: () => import('@/views/BarChartExample/index.vue'),
  },
  {
    path: '/animation',
    name: 'Animation',
    component: () => import('@/views/AnimationExample/index.vue'),
  },
  {
    path: '/mouse-anime',
    name: 'MouseAnime',
    component: () => import('../views/MouseAnime/index.vue'),
  },
  {
    path: '/dodge-button',
    name: 'DodgeButton',
    component: () => import('../views/DodgeButton/index.vue'),
  },
  {
    path: '/virtuallist',
    name: 'VirtualList',
    component: () => import('../views/VirtualList/index.vue'),
  },
  {
    path: '/dragtest',
    name: 'DragTest',
    component: () => import('../views/DragTest/index.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
