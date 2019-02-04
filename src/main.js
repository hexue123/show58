// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
//引入此时已变成vue插件的axios
import Http from '../src/plugins/http'
// 关闭生产阶段日志的输出
Vue.config.productionTip = false
    //使用element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入公共样式
import "@/assets/index.css"
Vue.use(ElementUI)
Vue.use(Http)

/* eslint-disable no-new */
//在入口文件创建一个处理时间的过滤器
//下载moment.js 处理时间格式的  npm i moment
//引入momemt.js文件
import moment from 'moment'
//定义过滤器
Vue.filter('fmDate', (v) => {
    return moment(v).format('YYYY-MM-DD');
});

new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})