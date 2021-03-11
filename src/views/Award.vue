<template>
  <div class="award">
    <h3>奖项管理</h3>
    <el-form :inline="true" class="demo-form-inline" size="mini">
      <el-form-item>
        <el-input v-model="form2Query.key" placeholder="搜索奖项"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="form2Query.type"
          placeholder="全部等级"
          style="width:140px"
        >
          <el-option label="全部等级" value="0"></el-option>
          <el-option label="学生奖项" value="1"></el-option>
          <el-option label="教师奖项" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onQuery">筛选</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleAddAward">添加奖项</el-button>
      </el-form-item>
    </el-form>
    <div class="check-group">
      <span>显示列：</span>
      <el-checkbox
        v-for="col in Columns"
        v-model="col.ifShow"
        :key="col.value"
        size="small"
        style="margin-right:10px"
        >{{ col.name }}</el-checkbox
      >
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      @sort-change="onSortChange"
    >
      <template v-for="col in Columns">
        <el-table-column
          v-if="col.ifShow"
          :prop="col.value"
          :width="col.width"
          :label="col.name"
          sortable="custom"
          :key="col.value"
        >
        </el-table-column>
      </template>
      <el-table-column label="操作" width="150" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleUpdate(scope.$index, scope.row)"
            style="margin-right:10px"
            >编辑</el-button
          >
          <el-popconfirm
            confirm-button-text="确认删除"
            cancel-button-text="不用了"
            confirm-button-type="danger"
            cancel-button-type=""
            icon="el-icon-info"
            icon-color="red"
            title="警告：这会删除所有相关获奖记录！"
            @confirm="handleDel(scope.$index, scope.row)"
          >
            <el-button size="mini" type="danger" slot="reference"
              >删除</el-button
            >
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40, 50, 100]"
      :page-size="pageSize"
      :layout="paginationLayout"
      :small="ifSmall"
      :total="dataCount"
    >
    </el-pagination>
    <el-dialog title="编辑奖项名" :visible.sync="ifShowUpdateDialog" width="90%">
      <span
        >正在编辑：{{ selectAward.typeName }} >>
        {{ selectAward.awardName }}</span
      >
      <div style="margin: 10px 0;"></div>
      <el-input type="text" placeholder="请输入新奖项名" v-model="newAwardName">
      </el-input>
      <div style="margin: 10px 0;"></div>
      <el-button type="primary" @click="confirmUpdate" style="width:100%"
        >提交</el-button
      >
    </el-dialog>
    <el-dialog title="添加奖项" :visible.sync="ifShowAddDialog" width="90%">
      <el-form
        ref="addAwardForm"
        class="demo-form-inline"
        :model="addAwardForm"
        label-position="top"
      >
        <el-form-item label="奖项类型" prop="type">
          <el-select
            style="width:100%"
            v-model="addAwardForm.type"
            placeholder="请选择奖项类型"
          >
            <el-option label="学生奖项" value="1"> </el-option>
            <el-option label="教师奖项" value="2"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="奖项名称" prop="name">
          <el-input
            type="text"
            placeholder="请输入奖项名"
            v-model="addAwardForm.name"
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="confirmAdd" style="width:100%"
            >添加</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { addAward, delAward, getAllAwardList, updateAwardName } from "../api";
export default {
  name: "Award",
  components: {},
  computed: {},
  data() {
    return {
      ifSmall:false,
      paginationLayout: "prev, pager,next, jumper, ->, total, sizes",
      // 数据列
      Columns: [
        { name: "奖项ID", value: "id", width: "90", ifShow: true },
        { name: "奖项类型", value: "typeName", width: "120", ifShow: true },
        { name: "奖项名称", value: "awardName", width: "auto", ifShow: true },
      ],
      addAwardForm: {
        name: "",
        type: "",
      },
      currentPage: 1,
      pageSize: 10,
      tableData: [{}], //展示的数据
      dataCount: 0, //总数据条数
      orderMode: "desc", //排序方式
      orderField: "", //排序字段
      //用于筛选的表单
      form2Query: {
        key: "", //奖项关键词
        type: "0", //奖项类型
      },
      ifShowUpdateDialog: false,
      ifShowAddDialog: false,
      newAwardName: "", //新奖项名
      selectAward: {}, //选中的奖项的id
    };
  },
  mounted() {
    this.onQuery();
    if (document.documentElement.clientWidth < 720) {
      console.log("触发移动端布局");
      this.paginationLayout = "prev, pager,next, ->, total";
      this.ifSmall = true
      this.Columns=[
        { name: "奖项ID", value: "id", width: "90", ifShow: false },
        { name: "奖项类型", value: "typeName", width: "100", ifShow: false },
        { name: "奖项名称", value: "awardName", width: "auto", ifShow: true },
      ]
    }
  },
  methods: {
    //数据格式化(还没用到)
    formatter(row, column) {
      return row.address;
    },
    //处理每页显示数据量变化
    handleSizeChange(val) {
      this.pageSize = val;
      console.log(`每页 ${val} 条`);
      this.onQuery();
    },
    //处理跳页
    handleCurrentChange(val) {
      this.currentPage = val;
      console.log(`当前页: ${val}`);
      this.onQuery();
    },
    //处理编辑奖项
    handleUpdate(index, row) {
      console.log("点击编辑", index, row);
      this.selectAward = row;
      this.ifShowUpdateDialog = true;
    },
    //确认编辑
    confirmUpdate() {
      let _this = this;
      let params = new URLSearchParams();
      params.append("id", this.selectAward.id);
      params.append("newName", this.newAwardName);
      updateAwardName(params)
        .then((res) => {
          console.log("-----------编辑奖项名---------------");
          if (res.code === 0) {
            _this.$message({
              message: res.msg,
              type: "success",
            });
            _this.onQuery();
          } else {
            _this.$message({
              message: res.msg,
              type: "error",
            });
          }
          //还原表单数据
          _this.selectAward = {};
          _this.newAwardName = "";
        })
        .catch((failResponse) => {});
      this.ifShowUpdateDialog = false;
    },
    //处理添加奖项
    handleAddAward() {
      this.ifShowAddDialog = true;
    },
    //确认添加
    confirmAdd() {
      let _this = this;
      let params = new URLSearchParams();
      params.append("name", this.addAwardForm.name);
      params.append("type", this.addAwardForm.type);
      addAward(params)
        .then((res) => {
          console.log("-----------添加奖项名---------------");
          if (res.code === 0) {
            _this.$message({
              message: res.msg,
              type: "success",
            });
            _this.onQuery();
          } else {
            _this.$message({
              message: res.msg,
              type: "error",
            });
          }
        })
        .catch((failResponse) => {});
      this.ifShowAddDialog = false;
      this.$refs.addAwardForm.resetFields();
    },
    //处理删除奖项
    handleDel(index, row) {
      console.log("点击删除", index, row);
      let params = new URLSearchParams();
      params.append("ids[]", row.id);
      let _this = this;
      delAward(params)
        .then((res) => {
          console.log("-----------删除奖项---------------");
          if (res.code === 0) {
            _this.$message({
              message: res.msg,
              type: "success",
            });
            _this.onQuery();
          } else {
            _this.$message({
              message: res.msg,
              type: "error",
            });
          }
        })
        .catch((failResponse) => {});
    },
    //处理数据筛选
    onQuery() {
      console.log("submit:", this.form2Query);
      //参数绑定「分页大小、页码以及筛选参数」
      let params = new URLSearchParams();
      params.append("limit", this.pageSize);
      params.append("page", this.currentPage);
      params.append("key", this.form2Query.key); //奖项名
      params.append("type", this.form2Query.type); //奖项类型
      params.append("order", this.orderMode);
      getAllAwardList(params)
        .then((res) => {
          console.log("-----------获取筛选后的表格数据---------------");
          console.log(res.data);
          this.tableData = res.data;
          this.dataCount = res.count;
        })
        .catch((failResponse) => {});
    },
    //处理排序后重新获取数据
    onSortChange(res) {
      console.log("触发排序:", res);
      if (res.order) {
        this.orderMode = res.order === "descending" ? "desc" : "asc";
        this.orderField = res.prop;
      } else {
        this.orderMode = "desc";
        this.orderField = "";
      }
      console.log(this.orderMode, this.orderField);
      this.onQuery();
    },
  },
};
</script>

<style>
.pagination {
  margin-top: 20px;
}
.check-group {
  margin-bottom: 10px;
}
.check-group > span {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}
</style>
