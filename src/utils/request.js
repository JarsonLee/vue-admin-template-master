import axios from "axios";
import { MessageBox, Message } from "element-ui";
import store from "@/store";
import { getToken } from "@/utils/auth";

// create an axios instance
const service = axios.create({
  //这里加上路径前缀process.env.VUE_APP_BASE_API('/dev-api')，让代理服务器前往开发服务器的地址
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout
});

// request interceptor
service.interceptors.request.use(
  //发请求之前的设置，携带token
  (config) => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers["token"] = getToken();
    }
    return config;
  },
  //请求发布不出去的设置
  (error) => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  //得到响应后，对响应分为两类，并且对其分别设置
  (response) => {
    const res = response.data;

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 20000 && res.code !== 200) {
      //非200或者20000的状态，先弹出错误信息，然后再对其再分情况
      Message({
        message: res.message || "Error",
        type: "error",
        duration: 5 * 1000,
      });

      // 如果token过期，非法token，多个客户端登录，则进行以下的逻辑判断
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      //这里的token过期用什么code字段具体要看后端的设计，当然这里没得知道
      //想要知道可以亲自测试，哈哈
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        //两种选择，一种是留在本页面，因为未设置catch所以啥都没干
        //另一种是点击确认按钮，执行then内的代码
        MessageBox.confirm(
          "You have been logged out, you can cancel to stay on this page, or log in again",
          "Confirm logout",
          {
            confirmButtonText: "Re-Login",
            cancelButtonText: "Cancel",
            type: "warning",
          }
        ).then(() => {
          //清空token，当然先清空本地的token，再清空仓库的token
          store.dispatch("user/resetToken").then(() => {
            //刷新重加载页面会被路由守卫检测到，此时会带着路由的信息，被引导到登录的界面
            //登录成功后悔重新回到原界面
            location.reload();
          });
        });
      }
      return Promise.reject(new Error(res.message || "Error"));
    } else {
      //这是200或者状态为20000的一个设置,直接返回一个响应的数据
      return res;
    }
  },
  //得不到响应的设置
  (error) => {
    console.log("err" + error); // for debug
    Message({
      message: error.message,
      type: "error",
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);

export default service;
