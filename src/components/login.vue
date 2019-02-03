<template>
  <div class="wrap">
    <el-form class="form" :label-position="labelPosition" label-width="80px" :model="formdata">
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formdata.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formdata.password"></el-input>
      </el-form-item>
      <el-button @click="handleLogin2()" class="btn" type="primary">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formdata: {
        username: "",
        password: ""
      },
      labelPosition: "top"
    };
  },
  methods: {
    handleLogin() {
      this.$http.post("login", this.formdata).then(res => {
        console.log(res);
        const {
          data: {
            meta: { msg, status }
          }
        } = res;
        if (status === 200) {
          // this.$message.success(msg);
          //使用编程式导航，登录成功后，找打名字为home的路由配置，渲染其中组件
          this.$router.push({
            name:"home"
          });
        } else {
          this.$message.error(msg);
        }
      });
    },
    async handleLogin2(){
      //登录请求函数的简化写法，使用ES7中async+await将异步操作的代码变成像同步
      //找到离异步操作最近的函数，前面加async,然后异步操作的代码前面加await
      //这样就可以直接拿到后台返回的结果
      const res=await this.$http.post("login",this.formdata);
      const {data:{meta:{msg,status},data}}=res;
      if(status===200){
         //登录成功，保留使用localstorage保存登陆的token值
         localStorage.setItem("token",data.token); 
         this.$router.push({
           name:"home"
         }); 
      }else{
        this.$message.error(msg);
      }
    }
  }
};
</script>

<style>
.wrap {
  background-color: dimgrey;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.form {
  background-color: white;
  width: 450px;
  border-radius: 6px;
  padding: 20px;
}
.btn {
  width: 100%;
}
</style>
