import request from '@/utils/request';

export function fetchList(params) {
  return request({
    url: '/admin/role/list',
    method: 'get',
    params,
  });
}