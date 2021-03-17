<template>
  <div>
    <el-page-header @back="goback()" content="奖项详情页"> </el-page-header>
    <el-carousel :interval="4000" height="300px" type="card">
      <el-carousel-item v-for="item in detailData.imagePaths" :key="item">
        <el-image
          class="image-row"
          :src="item"
          fit="scale-down"
          :preview-src-list="detailData.imagePaths"
          ><div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i></div
        ></el-image>
      </el-carousel-item>
    </el-carousel>
    <el-card class="box-card">
      <el-divider content-position="left"><span class="div-font">学生信息</span></el-divider>
      <el-row :gutter="20">
        <el-col class="detail-info" :span="12" :xs="24">学号：{{detailData.username}}</el-col>
        <el-col class="detail-info" :span="12" :xs="24">姓名：{{detailData.name}}</el-col>
        <el-col class="detail-info" :span="12" :xs="24">性别：{{detailData.gender}}</el-col>
        <el-col class="detail-info" :span="12" :xs="24">班级：{{detailData.class}}</el-col>
      </el-row>
      <el-divider content-position="left"><span class="div-font">奖项信息</span></el-divider>
      <el-row :gutter="20">
        <el-col class="detail-info" :span="12" :xs="24">奖项名称：{{detailData.award}}</el-col>
        <el-col class="detail-info" :span="12" :xs="24">奖项级别：{{detailData.rank}}</el-col>
        <el-col class="detail-info" :span="12" :xs="24">奖项名次：{{detailData.place}}</el-col>
        <el-col class="detail-info" :span="12" :xs="24">获奖日期：{{detailData.time}}</el-col>
      </el-row>
      <el-divider content-position="left"><span class="div-font">审核信息</span></el-divider>
      <el-row :gutter="20">
        <el-col class="detail-info" :span="12" :xs="24">上传时间：{{detailData.createAt}}</el-col>
        <el-col class="detail-info" :span="12" :xs="24">审核状态：{{detailData.review}}</el-col>
        <el-col class="detail-info" :span="12" :xs="24">审核时间：{{detailData.reviewAt}}</el-col>
      </el-row>
    </el-card>
    
  </div>
</template>

<script>
export default {
  name: "StuDetail",
  props: {
    detailData: {},
    goback: { type: Function },
  },
};
</script>
<style>
.div-font{
  font-size: 1.1em;
  font-weight: bold;
  color: black;
}
.detail-info {
  margin: 5px 0 10px 0;
  font-weight:normal;
  font-size: 0.9em;
}
.image-row {
  width: auto;
  height: 300px;
  display: flex;
  flex-direction: column;
}
.row-container {
  min-height: 30px;
  margin-top: 10px;
  border-bottom: 1px solid rgba(156, 156, 156, 0.849);
  margin-left: 10%;
  margin-right: 10%;
}
.row-title {
  text-align: center;
  font-weight: 500;
  font-size: 0.9rem;
}
.row-content {
  text-align: center;
  font-size: 0.9rem;
}
</style>
