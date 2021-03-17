<template>
  <div class="import-stu">
    <h3>学生导入</h3>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>操作提示</span>
        <el-button style="float: right;" @click="handleDownload" type="primary"
          >下载模板</el-button
        >
      </div>
      <h3>
        先下载学生模板，并按照要求录入班级数据「请勿随意更改模板内容」，完成后先选择班级再拖至下方进行上传「每次导入一个班级」
      </h3>
    </el-card>

    <el-divider></el-divider>
    <el-form :inline="true" class="demo-form-inline" >
      <el-form-item>
        <span class="head-title">选择要导入的班级</span>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="form2Query.gradeId"
          placeholder="全部年级"
          @change="QueryClass"
          style="width:140px"
        >
          <el-option label="全部年级" value=""></el-option>
          <el-option
            v-for="opt in gradeList"
            :key="opt.id"
            :label="opt.gradeName"
            :value="opt.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="form2Query.majorId"
          placeholder="全部专业"
          @change="QueryClass"
          style="width:160px"
        >
          <el-option label="全部专业" value=""></el-option>
          <el-option
            v-for="opt in majorList"
            :key="opt.id"
            :label="opt.majorName"
            :value="opt.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="form2Query.classId"
          placeholder="请选择班级"
          style="width:180px"
            @change="selectClass"
        >
          <el-option
            v-for="opt in classList"
            :key="opt.id"
            :label="opt.className"
            :value="opt.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-upload
      ref="upload"
      class="upload-card"
      :limit="1"
      action="#"
      drag
      :http-request="uploadFile"
      list-type="text"
      accept=".xls"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将表格拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">
        只能上传模板表格
      </div>
    </el-upload>
  </div>
</template>

<script>
import {
  getStuTemplate,
  uploadStuTemplate,
  initManageStu,
  getClassList,
} from "../api";
export default {
  name: "ImportStu",
  components: {},
  computed: {},
  data() {
    return {
      //用于筛选的表单
      form2Query: {
        gradeId: "", //年级
        majorId: "", //专业
        classId: "",
      },
      //下拉栏内容列表
      gradeList: [],
      majorList: [],
      classList: [],
      currentClass: "",
    };
  },
  mounted() {
    this.initQueryList();
  },
  methods: {
    //初始化查询参数
    initQueryList() {
      initManageStu()
        .then((res) => {
          //closeDebug console.log("-----------初始化查询参数---------------");
          let obj = JSON.parse(res.msg);
          //closeDebug console.log(obj);
          this.gradeList = obj.grade;
          this.majorList = obj.major;
        })
        .catch((failResponse) => {});
    },
    //更新可供筛选的班级列表
    QueryClass() {
      let _this = this;
      //closeDebug console.log("选中的筛选值","年级：",this.form2Query.gradeId,"专业",this.form2Query.majorId);
      let params = new URLSearchParams();
      params.append("gradeId", this.form2Query.gradeId);
      params.append("majorId", this.form2Query.majorId);
      getClassList(params)
        .then((res) => {
          //closeDebug console.log("-----------获取班级列表---------------");
          //closeDebug console.log(res);
          _this.classList = res;
        })
        .catch((failResponse) => {});
    },
    //遍历出当前选中的班级名
    selectClass(e){
      for(let it in this.classList){
        if(e==this.classList[it].id){
          this.currentClass = this.classList[it].className
          //closeDebug console.log("selectClass",this.classList[it].className)
        }
      }
    },
    //处理下载模板表格
    handleDownload() {
      getStuTemplate()
        .then((res) => {
          //closeDebug console.log("-----------下载学生模板---------------");
          //closeDebug console.log(res);
          const blob = new Blob([res.data]);
          var downloadElement = document.createElement("a");
          var href = window.URL.createObjectURL(blob);
          downloadElement.href = href;
          downloadElement.download = decodeURIComponent("学生导入模板.xls");
          document.body.appendChild(downloadElement);
          downloadElement.click();
          document.body.removeChild(downloadElement);
          window.URL.revokeObjectURL(href);
        })
        .catch((failResponse) => {});
    },
    // 文件上传
    uploadFile(params) {
      let _this = this;
      //closeDebug console.log("uploadFile", params);
      const _file = params.file;
      // 通过 FormData 对象上传文件
      var formData = new FormData();
      formData.append("file", _file);
      formData.append("class", this.form2Query.classId);
      uploadStuTemplate(formData)
        .then((res) => {
          //closeDebug console.log("-----------模板上传---------------");
          //closeDebug console.log("服务器返回值：", res);
          if (res.code === 0) {
            _this.$notify({
              title: this.currentClass,
              message: res.msg,
              type: "success",
              duration: 0
            });
            _this.form2Query.classId = ""
          } else {
            _this.$notify.error({
              title: this.currentClass,
              message: res.msg,
              duration: 0
            });
          }
          _this.$refs.upload.clearFiles();
        })
        .catch((failResponse) => {});
    },
  },
};
</script>

<style>
.head-title{
  font-size: 16px;
  font-weight: bold;
}
.upload-card .el-upload-dragger {
  width: 100% !important;
}
.upload-card .el-upload {
  width: 100%;
}
</style>
