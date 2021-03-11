<template>
  <div class="upadte-award-image">
    <el-button
      @click="onUpdateImg"
      style="margin:10px"
      type="primary"
      >更新图片</el-button
    >
    <el-dialog title="更新奖项图片" :visible.sync="ifShowUpdateDialog" width="90%">
      <i class="header-icon el-icon-info"></i>
      <span
        >提交更新后若网页上显示原图片，清理浏览器缓存即可</span
      >
      <el-divider></el-divider>
      <el-dialog :visible.sync="previewVisible" width="80%" append-to-body>
        <img width="80%" :src="dialogImageUrl" alt="" />
      </el-dialog>
      <el-upload
        class="upload-card"
        ref="upload"
        action="#"
        :auto-upload="false"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :on-exceed="handleExceed"
        :on-change="handleChange"
        :file-list="fileList"
        :multiple="true"
        list-type="picture"
        :limit="5"
        drag
        accept="image/jpeg,image/png"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">
          只能上传 jpg/png 格式文件，且不超过10MB，最多上传5张
        </div>
      </el-upload>

      <span slot="footer" class="dialog-footer">
        <el-button @click="ifShowUpdateDialog = false">取 消</el-button>
        <el-button type="primary" @click="updateAwardImage">立即提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { updateAwardImg } from "../api";
export default {
  name: "UpdateAwardButton",
  props: ['id'],
  data() {
    return {
      id:this.id,
      ifShowUpdateDialog: false,
      dialogImageUrl: "", //图片预览的url
      previewVisible: false, //是否显示预览
      awardPicList: [],
    };
  },
  methods: {
    //打开更新图片弹窗
    onUpdateImg() {
      this.ifShowUpdateDialog = true;
    },
    // 文件上传
    updateAwardImage() {
      let _this = this;
      //closeDebug console.log("updateAwardImage");
      // 通过 FormData 对象上传文件
      var formData = new FormData();
      formData.append("id", this.id);
      //循环加入多文件
      let filesList = this.awardPicList;
      for (let i = 0; i < filesList.length; i++) {
        formData.append("file", filesList[i].raw, filesList[i].raw.name);
        //closeDebug console.log("加入了一个文件");
      }
      updateAwardImg(formData)
        .then((res) => {
          //closeDebug console.log("-----------更新图片---------------");
          //closeDebug console.log("服务器返回值：", res);
          if (res.code === 0) {
            _this.$notify({
              title: res.msg,
              message: "提交更新后若网页上显示原图片，别担心，清理浏览器缓存即可正常显示",
              type: "success",
              duration: 0
            });
          } else {
            _this.$message({
              message: res.msg,
              type: "error",
            });
          }
          _this.$refs.upload.clearFiles();
        })
        .catch((failResponse) => {});
      this.ifShowUpdateDialog = false;
    },
    //处理已上传图片与表单内容的同步
    handleChange(file, fileList) {
      //closeDebug console.log("添加图片后", file, fileList);
      this.awardPicList = fileList;
    },
    //处理已上传的图片的删除
    handleRemove(file, fileList) {
      //closeDebug console.log("删除图片后", file, fileList);
    },
    //处理已上传的图片的点击预览
    handlePreview(file) {
      //closeDebug console.log("点击预览了", file);
      this.dialogImageUrl = file.url;
      this.previewVisible = true;
    },
    //处理上传图片超过限制
    handleExceed(files, fileList) {
      //closeDebug console.log("数量超出限制时", files, fileList);
      this.$message({
        message: "已达到图片数量上限",
        type: "error",
      });
    },
  },
};
</script>

<style>
.upload-card .el-upload-dragger {
  width: 100% !important;
}
.upload-card .el-upload {
  width: 100%;
}
</style>
