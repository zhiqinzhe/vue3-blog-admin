import { InfiniteOutline } from '@vicons/ionicons5';

import { renderIcon } from '../utils';

import type { RouteRecordRaw } from 'vue-router';

import { ROUTE_SORT } from '@/constant';
import Layout from '@/layout/index.vue';

// 异步路由
export const routes: RouteRecordRaw[] = [
  {
    name: 'link',
    path: '/link',
    component: Layout,
    meta: {
      title: '友链管理',
      icon: renderIcon(InfiniteOutline),
      sort: ROUTE_SORT.link,
    },
    children: [
      {
        name: 'linkList',
        path: '/link/list',
        component: () => import('@/views/link/list/index.vue'),
        meta: {
          title: '友链列表',
        },
      },
      {
        name: 'addLink',
        path: '/link/add',
        component: () => import('@/views/link/add/index.vue'),
        meta: {
          title: '添加友链',
          roles: ['ALL_ROLE', 'SUPER_ADMIN'],
        },
      },
    ],
  },
];