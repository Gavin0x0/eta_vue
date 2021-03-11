<template>
  <el-container class="main-container">
    <el-header>
      <el-menu
        default-active="2-7"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-button
          class="menu-button"
          @click="submenuTrigger"
          type="text"
          :icon="CollapseIcon"
        ></el-button>
        <span class="logo">ETA</span>
        <span class="logo-text hidden-xs-only">奖项成果管理系统</span>
        <el-submenu style="float:right" index="2">
          <template slot="title">👋 你好，{{ name }}</template>
          <el-menu-item index="2-1">账号：{{ username }}</el-menu-item>
          <el-menu-item index="2-2">身份：{{ role }}</el-menu-item>
          <el-menu-item index="2-3" v-if="grade"
            >年级：{{ grade }}</el-menu-item
          >
          <el-menu-item index="2-4" v-if="grade"
            >专业：{{ major }}</el-menu-item
          >
          <el-menu-item index="2-5" v-if="grade"
            >班级：{{ l_class }}</el-menu-item
          >
          <el-menu-item
            style="text-align:center"
            index="2-6"
            @click="loginOutHander"
            >退出登陆</el-menu-item
          >
          <el-menu-item style="display:none" index="2-7">空</el-menu-item>
        </el-submenu>
      </el-menu></el-header
    >
    <el-container>
      <el-aside width="auto" v-if="windowWidth >= 720">
        <el-menu
          default-active="1"
          class="el-menu-vertical-demo left-menu"
          @open="handleOpen"
          @close="handleClose"
          :collapse="isCollapse"
          :router="true"
        >
          <el-menu-item index="/eta/home">
            <i class="el-icon-house"></i>
            <span slot="title" class="menu-title">系统主页</span>
          </el-menu-item>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span slot="title" class="menu-title">功能菜单</span>
            </template>
            <el-menu-item index="/eta/upload">上传奖项</el-menu-item>
            <el-menu-item index="/eta/mine">获奖记录</el-menu-item>
            <el-menu-item
              v-if="roleId === 1 || roleId === 3"
              index="/eta/review"
              >奖项审核</el-menu-item
            >
            <el-menu-item v-if="roleId !== 5" index="/eta/query-stu"
              >管理学生获奖</el-menu-item
            >
            <el-menu-item
              v-if="roleId === 1 || roleId === 2"
              index="/eta/query-tea"
              >管理教师获奖</el-menu-item
            >
          </el-submenu>
          <template v-if="roleId === 1">
            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-receiving"></i>
                <span slot="title" class="menu-title">数据管理</span>
              </template>
              <el-menu-item index="/eta/manage-stu">学生管理</el-menu-item>
              <el-menu-item index="/eta/manage-tea">教师管理</el-menu-item>
              <el-menu-item index="/eta/award">奖项管理</el-menu-item>
            </el-submenu>
            <el-submenu index="4">
              <template slot="title">
                <i class="el-icon-upload"></i>
                <span slot="title" class="menu-title">数据导入</span>
              </template>
              <el-menu-item index="/eta/import-stu">学生导入</el-menu-item>
              <el-menu-item index="/eta/import-tea">教师导入</el-menu-item>
              <el-menu-item index="/eta/import-award">奖项导入</el-menu-item>
            </el-submenu>
          </template>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-setting"></i>
              <span slot="title" class="menu-title">系统设置</span>
            </template>
            <el-menu-item index="/eta/password">修改密码</el-menu-item>
          </el-submenu>
        </el-menu></el-aside
      >
      <el-container style="height:auto">
        <el-main>
          <el-drawer
            title="移动端菜单栏"
            :visible.sync="isCollapse"
            :with-header="false"
            direction="ltr"
            size="50%"
            v-if="windowWidth < 720"
          >
            <el-menu
              default-active="1"
              class="left-menu"
              @select="mobileMenuSelect"
              @open="handleOpen"
              @close="handleClose"
              :collapse="false"
              :router="true"
              :unique-opened="true"
            >
              <el-menu-item index="/eta/home">
                <i class="el-icon-house"></i>
                <span slot="title" class="menu-title">系统主页</span>
              </el-menu-item>
              <el-submenu index="2">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span slot="title" class="menu-title">功能菜单</span>
                </template>
                <el-menu-item index="/eta/upload">上传奖项</el-menu-item>
                <el-menu-item index="/eta/mine">获奖记录</el-menu-item>
                <el-menu-item
                  v-if="roleId === 1 || roleId === 3"
                  index="/eta/review"
                  >奖项审核</el-menu-item
                >
                <el-menu-item v-if="roleId !== 5" index="/eta/query-stu"
                  >管理学生获奖</el-menu-item
                >
                <el-menu-item
                  v-if="roleId === 1 || roleId === 2"
                  index="/eta/query-tea"
                  >管理教师获奖</el-menu-item
                >
              </el-submenu>
              <template v-if="roleId === 1">
                <el-submenu index="3">
                  <template slot="title">
                    <i class="el-icon-receiving"></i>
                    <span slot="title" class="menu-title">数据管理</span>
                  </template>
                  <el-menu-item index="/eta/manage-stu">学生管理</el-menu-item>
                  <el-menu-item index="/eta/manage-tea">教师管理</el-menu-item>
                  <el-menu-item index="/eta/award">奖项管理</el-menu-item>
                </el-submenu>
                <el-submenu index="4">
                  <template slot="title">
                    <i class="el-icon-upload"></i>
                    <span slot="title" class="menu-title">数据导入</span>
                  </template>
                  <el-menu-item index="/eta/import-stu">学生导入</el-menu-item>
                  <el-menu-item index="/eta/import-tea">教师导入</el-menu-item>
                  <el-menu-item index="/eta/import-award"
                    >奖项导入</el-menu-item
                  >
                </el-submenu>
              </template>
              <el-submenu index="5">
                <template slot="title">
                  <i class="el-icon-setting"></i>
                  <span slot="title" class="menu-title">系统设置</span>
                </template>
                <el-menu-item index="/eta/password">修改密码</el-menu-item>
              </el-submenu>
            </el-menu>
          </el-drawer>
          <router-view
        /></el-main>
        <el-footer
          >东南大学成贤学院
          <a class="bottom-link" href="http://jsjx.cxxy.seu.edu.cn/"
            >电子与计算机工程学院</a
          >
          技术支持</el-footer
        >
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
// @ is an alias to /src
import { initHome, logout } from "../api";
import { mapGetters } from "vuex";
export default {
  name: "HomeScreen",
  data() {
    return {
      isCollapse: false,
      CollapseIcon: "el-icon-s-unfold",
      windowWidth: document.documentElement.clientWidth, //实时屏幕宽度
    };
  },
  watch: {
    windowWidth(val) {
      let that = this;
      //closeDebug console.log("实时屏幕宽度：", val, that.windowHeight);
    },
  },

  computed: {
    ...mapGetters([
      "name", //用户名
      "username",
      "role",
      "roleId",
      //如果是学生的话还有以下参数
      "grade",
      "major",
      "l_class",
    ]),
  },
  mounted() {
    //进入时进行用户信息初始化
    this.init();
    var that = this;
    // <!--把window.onresize事件挂在到mounted函数上-->
    window.onresize = () => {
      return (() => {
        window.fullWidth = document.documentElement.clientWidth;
        that.windowWidth = window.fullWidth; // 宽
      })();
    };
  },
  methods: {
    //初始化角色
    init() {
      let _this = this;
      initHome()
        .then((res) => {
          //closeDebug console.log("-----------主页初始化---------------");
          if (res.code === 0) {
            // _this.$message({
            //   message: res.msg,
            //   type: "success",
            // });
            let obj = JSON.parse(res.msg);
            //closeDebug console.log("用户信息解析", obj);
            this.$store.commit("initUserInfo", {
              totalItemNum: obj.l_document, //总奖项数
              stuItemNum: obj.l_student, //学生奖项数
              teaItemNum: obj.l_teacher, //教师奖项数
              roleId: obj.l_roleId, //角色
              name: obj.l_name, //用户姓名
              username: obj.l_username, //用户编号
              role: obj.l_role, //用户角色
              //如果是学生的话还有以下参数
              grade: obj.l_grade, //年级
              major: obj.l_major, //专业
              l_class: obj.l_class, //班级
            });
          } else {
            _this.$message({
              message: res.msg,
              type: "error",
            });
          }
        })
        .catch((failResponse) => {});
    },
    submenuTrigger() {
      this.isCollapse = !this.isCollapse;
      this.CollapseIcon = this.isCollapse
        ? "el-icon-s-unfold"
        : "el-icon-s-fold";
    },
    handleOpen(key, keyPath) {
      //closeDebug console.log("侧边菜单打开了", key, keyPath);
    },
    handleClose(key, keyPath) {
      //closeDebug console.log("侧边菜单关闭了", key, keyPath);
    },
    handleSelect(key, keyPath) {
      //closeDebug console.log("顶部菜单选中了", key, keyPath);
    },
    mobileMenuSelect(key, keyPath) {
      this.isCollapse = false;
    },
    loginOutHander() {
      let _this = this;
      logout()
        .then((res) => {
          //closeDebug console.log("退出登陆", res);
          if (res.code === 0) {
            _this.$message({
              message: res.msg,
              type: "success",
            });
            //设置登陆状态
            // _this.$store.commit("setLoginState", false);
          } else {
            _this.$message({
              message: res.msg,
              type: "error",
            });
            _this.changeCode();
          }
        })
        .catch((failResponse) => {});
      setTimeout(function() {
        _this.$router.push({ path: "/" });
      }, 1000);
    },
  },
};
</script>
<style>
.logo {
  float: left;
  font-weight: 800;
  font-size: 30px;
  color: #0084ffbe;
}
.logo-text {
  margin-left: 10px;
  float: left;
  font-size: 20px;
}
.main-container {
  height: 100%;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
}

.el-header {
  background-color: #ffffff;
  color: #333;
  text-align: center;
  line-height: 60px;
}
.el-footer {
  background-color: #ffffff;
  color: rgb(70, 69, 69);
  text-align: center;
  font-size: 12px;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
  display: flex;
  flex-direction: column;
}
.bottom-link {
  text-decoration: none;
}
/* 未访问的链接 */
.bottom-link:link {
  color: #0084ff;
}

/* 已访问的链接 */
.bottom-link:visited {
  color: #0084ff;
}
.el-main {
  background-color: #e9eef3;
  color: #333;
}
.menu-title {
  font-weight: 500;
}

.menu-button {
  float: left !important;
  color: rgb(0, 0, 0) !important;
  margin: 14px 10px 0px 0px !important;
  padding: 0px !important;
  font-size: 26px !important;
}
</style>
