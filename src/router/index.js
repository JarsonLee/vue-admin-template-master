import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */

//常量路由:就是不管用户是什么角色，都可以看见的路由
//什么角色（超级管理员，普通员工）：登录、404、首页
export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
  },

  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true,
  },

  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index"),
        meta: { title: "首页", icon: "dashboard" },
      },
    ],
  },
];

//异步路由:不同的用户（角色），需要过滤筛选出的路由，称之为异步路由
//有的用户可以看见测试管理、有的看不见
export const asyncRoutes = [
  {
    name: "Acl",
    path: "/acl",
    component: Layout,
    redirect: "/acl/user/list",
    meta: {
      title: "权限管理",
      icon: "el-icon-lock",
    },
    children: [
      {
        name: "User",
        path: "user/list",
        component: () => import("@/views/acl/UserList"),
        meta: {
          title: "用户管理",
        },
      },
      {
        name: "Role",
        path: "role/list",
        component: () => import("@/views/acl/role/RoleList"),
        meta: {
          title: "角色管理",
        },
      },
      {
        name: "RoleAuth",
        path: "role/auth/:id",
        component: () => import("@/views/acl/role/RoleAuth"),
        meta: {
          activeMenu: "/acl/role/list",
          title: "角色授权",
        },
        hidden: true,
      },
      {
        name: "Permission",
        path: "permission/list",
        component: () => import("@/views/acl/PermissionList"),
        meta: {
          title: "菜单管理",
        },
      },
    ],
  },
  {
    path: "/product",
    component: Layout,
    name: "Product",
    meta: { title: "商品管理", icon: "el-icon-goods" },
    children: [
      {
        path: "trademark",
        name: "Trademark",
        component: () => import("@/views/product/tradeMark"),
        meta: { title: "品牌管理" },
      },
      {
        path: "attr",
        name: "Attr",
        component: () => import("@/views/product/Attr"),
        meta: { title: "平台属性管理" },
      },
      {
        path: "spu",
        name: "Spu",
        component: () => import("@/views/product/Spu"),
        meta: { title: "Spu管理" },
      },
      {
        path: "sku",
        name: "Sku",
        component: () => import("@/views/product/Sku"),
        meta: { title: "Sku管理" },
      },
    ],
  },
  {
    path: "/test",
    component: Layout,
    name: "Test",
    meta: { title: "测试管理", icon: "el-icon-s-opportunity" },
    children: [
      {
        path: "test1",
        name: "Test1",
        component: () => import("@/views/test/Test1"),
        meta: { title: "测试1" },
      },
      {
        path: "test2",
        name: "Test2",
        component: () => import("@/views/test/Test2"),
        meta: { title: "测试2" },
      },
    ],
  },
];
//任意路由：当路径出现错误的时候重定向404
// 404 page must be placed at the end !!!
export const anyRoutes = [{ path: "*", redirect: "/404", hidden: true }];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    //滑到顶部
    scrollBehavior: () => ({ y: 0 }),
    //每个用户都有的默认路由，必须写的，防止什么权限都没有的员工
    //兜底路由
    routes: constantRoutes,
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
