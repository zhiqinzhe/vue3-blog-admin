import { defineStore } from 'pinia';
import { fetchUserInfo } from '@/api/user';
import { asyncRoutes } from '@/router';

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
      this.token = res;
    },
    setRoles(res) {
      this.roles = res;
    },
    async getUserInfo() {
      try {
        const { data } = await fetchUserInfo();
        this.setUserInfo(data);
        this.setRoles(data.roles);
        return data;
      } catch (error) {
        console.log(error);
        return [];
      }
    },
    generateAsyncRoutes(roles) {
      // 比较两数组是否有交集(返回true代表有交集)
      const hasMixin = (a, b) => {
        return a.length + b.length !== new Set([...a, ...b]).size;
      };
      const myRole = roles.map((v) => v.role_name);
      const handleAsyncRoutes = (roleRoutes) => {
        const deepFind = (tree) => {
          const newRoutes = tree.filter((v) => {
            if (v.meta && v.meta.roles) {
              const hasRole = hasMixin(v.meta.roles, myRole);
              if (hasRole) {
                return true;
              }
              return false;
            }
            return true;
          });
          newRoutes.forEach((v) => {
            if (v.children) {
              v.children = deepFind(v.children);
            }
          });
          return newRoutes;
        };

        return deepFind(roleRoutes);
      };
      return handleAsyncRoutes(asyncRoutes);
    },
  },
});
