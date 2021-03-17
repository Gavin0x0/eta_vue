<template>
  <div class="password">
    <h3>修改密码</h3>
    <el-form
      :model="uploadForm"
      status-icon
      :rules="rules"
      ref="uploadForm"
      label-width="100px"
      class="demo-uploadForm"
    >
      <el-form-item label="旧密码" prop="oldPass">
        <el-input
          type="password"
          v-model="uploadForm.oldPass"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPass">
        <el-input
          type="password"
          v-model="uploadForm.newPass"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input
          type="password"
          v-model="uploadForm.checkPass"
          autocomplete="off"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('uploadForm')"
          >提交</el-button
        >
        <el-button @click="resetForm('uploadForm')">清空</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { updatePass } from "../api";
export default {
  name: "Password",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else {
        if (this.uploadForm.checkPass !== "") {
          this.$refs.uploadForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.uploadForm.newPass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      uploadForm: {
        oldPass: "",
        newPass: "",
        checkPass: "",
      },
      rules: {
        oldPass: { required: true, message: "请输入旧密码", trigger: "blur" },
        newPass: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          { validator: validatePass, trigger: "blur" },
          {
            pattern: new RegExp("^[a-zA-Z0-9_]{6,20}$"),
            message: "密码长度在6-20个字符，由数字和字母组成",
          },
        ],
        checkPass: [
          { required: true, message: "请再次输入密码", trigger: "blur" },
          { validator: validatePass2, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
    let _this = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //前端校验通过后，进行登陆操作
          let params = new URLSearchParams();
          params.append("old-pass", this.uploadForm.oldPass);
          params.append("new-pass", this.uploadForm.newPass);
          params.append("new-pass-v", this.uploadForm.checkPass);
          updatePass(params)
            .then((res) => {
              //closeDebug console.log("-----------提交密码修改---------------");
              //closeDebug console.log(res);
              if (res.code === 0) {
                _this.$message({
                  message: res.msg,
                  type: "success",
                });
              } else {
                _this.$message({
                  message: res.msg,
                  type: 'error'
                });
              }
            })
            .catch((failResponse) => {});
        } else {
          //closeDebug console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style></style>
