<template>
  
        <el-card class="info-card" shadow="always">
    <el-row :gutter="20" type="flex" class="row-bg" justify="end">
      <el-col :span="4" :xs="8"
        ><div class="item-container">
          <div class="item-title">学生奖项</div>
          <div class="item-content">{{ stuNum }}</div>
        </div></el-col
      >
      <el-divider direction="vertical"></el-divider>
      <el-col :span="4" :xs="8"
        ><div class="item-container">
          <div class="item-title">教师奖项</div>
          <div class="item-content">{{ teaNum }}</div>
        </div></el-col
      >
      <el-divider direction="vertical"></el-divider>
      <el-col :span="4" :xs="8"
        ><div class="item-container">
          <div class="item-title">总计奖项</div>
          <div class="item-content">{{ totalNum }}</div>
        </div></el-col
      >
    </el-row>

</el-card>
</template>

<script>
export default {
  name: "NumberCounter",
  props: {
    stuNum: Number,
    teaNum: Number,
    totalNum: Number,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-divider--vertical {
    margin: 8px 8px;
    height: 3em;
}
.item-container {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5715;
  list-style: none;
}
.item-title {
  margin-bottom: 4px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 0.8em;
}
.item-content {
  color: rgba(0, 0, 0, 0.85);
  font-size: 24px;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
    Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji,
    Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
}
</style>
