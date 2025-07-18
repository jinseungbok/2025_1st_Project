import { createRouter, createWebHistory } from 'vue-router';
import memoRoutes from './memo.routes';
import diaryRoutes from './diary.routes';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue'),
  },
  ...memoRoutes,
  ...diaryRoutes,
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  });

export default router;