import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)


// 导入组件
import Login from '../components/login'
import Home from '../components/home'
export default new Router({
    routes: [{
            path: "/",
            name: "home",
            component: Home

        },
        {
            name: "login",
            path: '/login',
            component: Login
        }
    ]
})