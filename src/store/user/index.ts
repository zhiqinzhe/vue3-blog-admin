import { defineStore } from 'pinia';

import { fetchEmailCodeLogin, fetchRegister } from '@/api/emailUser';
import { fetchLogin, fetchUserInfo } from '@/api/user';
import { asyncRoutes } from '@/router';
import { deepClone } from '@/utils';
import cache from '@/utils/cache';

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      userInfo: null,
      token: null,
      roles: null,
    };
  },
  actions: {
    setUserInfo(res) {
      this.userInfo = res;
    },
    setToken(res) {
      cache.setStorage('token', res);
      this.token = res;
    },
    setRoles(res) {
      this.roles = res;
    },
    logout() {
      cache.clearStorage('token');
      this.token = null;
      this.userInfo = null;
      this.roles = null;
    },
    async pwdLogin({ id, password }) {
      try {
        const { data: token } = await fetchLogin({
          id,
          password,
        });
        this.setToken(token);
        return token;
      } catch (error: any) {
        // 错误返回401，全局的响应拦截会打印报错信息
        return null;
      }
    },
    async codeLogin({ email, code }) {
      try {
        const { data: token } = await fetchEmailCodeLogin({
          email,
          code,
        });
        this.setToken(token);
        return token;
      } catch (error: any) {
        // 错误返回401，全局的响应拦截会打印报错信息
        return null;
      }
    },
    async register({ email, code }) {
      try {
        // @ts-ignore
        const { data: token } = await fetchRegister({
          email,
          code,
        });
        this.setToken(token);
        return { token };
      } catch (error: any) {
        window.$message.error(error.message);
        return error;
      }
    },
    async getUserInfo() {
      try {
        const { code, data }: any = await fetchUserInfo();
        this.setUserInfo(data);
        this.setRoles(data.roles);
        console.log(code, data);
        return { code, data };
      } catch (error) {
        return error;
      }
    },
    generateAsyncRoutes(roles) {
      console.log('generateAsyncRoutesgenerateAsyncRoutes', asyncRoutes, roles);
      // 比较两数组是否有交集(返回true代表有交集)
      const hasMixin = (a, b) => {
        return a.length + b.length !== new Set([...a, ...b]).size;
      };
      const myRole = roles.map((v) => v.role_name);
      const handleAsyncRoutes = (roleRoutes) => {
        console.log('roleRoutes', myRole, roleRoutes);
        const deepFind = (route) => {
          const res: any[] = [];
          route.forEach((v) => {
            const t = { ...v };
            if (t.meta && t.meta.roles) {
              const hasRole = hasMixin(t.meta.roles, myRole);
              hasRole && res.push(t);
            } else {
              res.push(t);
            }
            if (t.children) {
              t.children = deepFind(t.children);
            }
          });
          return res;
        };
        const res = deepFind(roleRoutes);
        console.log(res, 2221);

        return res;
      };
      const a = handleAsyncRoutes(asyncRoutes);
      console.log(a, 'aaaaaaaaaaaa');
      return a;
    },
  },
});
