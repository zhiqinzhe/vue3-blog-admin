import request from '@/utils/request';

export function fetchList(params) {
  return request({
    url: '/api/github_user/list',
    method: 'get',
    params,
  });
}