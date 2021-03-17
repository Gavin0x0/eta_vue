<template>
  <div class="UploadForm">
    <el-form
      :model="FormData"
      :rules="rules"
      label-position="top"
      ref="FormData"
      size="small"
      class="demo-FormData"
    >
      <el-form-item label="奖项名称" class="no-padding">
        <el-input v-model="awardName" readonly></el-input>
      </el-form-item>
      <el-form-item label="奖项等级" prop="rankId">
        <el-select
          v-model="FormData.rankId"
          placeholder="请选择奖项等级"
          style="display: block;"
        >
          <template v-for="rankEach in rankList">
            <el-option
              :label="rankEach.rankName"
              :value="rankEach.id"
              :key="rankEach.id"
            ></el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item label="获奖时间" prop="awardTime">
        <el-date-picker
          type="date"
          placeholder="选择日期"
          v-model="FormData.awardTime"
          style="width: 100%;"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="获奖名次" prop="awardPlace">
        <el-input
          v-model="FormData.awardPlace"
          placeholder="例如：一等奖、科技进步奖，无等级可填奖项名"
        ></el-input>
      </el-form-item>
      <el-dialog :visible.sync="dialogVisible" width="90%">
        <img width="100%" :src="dialogImageUrl" alt="" />
      </el-dialog>
      <el-form-item label="奖项图片" required prop="awardPicList">
        <el-upload
          class="img-upload"
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
          accept="image/jpeg,image/png"
        >
          <el-button size="small">上传图片</el-button>
          <div slot="tip" class="el-upload__tip">
            只能上传 jpg/png 格式文件，且不超过10MB，最多上传5张
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item style="margin-top:40px" size="medium">
        <el-button type="primary" @click="submitForm('FormData')"
          >立即提交</el-button
        >
        <el-button
          @click="
            cancelUpload('FormData');
            goback();
          "
          >取消</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getRankList, uploadAward } from "../api";

export default {
  name: "UploadForm",
  props: {
    awardName: String,
    awardId: Number,
    goback: { type: Function },
  },
  data() {
    return {
      fileList: [], //已上传的文件列表
      rankList: [], //奖项等级的列表「从后端取得」
      //表单数据
      FormData: {
        rankId: "",
        awardTime: "",
        awardPlace: "",
        awardPicList: [],
      },
      //<el-form-item>标签的prop值的校验规则
      rules: {
        awardPlace: [
          { required: true, message: "请输入获奖名次", trigger: "blur" },
          { min: 2, message: "长度需大于两个字符", trigger: "blur" },
        ],
        rankId: [
          { required: true, message: "请选择奖项等级", trigger: "change" },
        ],
        awardTime: [
          {
            required: true,
            message: "请选择日期",
            trigger: "change",
          },
        ],
        awardPicList: [
          { required: true, message: "请选择奖项图片", trigger: "blur" },
        ],
      },
      dialogImageUrl: "", //图片预览的url
      dialogVisible: false, //是否显示预览
    };
  },
  mounted() {
    this.initRankList();
  },
  methods: {
    //初始化奖项等级列表
    initRankList() {
      let _this = this;
      getRankList()
        .then((res) => {
          let obj = JSON.parse(res.msg);
          //closeDebug console.log("Ranklist初始化", obj);
          this.rankList = obj;
        })
        .catch((failResponse) => {});
    },
    //处理表单提交事件
    submitForm(formName) {
      let _this = this;
      //closeDebug console.log();
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data2upload = new FormData();
          //获取实际input组件的文件
          let filesList = this.FormData.awardPicList;
          data2upload.append("awardId", this.awardId);
          data2upload.append("awardName", this.awardName);
          data2upload.append("rankId", this.FormData.rankId);
          data2upload.append("awardTime", this.FormData.awardTime);
          data2upload.append("awardPlace", this.FormData.awardPlace);
          //循环加入多文件
          for (let i = 0; i < filesList.length; i++) {
            data2upload.append("file", filesList[i].raw, filesList[i].raw.name);
          }
          //   //closeDebug console.log("awardId", this.awardId);
          //   //closeDebug console.log("awardName", this.awardName);
          //   //closeDebug console.log("rankId", this.FormData.rankId);
          //   //closeDebug console.log("awardTime", this.FormData.awardTime);
          //   //closeDebug console.log("awardPlace", this.FormData.awardPlace);
          //   //closeDebug console.log("file", filesList);

          uploadAward(data2upload)
            .then((res) => {
              //closeDebug console.log("-----------表单提交---------------");
              //closeDebug console.log("服务器返回值：", res);
              if (res.code === 0) {
                _this.$message({
                  message: res.msg,
                  type: "success",
                });
                _this.cancelUpload("FormData");
                _this.goback();
              } else {
                _this.$message({
                  message: res.msg,
                  type: "error",
                });
              }
            })
            .catch((failResponse) => {});
        } else {
          this.$message({
            message: "填写的信息有误",
            type: "error",
          });
          return false;
        }
      });
    },
    //取消上传，清空文件列表及表单
    cancelUpload(formName) {
      this.$refs[formName].resetFields();
      this.$refs.upload.clearFiles();
    },
    //处理已上传图片与表单内容的同步
    handleChange(file, fileList) {
      //closeDebug console.log("添加图片后", file, fileList);
      this.FormData.awardPicList = fileList;
    },
    //处理已上传的图片的删除
    handleRemove(file, fileList) {
      //closeDebug console.log("删除图片后", file, fileList);
    },
    //处理已上传的图片的点击预览
    handlePreview(file) {
      //closeDebug console.log("点击预览了", file);
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
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

<!-- 添加 "scoped" 标签 可以使以下CSS样式仅在本组件生效 例：<style scoped> -->
<style>
.demo-FormData {
  width: auto;
}
</style>
