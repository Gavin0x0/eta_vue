<template>
  <div class="login">
    <el-row type="flex" class="row-bg" justify="center">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="rules"
        status-icon
        label-width="60px"
        class="login-box"
      >
        <h3 class="login-title">统一身份认证</h3>
        <el-form-item label="账号" prop="username">
          <el-input
            v-model.number="loginForm.username"
            placeholder="Username"
            @keyup.enter.native="submitForm('loginForm')"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            autocomplete="off"
            placeholder="Password"
            @keyup.enter.native="submitForm('loginForm')"
          ></el-input>
        </el-form-item>
        <el-form-item label="验证码" style="width: 75%" prop="captcha">
          <div class="captcha-input-container">
            <el-input
              v-model="loginForm.captcha"
              placeholder="Verify"
              autocomplete="off"
              @keyup.enter.native="submitForm('loginForm')"
            ></el-input>
            <img
              class="captcha-img"
              src=""
              ref="code"
              alt="verify"
              @click="changeCode"
            />
          </div>
        </el-form-item>
        <el-row type="flex" class="signup" justify="left">
          <el-form-item>
            <el-button
              icon="el-icon-s-custom"
              type="primary"
              @click="submitForm('loginForm')"
              >登陆</el-button
            >
            <el-button icon="el-icon-setting" @click="resetForm('loginForm')"
              >重置</el-button
            >
          </el-form-item>
        </el-row>
      </el-form>
    </el-row>
    <div class="footer">
      <el-row type="flex" class="small" justify="center">
        <footer class="footer">
          <small
            >东南大学成贤学院
            <a href="http://jsjx.cxxy.seu.edu.cn/">电子与计算机工程学院 </a>
            技术支持</small
          >
        </footer>
      </el-row>
    </div>
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
    //closeDebug console.log("mounted!");
  },
  methods: {
    //点击登陆，提交表单
    submitForm(formName) {
      let _this = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //前端校验通过后，进行登陆操作
          let params = new URLSearchParams();
          params.append("username", this.loginForm.username);
          params.append("password", this.loginForm.password);
          params.append("captcha", this.loginForm.captcha);
          login(params)
            .then((res) => {
              //closeDebug console.log("-----------获取登录信息---------------");
              //closeDebug console.log(res);
              if (res.code === 0) {
                _this.$message({
                  message: res.msg,
                  type: "success",
                });
                //设置登陆状态
                //_this.$store.commit("setLoginState", true);
                setTimeout(function() {
                  _this.$router.push({ path: "/eta/home" });
                }, 1000);
              } else {
                _this.$message({
                  message: res.msg,
                  type: "error",
                });
                _this.changeCode();
              }
            })
            .catch((failResponse) => {});
        } else {
          //前端校验未通过
          //closeDebug console.log("error submit!!");
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
          //closeDebug console.log(res);
          _this.$refs.code.setAttribute("src", window.URL.createObjectURL(res));
        })
        .catch((err) => {
          //closeDebug console.log(err);
        });
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
  },
};
</script>
<style>
.front {
  z-index: 1;
  position: absolute;
}
a {
  text-decoration-line: none;
  color: #303133;
}
.login {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100%;
  margin: auto;
  width: 100%;
  margin-bottom: -100px;
}
.login-box {
  display: flex;
  flex-direction: column;
  margin: auto;
  border-radius: 20px;
  padding: 25px 30px 25px;
  background: rgba(119, 119, 119, 0);
  box-shadow: 0 0 15px #7e8ca7;
  white-space: nowrap;
}
.login-title {
  text-align: center;
  margin: 10px auto 30px auto;
  color: #303133;
}
.el-col {
  border-radius: 5px;
}
.signup {
  display: flex;
  align-items: flex-end;
  width: 100%;
  line-height: 80px;
  text-align: center;
  bottom: 0;
}
body > .el-container {
  margin-bottom: 40px;
}
.captcha-input-container {
  display: flex;
  flex-direction: row;
}
.footer {
  position: fixed;
  left: 0px;
  bottom: 0px;
  width: 100%;
  height: 50px;
  font-size: 12px;
  text-align: center;
  background-color: rgb(255, 255, 255);
}
.captcha-img {
  height: 38px;
  width: 108px;
  margin-left: 10px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
}
</style>
