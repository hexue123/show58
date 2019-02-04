import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)


// 导入组件
import Login from '../components/login'
import Home from '../components/home'
import Users from '../components/users'

export default new Router({
    routes: [{
            path: "/",
            name: "home",
            component: Home,
            // 用户组件必须在home组件渲染完毕后，才出现，所以出现了组件嵌套
            children: [{
                path: "/users",
                name: "users",
                component: Users
            }]

        },
        {
            name: "login",
            path: '/login',
            component: Login
        },

    ]
})