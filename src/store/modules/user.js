import { login, logout, getInfo } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
//引入异步路由，常量路由，任意路由
//分别暴露
import { resetRouter, asyncRoutes, constantRoutes, anyRoutes } from "@/router";
//默认暴露
import router from "@/router";
//引进loadash插件，进行深度拷贝
import cloneDeep from "lodash/cloneDeep";
const getDefaultState = () => {
  return {
    token: getToken(),
    name: "",
    avatar: "",
    routes: [],
    buttons: [],
    roles: [],
    resultAsyncRoutes: [],
    resultAllRoutes: [],
  };
};

const state = getDefaultState();

const mutations = {
  //合并清空对象，即清空仓库内的token字段
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  //存储用户信息
  SET_USERINFO: (state, userInfo) => {
    //用户名
    state.name = userInfo.name;
    //用户头像
    state.avatar = userInfo.avatar;
    //菜单权限标记
    state.routes = userInfo.routes;
    //按钮权限标记
    state.buttons = userInfo.buttons;
    //角色
    state.roles = userInfo.roles;
  },

  SET_RESULTASYNCROUTES: (state, asyncRoutes) => {
    //最终计算出要显示的异步路由
    state.resultAsyncRoutes = asyncRoutes;
    //所有要显示的路由
    state.resultAllRoutes = constantRoutes.concat(
      state.resultAsyncRoutes,
      anyRoutes
    );
    //给路由器添加路由，重置路由
    router.addRoutes(state.resultAllRoutes);
  },
};

//这里的筛选，他是从外由内的筛选，但是这样会出现bug，就是当该角色有一个
//商品管理或者权限管理的一个子集的时候，此时就筛选不到该子集了，这时
//在页面外观也就展示不出来了，应该从内由外的筛选比较合理，怎么实现，不知道。。。待他日
//定义一个函数：两个数组进行对比，对比出当前用户到底显示哪些异步路由
//这里使用了递归原理，进行筛选
const computedAsyncRoutes = (asyncRoutes, routes) => {
  //filter函数是会返回一个新的数组的，item其实就是一个新的对象了，
  //于原数组无关系了
  return asyncRoutes.filter((item) => {
    if (routes.indexOf(item.name) != -1) {
      if (item.children && item.children.length) {
        item.children = computedAsyncRoutes(item.children, routes);
      }
      return true;
    }
  });
};
const actions = {
  // user login
  //这里的login作为action的一个属性，为action.login,所以不会和
  //接口函数login起冲突
  async login({ commit }, userInfo) {
    const { username, password } = userInfo;
    const result = await login({ username: username.trim(), password });
    if (result.code === 20000) {
      const { data } = result;
      //起初初始化的时候函数执行，得到的是null，后来请求得到后立马给vuex存储token
      //此后token过期之前，仓库的token都是从函数执行后从本地获得
      commit("SET_TOKEN", data.token);
      //本地持久化存储token，这里用了cookie
      setToken(data.token);
      return "ok";
    } else {
      //这里是除了20000或者200情况之外的情况处理
      //当然失败的状况在响应拦截器那里已经做了统一的处理了
      //这里就不用处理，一个个处理了，效率提高
      //抛出一个错误，让对面的去捕获即可
      return Promise.reject(new Error("Fail to login!"));
    }
  },

  // get user info
  //这里是action.getInfo不会跟下面的getInfo产生冲突
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then((response) => {
          //获取用户信息:返回数据包含：用户名name、
          // 用户头像avatar、routes
          // [返回的标志:不同的用户应该展示哪些菜单的标记]、
          // roles（用户角色信息）、buttons【按钮的信息：按钮权限用的标记】
          const { data } = response;

          //vuex存储用户全部的信息
          commit("SET_USERINFO", data);
          commit(
            "SET_RESULTASYNCROUTES",
            //这里为什么进行深拷贝？？其实直接赋值也可以
            computedAsyncRoutes(cloneDeep(asyncRoutes), data.routes)
          );
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          removeToken(); // must remove  token  first
          resetRouter();
          commit("RESET_STATE");
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      // 清除本地的token
      removeToken(); // must remove  token  first
      //然后再清除仓库的token
      commit("RESET_STATE");
      resolve();
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
