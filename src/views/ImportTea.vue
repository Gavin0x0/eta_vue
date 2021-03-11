<template>
  <div class="import-tea">
    <h3>教师导入</h3>

    <el-card class="box-card">
  <div slot="header" class="clearfix">
    <span>操作提示</span>
    <el-button style="float: right;" @click="handleDownload" type="primary" >下载模板</el-button>
  </div>
  <h3>先下载教师模板，并按照要求录入数据「请勿随意更改模板内容」，完成后拖至下方进行上传</h3>
</el-card>
    <el-divider></el-divider>
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
import { getTeaTemplate, uploadTeaTemplate } from "../api";
export default {
  name: "ImportTea",
  components: {},
  computed: {},
  data() {
    return {};
  },
  methods: {
    //处理下载模板表格
    handleDownload() {
      getTeaTemplate()
        .then((res) => {
          //closeDebug console.log("-----------下载教师模板---------------");
          //closeDebug console.log(res);
          const blob = new Blob([res.data]);
          var downloadElement = document.createElement("a");
          var href = window.URL.createObjectURL(blob);
          downloadElement.href = href;
          downloadElement.download = decodeURIComponent("教师导入模板.xls");
          document.body.appendChild(downloadElement);
          downloadElement.click();
          document.body.removeChild(downloadElement);
          window.URL.revokeObjectURL(href);
        })
        .catch((failResponse) => {});
    },
    // 文件上传
    uploadFile(params) {
        let _this = this
      //closeDebug console.log("uploadFile", params);
      const _file = params.file;
      // 通过 FormData 对象上传文件
      var formData = new FormData();
      formData.append("file", _file);
      uploadTeaTemplate(formData)
        .then((res) => {
          //closeDebug console.log("-----------模板上传---------------");
          //closeDebug console.log("服务器返回值：", res);
          if (res.code === 0) {
            _this.$message({
              message: res.msg,
              type: "success",
            });
          } else {
            _this.$message({
              message: res.msg,
              type: "error",
            });
          }
          _this.$refs.upload.clearFiles()
        })
        .catch((failResponse) => {});
    },
  },
};
</script>

<style>
.upload-card  .el-upload-dragger {
    width: 100% !important;
}
.upload-card  .el-upload {
    width: 100%;
}
</style>
