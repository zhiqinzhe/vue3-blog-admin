import request from '@/utils/request';

export function fetchList(params) {
  return request({
    url: '/admin/article/list',
    method: 'get',
    params,
  });
}