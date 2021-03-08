<template>
  <div class="award-show">
    <div class="title-container">
      <h3>优秀奖项展示</h3>
      <el-button v-if="roleId === 1" type="text" @click="onChangeAwardShow"
        >编辑</el-button
      >
    </div>
    <el-carousel :interval="4000" :type="carouselType" height="300px">
      <el-carousel-item v-for="item in tableData" :key="item.id">
        <div class="image-item">
        <el-image
          style="width: auto; height: 300px"
          :src="item.imagePath"
          fit="scale-down"
          :preview-src-list="previewList"
          ><div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i></div
        ></el-image>
        <h3>{{item.writing}}</h3>
        </div>
      </el-carousel-item>
    </el-carousel>
    <el-dialog title="编辑展示项" :visible.sync="ifShowDialog" width="90%">
      <span>系统管理员可在「功能菜单」=>「管理学生获奖」=>「查看」中添加展示项（最多展示10项）</span>
      <el-table :data="tableData" style="margin-top:10px">
        <el-table-column
          property="writing"
          label="简述"
          width="200"
        ></el-table-column>
        <el-table-column
          property="imagePath"
          label="图片地址"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="操作" width="100" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="handleDel(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { getAwardShowList, delAwardShow } from "../api";
//优秀奖项展示
export default {
  name: "AwardShow",
  props: ["roleId"],
  data() {
    return {
      ifShowDialog: false,
      currentPage: 1,
      pageSize: 10,
      tableData: [{}],
      previewList: [],
      dataCount: 0, //总数据条数
      carouselType: "card",
      windowWidth: document.documentElement.clientWidth,
    };
  },
  mounted() {
    this.getTableData();
    if(this.windowWidth<720){
      this.carouselType=""
    }
  },
  methods: {
    getTableData() {
      let _this = this;
      //参数绑定「分页大小、页码」
      let params = new URLSearchParams();
      params.append("limit", this.pageSize);
      params.append("page", this.currentPage);
      getAwardShowList(params)
        .then((res) => {
          console.log("-----------获取展示的奖项列表---------------");
          console.log(res.data);
          (_this.tableData = res.data), (_this.dataCount = res.count);
          let tempList = [];
          for (let i in res.data) {
            tempList.push(res.data[i].imagePath);
          }
          _this.previewList = tempList;
        })
        .catch((failResponse) => {});
    },
    onChangeAwardShow() {
      this.ifShowDialog = true;
      this.getTableData();
    },
    //处理删除展示项
    handleDel(index, row) {
      console.log("点击删除", index, row);
      let params = new URLSearchParams();
      params.append("id", row.id);
      let _this = this;
      delAwardShow(params)
        .then((res) => {
          console.log("-----------删除展示项---------------");
          if (res.code === 0) {
            _this.$message({
              message: res.msg,
              type: "success",
            });
            _this.getTableData();
          } else {
            _this.$message({
              message: res.msg,
              type: "error",
            });
          }
        })
        .catch((failResponse) => {});
    },
  },
};
</script>

<style>


.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.title-container {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.image-item {
  height: 300px;
}
.image-item h3{
  color: #ffffff;
  text-shadow: 1px 2px 10px #1a1a1a;
  background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(24, 24, 24, 0.3));
  font-size: 16px;
  line-height: 80px;
  width: 100%;
  text-align: center;
  position: absolute;
  bottom: 0px;
  margin-block-end: 0;
}
</style>
