import Vue from "vue";

import "normalize.css/normalize.css"; // A modern alternative to CSS resets

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import locale from "element-ui/lib/locale/lang/en"; // lang i18n

import "@/styles/index.scss"; // global css

import App from "./App";
import store from "./store";
import router from "./router";

import "@/icons"; // icon
import "@/permission"; // permission control
//引入相关API请求接口
import api from "@/api";
//引入全局组件
import CategorySelect from "@/components/CategorySelect";
import HintButton from "@/components/HintButton";
//引入阿里图标样式
import "@/assets/fonts/iconfont.css";
//告诉浏览器所有的事件都没有设置
//e.preventDefault()来阻止浏览器事件的默认行为
//所以不用一个个监测了，直接执行，优化页面的性能
//默认为true，不检测
import "default-passive-events";

// 引入echarts
import echarts from "echarts";
Vue.prototype.$echarts = echarts;

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */

//在开发环境中启动mock数据
if (process.env.NODE_ENV === "development") {
  const { mockXHR } = require("../mock");
  mockXHR();
}

// set ElementUI lang to EN
Vue.use(ElementUI, { locale });
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false;
//任意组件可以使用API相关的接口
Vue.prototype.$api = api;
//注册全局组件,三级联动
Vue.component(CategorySelect.name, CategorySelect);
//注册全局二次封装组件，提示按钮
Vue.component(HintButton.name, HintButton);
new Vue({
  el: "#app",
  router,
  store,
  render: (h) => h(App),
});
