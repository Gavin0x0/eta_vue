<template>
  <div class="login">
    <el-container>
      <el-header>头部【tt】</el-header>
      <el-container>
        <el-aside width="60%" class="hidden-xs-only">
          <img alt="Vue logo" src="../assets/logo.png" />
        </el-aside>
        <el-container>
          <el-main>
            <el-form
              :model="loginForm"
              status-icon
              :rules="rules"
              ref="loginForm"
              label-width="80px"
              style="margin-right:30px"
            >
              <el-form-item label="账号" prop="username">
                <el-input v-model.number="loginForm.username"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input
                  type="password"
                  v-model="loginForm.password"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="验证码" prop="captcha">
                <div class="captcha-input-container">
                  <el-input
                    v-model="loginForm.captcha"
                    autocomplete="off"
                  ></el-input>
                  <img
                    class="captcha-img"
                    src=""
                    ref="code"
                    @click="changeCode"
                  />
                </div>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('loginForm')"
                  >登陆</el-button
                >
                <el-button @click="resetForm('loginForm')">重置</el-button>
                <el-button  @click="gono"
                  >免登陆进入「开发用」</el-button
                >
              </el-form-item>
            </el-form>
          </el-main>
          <el-footer>底部【dd】</el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import "element-ui/lib/theme-chalk/display.css";
//导入封装好的login请求
import { login, getCaptcha } from "../api/index";
// @ is an alias to /src
//登陆页
export default {
  name: "LoginScreen",
  data() {
    //自定义前端验证规则
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    var validateUser = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入账号"));
      } else {
        callback();
      }
    };
    var validateCap = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入验证码"));
      } else {
        callback();
      }
    };
    return {
      //表单数据
      loginForm: {
        password: "",
        username: "",
        captcha: "",
      },
      //校验规则
      rules: {
        password: [{ validator: validatePass, trigger: "blur" }],
        username: [{ validator: validateUser, trigger: "blur" }],
        captcha: [{ validator: validateCap, trigger: "blur" }],
      },
    };
  },
  mounted() {
    // 得到验证码图片
    this.changeCode();
  },
  methods: {
    //点击登陆，提交表单
    submitForm(formName) {
      let _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //前端校验通过后，进行登陆操作
          let params = new URLSearchParams();
          params.append("username", this.loginForm.username);
          params.append("password", this.loginForm.password);
          params.append("captcha", this.loginForm.captcha);
          login(params)
            .then((res) => {
              console.log("-----------获取登录信息---------------");
              console.log(res);
              if (res.code === 0) {
                _this.$message({
                  message: res.msg,
                  type: "success",
                });
                setTimeout(function() {
                  _this.$router.push({ path: "/eta/home" });
                  _this.$router.go(0);
                }, 1000);
              } else {
                _this.$message({
                  message: res.msg,
                  type: 'error'
                });
                _this.changeCode();
              }
            })
            .catch((failResponse) => {});
        } else {
          //前端校验未通过
          console.log("error submit!!");
          return false;
        }
      });
    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //获取随机数作来生成验证码
    getCaptchaKey() {
      let captchaKey = Math.random();
      return captchaKey;
    },
    //刷新验证码
    changeCode() {
      let _this = this;
      let captcha_key = this.getCaptchaKey();
      //此接口传入的是blob格式数据，再渲染至窗口
      getCaptcha(captcha_key)
        .then((res) => {
          _this.$refs.code.setAttribute("src", window.URL.createObjectURL(res));
        })
        .catch((err) => {
          console.log("验证码请求error",err);
        });
    },

    //免登陆进入「开发用」
    gono(){
      this.$router.push({ path: "/eta/home" });
    }
  },
};
</script>
<style>
.login {
  padding: 0px;
  margin: 0px;
  height: 100%;
}
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}


.el-aside>img {
  width: 50%;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
}

body > .el-container {
  margin-bottom: 40px;
}

.captcha-input-container {
  display: flex;
  flex-direction: row;
}
.captcha-img {
  height: 38px;
  width: 108px;
  margin-left: 10px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
}
</style>
