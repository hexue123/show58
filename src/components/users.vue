<template>
  <el-card class="card">
    <!-- 1.面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 2.搜索框 -->
    <el-row>
      <el-col>
        <el-input
          placeholder="请输入用户名"
          @clear="getAllUsers()"
          clearable
          v-model="query"
          class="input-with-select"
        >
          <el-button @click="searchUser()" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="success" @click="showDiaAdd()">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 3.数据表格 -->
    <!-- data属性值是表格的数据源，是一个数组 
    el-table-column 表示每一列 label是表头文本信息 prop每一列中每个单元格的数据
    来源与tableData的key值-->
    <!-- 
        create_time 创建时间
        email      邮箱
        id         id值
        mg_state   状态
        mobile:    手机号
        role_name  角色名称
        username   用户名  
    -->
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="id" label="#" width="180"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>

      <el-table-column prop="create_time" label="创建日期">
        <!-- 单元格的数据不是来自于prop绑定的key所对应的value值时，需要给
          被显示的数据(被格式化的时间)外加一个template容器，但是此时里层获取不到外层
          :data="tableData"数据，template可以使用一个中转站属性slot-scope="名字" 
          里层template获取最外层数据，之后名字.row代表数组中的对象.数据key值 
        里层获取外层数据-->
        <!-- 日期数据格式化完毕 -->
        <template slot-scope="data">{{data.row.create_time | fmDate}}</template>
      </el-table-column>

      <el-table-column prop label="用户状态">
        <!-- 显示的不是prop绑定的key对应的值，需要给显示的数据加一个外壳template -->
        <template slot-scope="scope">
          <el-switch
            @change="changeState(scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>

      <el-table-column prop label="操作" width="180">
        <template slot-scope="scope">
          <!-- 放按钮 -->
          <el-button
            size="mini"
            plain
            type="primary"
            icon="el-icon-edit"
            circle
            @click="showDiaEdit(scope.row.id)"
          ></el-button>
          <el-button
            size="mini"
            plain
            type="danger"
            icon="el-icon-delete"
            circle
            @click="showDeleConfig(scope.row.id)"
          ></el-button>
          <el-button
            size="mini"
            plain
            type="success"
            icon="el-icon-check"
            circle
            @click="showRoleDia(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 4.分页导航
         @size-change="handleSizeChange"  每页显示数据条数改变时触发函数
         @current-change="handleCurrentChange"  当前页码改变时触发函数
         :current-page="currentPage4"   设置默认显示页码
         :page-sizes   设置每页可显示显示数据条数(数组)
          :page-size   设置默认每页显示数据条数 
         :total  数据总条数 
    -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2,4,6,8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 5.增加用户的对话框 -->
    <el-dialog title="添加用户" width="50%" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd= false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 6.编辑用户对话框 -->
    <el-dialog title="编辑用户" width="50%" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input disabled v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit= false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 7.分配角色的对话框 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
      <el-form>
        <el-form-item label="用户名" :label-width="formLabelWidth">{{currUsername}}</el-form-item>

        <el-form-item label="角色" :label-width="formLabelWidth">
          <el-select v-model="currRoleId">
            <!-- 
                1.v-model 写在select
                2.如果v-model绑定的数据与option的value的数据一致，默认显示option的label值
                3.如果选择了某个option,那么v-model绑定的数据就是该option的value值
            -->
            <!-- 数字-1与字符串-1不一致 -->
            <el-option label="请选择" :value="-1" disabled></el-option>
            <el-option v-for="(v,i) in roles" :key="i" :label="v.roleName" :value="v.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
        <el-button type="primary" @click="setRole()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      //表格数据
      tableData: [],
      query: "",
      pagenum: 1,
      pagesize: 2,
      total: -1,
      //   控制添加用户对话框显示与隐藏的属性
      dialogFormVisibleAdd: false,
      //控制编辑用户对话框显示与隐藏的属性
      dialogFormVisibleEdit: false,
      // 控制用户角色对话框显示与隐藏的属性
      dialogFormVisibleRole: false,
      //对话框的数据
      form: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      formLabelWidth: "120px",
      //角色id
      currRoleId: -1,
      currUserId: -1,
      // 角色数据数组
      roles: [],
      currUsername: ""
    };
  },
  created() {
    //vue实例一创建，就执行获取用户列表的数据
    this.getTableData();
  },
  methods: {
    //分配角色方法
    async setRole() {
      //弹出角色对话框，点击确定绑定事件，关闭对话框，并且发送分配角色请求
      //用户id先在data中寻找，没有看方法能否传参，不能自己在data中定义用户id
      //然后在其他有用户信息的方法里获取用户id，并且赋值
      const res=await this.$http.put(`users/${this.currUserId}/role`,{rid:this.currRoleId});
      console.log(res);
      const {meta:{msg,status}}=res.data;
      if(status===200){
         this.$message.success(msg);
         this.dialogFormVisibleRole=false; 
      }else{
        this.$message.warning(msg);
      }
    },
    //点击修改角色按钮，弹出角色对话框
    async showRoleDia(user) {
      this.dialogFormVisibleRole = true;
      //为当前用户id赋值
      this.currUserId = user.id;
      //对话框弹出，根据用户信息user，获取用户名称，赋值给当前用户名称
      this.currUsername = user.username;
      //1.进入对话框，发送请求，获取用户角色信息列表
      const res = await this.$http.get(`roles`);
      //获取不到用户角色id
      // console.log(res);
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 200) {
        this.roles = data;
      }
      //但是虽然显示了对话框获取当前用户名字，以及用户角色列表，但是还还要根据当前用户信息的
      // 用户id，获取用户的角色id，以便select绑定的用户角色id与option中的value值进行对比
      // 以便显示对应的lable值，就是对应的用户角色(自动显示用户角色)
      //2.再发一次请求，获取用户角色id，使用双向数据绑定，根据对应的用户id与角色id匹配，
      // 显示对应用户的角色
      const res2 = await this.$http.get(`users/${user.id}`);
      console.log(res2.data.data.rid);
      this.currRoleId = res2.data.data.rid;
    },
    //点击修改状态开关，绑定change事件
    async changeState(user) {
      console.log(user);
      // uId用户 ID	不能为空携带在url中
      // type用户状态
      //数据
      const res = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      );
      console.log(res);
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.$message.success(msg);
      } else {
        this.$message.info(msg);
      }
    },
    //点击编辑按钮，弹出编辑对话框
    async showDiaEdit(ID) {
      this.dialogFormVisibleEdit = true;
      //打开对话框，根据id查询数据
      const res = await this.$http.get("users/" + ID);
      console.log(res);
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 200) {
        this.form = data;
      }
    },
    //编辑用户对话框，点击确认按钮，函数
    async editUser() {
      //根据用户id发送修改请求，这里的id来自于点击弹出编辑对话框的数据
      const res = await this.$http.put("users/" + this.form.id, this.form);
      console.log("发送编辑用户请求返回的数据");
      console.log(res);
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.$message.success(msg);
        //关闭编辑对话框
        this.dialogFormVisibleEdit = false;
        this.pagenum = 1;
        this.getTableData();
      }
    },
    //点击删除按钮，弹出一个确认框
    showDeleConfig(ID) {
      this.$confirm("确认是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$http.delete(`users/` + ID);
          const {
            meta: { msg, status }
          } = res.data;
          //删除成功执行的函数
          if (status === 200) {
            this.$message.success(msg);
            //删除成功，从第一页开始显示
            this.pagenum = 1;
            //重新渲染表格数据
            this.getTableData();
          }
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    //添加用户对话框中的确定按钮绑定事件
    async addUser() {
      //点击添加，向后台发送数据
      const res = await this.$http.post("users", this.form);
      console.log("添加用户后台返回的数据");
      console.log(res);
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 201) {
        //关闭对话框
        this.dialogFormVisibleAdd = false;
        //重新渲染页面
        this.getTableData();
      } else {
        this.$message.warning(msg);
      }
    },
    //点击添加按钮，显示添加用户的对话框
    showDiaAdd() {
      this.form = {};
      this.dialogFormVisibleAdd = true;
    },
    //搜索用户的方法,点击按钮，绑定事件，调用方法
    //里面执行获取用户列表的方法，因为根据input框绑定query
    //然后搜索用户列表方法也可以以此query值查询数据
    searchUser() {
      //搜索完毕，从第1页显示数据
      this.pagenum = 1;
      this.getTableData();
    },
    //但是输入增加清空属性后，需要绑定clear事件，
    // 代表清空输入框，重新获取数据
    getAllUsers() {
      this.getTableData();
    },
    //分页相关方法
    // 每页显示数据条数发生改变时触发的函数
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      //当前每页显示数据条数发生改变时触发的函数
      //重置每页显示的数据条数，然后再使用获取数据的方法
      this.pagesize = val;
      //重置每页显示数据后，重新在第1页显示数据
      this.pagenum = 1;
      this.getTableData();
    },
    //当前页码发生改变时触发函数
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      //val是当前页码,比如点击第二页，显示第3，第4条数据
      //所以更新data中的页码值，然后调用获取列表数据的方法
      this.pagenum = val;
      this.getTableData();
    },

    //获取用户列表的数据
    async getTableData() {
      //除了登录外，其他的请求都需要设置请求头授权，然后访问后台数据，否则的不能
      // Authorization 字段提供 token 令牌,查看axios文档是否有设置请求头方式
      // query	查询参数	可以为空
      // pagenum	当前页码	不能为空
      // pagesize	每页显示条数	不能为空
      //发送请求前除了登录请求，需要token令牌验证，否则后台不会返回数据
      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      //   ``模板字符串 更好用，${}模板占位符，可以把里面的值放在字符串位置
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
      //   用户表格数据
      console.log(res);
      const {
        data: { total, users },
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        //  请求成功，把users数据赋值给tableData
        this.tableData = users;
        this.total = total;
        this.$message.success(msg);
        console.log("tableData表格里的数据");
        console.log(this.tableData);
      } else {
        this.$message.warning(msg);
      }
    }
  }
};
</script>

<style>
.card {
  height: 100%;
}
.input-with-select {
  margin-top: 20px;
  width: 350px;
}
</style>
