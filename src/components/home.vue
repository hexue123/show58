<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="3"></el-col>
        <el-col :span="19" class="middle">
          <h2>百布电商后台管理系统</h2>
        </el-col>
        <el-col :span="1" class="amid">
          <a href="#" @click.prevent="handleLoginout()">退出</a>
        </el-col>
      </el-row>
    </el-header>

    <el-container>
      <el-aside class="aside">
        <el-col :span="12" class="col">
          <el-menu default-active="2" :unique-opened="true" router>
            <!-- 1 -->
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>用户管理</span>
              </template>
              <el-menu-item index="users">
                <i class="el-icon-menu"></i>
                用户列表
              </el-menu-item>
            </el-submenu>

            <!--2  -->
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>权限管理</span>
              </template>
              <el-menu-item index="1-1">
                <i class="el-icon-menu"></i>
                角色列表
              </el-menu-item>
              <el-menu-item index="1-1">
                <i class="el-icon-menu"></i>
                权限列表
              </el-menu-item>
            </el-submenu>

            <!--3  -->
            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>商品管理</span>
              </template>
              <el-menu-item index="1-1">
                <i class="el-icon-menu"></i>
                商品列表
              </el-menu-item>
              <el-menu-item index="1-1">
                <i class="el-icon-menu"></i>
                分类参数
              </el-menu-item>
              <el-menu-item index="1-1">
                <i class="el-icon-menu"></i>
                商品分类
              </el-menu-item>
            </el-submenu>

            <!-- 4 -->
            <el-submenu index="4">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>订单管理</span>
              </template>
              <el-menu-item index="1-1">
                <i class="el-icon-menu"></i>
                订单列表
              </el-menu-item>
            </el-submenu>

            <!-- 5 -->
            <el-submenu index="5">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>数据统计</span>
              </template>
              <el-menu-item index="1-1">
                <i class="el-icon-menu"></i>
                数据报表
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-col>
      </el-aside>
      <el-main class="main">
        <!-- 组件渲染容器 -->
        <router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
    //使用钩子函数 beforeCreated(),创建vue实例之前的函数检测是否登录过
    //就是检测是否有token，登录过有，否则没有，回到登录页
    beforeCreate(){
        if(!localStorage.getItem("token")){
           //使用编程式导航回到登录，并使用ui库提示信息提示请先登录
           this.$router.push({
               name:"login"
           });
           this.$message.error("请先登录！");
        }
    },
    methods:{
        //用户退出函数
        //清除token，回到登录组件
        handleLoginout(){
            //清除token
            localStorage.clear();
            //使用编程式导航回到登录组件
            this.$router.push({
                name:"login"
            });     
            //并且使用ui库的消息提示提示退出成功
            this.$message.success("退出成功！");
        }
    }
};
</script>

<style>
.container {
  height: 100%;
}
.header {
  background-color: lavender;
}
.aside {
  /* background-color: red; */
  /* border-right: 1px solid gray; */
  /* width: 251px; */
}
.main {
  /* background-color: blue; */
}
.middle h2 {
  text-align: center;
  line-height: 4px;
  display: block;
  width: 300px;
  padding-left: 550px;
}
.amid a {
  text-decoration: none;
  line-height: 60px;
  display: block;
  width: 40px;
  color: black;
}
.col {
  width: 250px;
}
</style>
