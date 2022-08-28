import { PricetagsOutline } from '@vicons/ionicons5';

import { renderIcon } from '../utils';

import type { RouteRecordRaw } from 'vue-router';

import Layout from '@/layout/index.vue';

// 异步路由
export const routes: RouteRecordRaw[] = [
  {
    name: 'tag',
    path: '/tag',
    component: Layout,
    meta: {
      title: '标签管理',
      icon: renderIcon(PricetagsOutline),
      sort: 30,
    },
    children: [
      {
        name: 'tagList',
        path: '/tag/list',
        component: () => import('@/views/tag/list/index.vue'),
        meta: {
          title: '标签列表',
        },
      },
      {
        name: 'addTag',
        path: '/tag/add',
        component: () => import('@/views/tag/add/index.vue'),
        meta: {
          title: '添加标签',
          roles: ['ALL_ROLE', 'SUPER_ADMIN'],
        },
      },
    ],
  },
];
