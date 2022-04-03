import request from '@/utils/request';

// github列表
export function fetchList(params) {
  return request({
    url: '/api/github_user/list',
    method: 'get',
    params,
  });
}

// github登录
export function fetchGithubLogin(code: any) {
  return request({
    url: `/api/github_user/login`,
    method: 'post',
    data: { code },
  });
}

// 绑定github
export function fetchBindGithub(code: any) {
  return request({
    url: `/api/github_user/bind_github`,
    method: 'post',
    data: { code },
  });
}

// 取消绑定github
export function fetchCancelBindGithub() {
  return request({
    url: `/api/github_user/cancel_bind_github`,
    method: 'post',
  });
}
