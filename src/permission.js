import router from "./router";
import store from "./store";
import { Message } from "element-ui";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { getToken } from "@/utils/auth"; // get token from cookie
import getPageTitle from "@/utils/get-page-title";

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ["/login"]; // no redirect whitelist

//每次进行路由的加载之前进行
router.beforeEach(async (to, from, next) => {
  // start progress bar
  //显示进度条
  NProgress.start();

  // set page title
  //显示要去的路由页面的名称,在网页的tab上
  document.title = getPageTitle(to.meta.title);

  //获取本地的token
  // determine whether the user has logged in
  const hasToken = getToken();

  if (hasToken) {
    if (to.path === "/login") {
      // if is logged in, redirect to the home page
      next({ path: "/" });
      //此时会被重定向为路径"/dashboard"，
      //进而进行下面的判断
      NProgress.done();
    } else {
      const hasGetUserInfo = store.getters.name;
      if (hasGetUserInfo) {
        next();
      } else {
        try {
          //尝试利用token字段获取用户的信息，当然可能因为
          //token的过期，非法token等原因导致获取失败
          // get user info
          await store.dispatch("user/getInfo");
          /* addRoutes()就立刻访问被添加的路由，
          然而此时addRoutes()没有执行结束，
          因而找不到刚刚被添加的路由导致白屏 */
          /* 参数to不能找到对应的路由的话，就再执行
          一次beforeEach((to, from, next)直到
          其中的next({ ...to})能找到对应的路由为止。*/
          /* replace: true只是一个设置信息，
          告诉VUE本次操作后，不能通过浏览器后退按钮，返回前一个路由 */
          next({ ...to, replace: true });
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch("user/resetToken");
          Message.error(error || "Has Error");
          next(`/login?redirect=${to.path}`);
          NProgress.done();
        }
      }
    }
  } else {
    /* has no token*/
    //如果是要去的是登录的界面，那直接放行
    //这里之所以要indexOf是因为有两种情况，一种是有携带路径信息的
    //所以不能直接进行=‘login’的判断
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next();
    } else {
      //如果是其他的页面，则带上路径的信息，引导他跳到登录的界面上
      // other pages that do not have permission to access are redirected to the login page.
      //，带上路由的信息，进行新一波的路由守卫的判断
      next(`/login?redirect=${to.path}`);
      //进度条结束
      NProgress.done();
    }
  }
});
/* 路由守卫逻辑
1，每次跳转前都是询问是否有token，
2，有的话就直接跳到根目录/，但是根目录/会重定向为"/dashboard"首页，变成二级路由
3，二级路由"/dashboard"首页的跳转又会进行新一轮的判断，此时是有token值，但是不知道是否有用户名name属性，
4，有name属性的情况是已经进行了登录或者之前已经进行了  getInfo的请求了，这时就可以进行路由的放行，
5，没有name属性的情况是没有进行登录的操作或者说没有进行  getInfo的函数的执行的，这时就要进行  getInfo
的函数的执行了，然后才放行
6，但是  getInfo函数获得用户的信息不是一定会成功的，可能会因为token的过期的原因，造成请求的失败
此时就要捕获error，然后清除掉本地的token，记住先清除本地的token，然后再清除掉仓库中state的token
7然后放行到登录界面，让用户重新登录，以便存储新的token和用户名等信息
8，如果没有的token的话，又分情况了，如果没有token，但是要前往的是登录界面的，直接放行就行了
9，否则没有token，并且想去其他页面的，就记住他要去的页面信息，然后引导用户去登录界面，进而让函数getInfo执行
获得新的token，和用户名等信息 */
router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
