<template>
  <div class="info-card">
    <el-card shadow="always">
      <div slot="header" class="clearfix">
        <span>公告</span>
        <el-button
          v-if="roleId === 1"
          style="float: right; padding: 3px 0"
          type="text"
          @click="onChangeInform"
          >编辑</el-button
        >
      </div>

      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item
          :title="info.title"
          :name="info.id"
          v-for="info in tableData"
          :key="info.id"
        >
          <div>
            {{ info.content }}
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-card>
    <el-dialog title="编辑公告" :visible.sync="ifShowDialog" width="90%">
      <el-collapse>
        <el-collapse-item title="新建公告" >
          <el-input
            type="textarea"
            autosize
            placeholder="请输入公告标题"
            v-model="informTitle"
          >
          </el-input>
          <div style="margin: 10px 0;"></div>
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="请输入公告内容"
            v-model="informContent"
          >
          </el-input>
          <div style="margin: 10px 0;"></div>
          <el-button type="primary" @click="onAddInform" style="width:100%"
            >添加</el-button
          >
        </el-collapse-item>
      </el-collapse>
      <el-table :data="tableData">
        
        <el-table-column
          property="title"
          label="标题"
          width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          property="content"
          label="内容"
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
import { getInformList, delInform, addInform } from "../api";
//公告栏
export default {
  name: "Inform",
  props: ["roleId"],
  data() {
    return {
      ifShowDialog: false,
      currentPage: 1,
      pageSize: 10,
      tableData: [{}],
      dataCount: 0, //总数据条数
      activeNames: [],
      informTitle: "",
      informContent: "",
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    //获取公告
    getTableData() {
      let _this = this;
      //参数绑定「分页大小、页码」
      let params = new URLSearchParams();
      params.append("limit", this.pageSize);
      params.append("page", this.currentPage);
      getInformList(params)
        .then((res) => {
          //closeDebug console.log("-----------获取公告列表---------------");
          //closeDebug console.log(res.data);
          (_this.tableData = res.data), (_this.dataCount = res.count);
          let tempList = [];
          for (let i in res.data) {
            tempList.push(res.data[i].id);
          }
          _this.activeNames = tempList;
        })
        .catch((failResponse) => {});

      
    },
    //处理公告编辑
    onChangeInform() {
      this.ifShowDialog = true;
      this.getTableData();
    },
    //处理添加公告
    onAddInform() {
      let _this = this;
      let params = new URLSearchParams();
      params.append("title", this.informTitle);
      params.append("content", this.informContent);
      addInform(params)
        .then((res) => {
          //closeDebug console.log("-----------添加公告项---------------");
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
      this.informTitle = '';
      this.informContent = '';
    },
    //处理删除展示项
    handleDel(index, row) {
      //closeDebug console.log("点击删除", index, row);
      let params = new URLSearchParams();
      params.append("id", row.id);
      let _this = this;
      delInform(params)
        .then((res) => {
          //closeDebug console.log("-----------删除公告项---------------");
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
    //处理公告项展示切换
    handleChange(val) {
      //closeDebug console.log("展开了公告", val);
    },
  },
};
</script>

<style>
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.title-container {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.info-title {
  font-size: 26px;
}
.info-content {
  font-size: 16px;
  color: rgb(80, 80, 80);
}
</style>
