import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue')
  },
  { path: '/chart-example',
    name: 'ChartExample',
    component: () => import('@/views/ChartExample.vue') 
  },
  { path: '/advanced-search-example',
    name: 'AdvancedSearchExample',
    component: () => import('@/views/AdvancedSearchExample.vue')
  },
  { 
    path: '/virtual-column-example',
    name: 'VirtualColumnExample',
    component: () => import('@/views/VirtualColumnExample.vue')
  },
  { path: '/new-example', name: 'NewExample', component: () => import('@/views/NewExamplePage.vue') },
  { path: '/poker-carousel', name: 'PokerCarousel', component: () => import('@/views/PokerCarousel.vue') },
  {
    path: '/bar-chart-example',
    name: 'BarChartExample',
    component: () => import('@/views/BarChartExample.vue')
  },
  {
    path: '/animation',
    name: 'Animation',
    component: () => import('@/views/AnimationExample/AnimationExample.vue')
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

 export default router;