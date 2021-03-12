<template>
  <div>
    <el-page-header @back="goback()" content="奖项详情页"> </el-page-header>
    <el-carousel :interval="4000" height="300px" type="card">
      <el-carousel-item v-for="item in detailData.imagePaths" :key="item">
        <el-image
          style="width: auto; height: 300px"
          :src="item"
          fit="scale-down"
          :preview-src-list="detailData.imagePaths"
          ><div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i></div
        ></el-image>
      </el-carousel-item>
    </el-carousel>
    <template v-for="item in detailList">
      <el-row
        type="flex"
        class="row-container"
        justify="center"
        :key="item.value"
      >
        <el-col :xs="8" :sm="4"
          ><div class="row-title">{{ item.title }}</div></el-col
        >
        <el-col :xs="16" :sm="8"
          ><div class="row-content">{{ detailData[item.value] }}</div></el-col
        >
      </el-row>
    </template>

  </div>
</template>

<script>
import { getImage } from "../api";
/**
 * <el-image
      
      :src="item"
      fit="scale-down">
      <div slot="error" class="image-slot">
        <i class="el-icon-picture-outline"></i>
      </div></el-image>
 */
export default {
  name: "TeaDetail",
  props: {
    detailData: {},
    goback: { type: Function },
  },
  data() {
    return {
      detailList: [
        { title: "教职工号", value: "username" },
        { title: "姓名", value: "name" },
        { title: "性别", value: "gender" },
        { title: "奖项名称", value: "award" },
        { title: "奖项级别", value: "rank" },
        { title: "获奖名次", value: "place" },
        { title: "获奖日期", value: "time" },
        { title: "上传时间", value: "createAt" },
        { title: "审核状态", value: "review" },
        { title: "审核时间", value: "reviewAt" },
      ],
    };
  },

  methods: {
    randerImage(path) {
      //closeDebug console.log("ImgPath", path);
      getImage(path)
        .then((res) => {
          //closeDebug console.log(res);
          _this.$refs.code.setAttribute("src", window.URL.createObjectURL(res));
        })
        .catch((err) => {
          //closeDebug console.log(err);
        });
    },
  },
};
</script>
<style>
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
