<template>
  <div class="upload">
    <h3>上传奖项</h3>

    <!---奖项列表部分，选中奖项后隐藏--->
    <div v-show="!ifSelected">
      <el-form :inline="true" class="demo-form-inline" size="small">
        <el-form-item>
          <el-input
            v-model="search"
            style="width:130px"
            placeholder="查找关键字"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查找</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancelSearch">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        :default-sort="{ prop: 'awardName', order: 'descending' }"
      >
        <el-table-column prop="awardName" label="奖项名称"> </el-table-column>
        <el-table-column label="操作" width="80" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
              >上传</el-button
            >
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
    </div>

    <!---提交表单部分，选中奖项后显示--->

    <UploadForm
      :awardName="awardSelected"
      :awardId="awardIdSelected"
      :goback="goBack"
      v-show="ifSelected"
    >
    </UploadForm>
  </div>
</template>

<script>
import { getAwardList } from "../api";
import { mapGetters } from "vuex";
import UploadForm from "../components/UploadForm.vue";
export default {
  name: "Upload",
  components: { UploadForm },
  data() {
    return {
      ifSmall:false,
      paginationLayout:"prev, pager,next,  ->, total",
      ifSelected: false,
      awardSelected: "",
      awardIdSelected: 0,
      currentPage: 1,
      pageSize: 10,
      tableData: [{}],
      dataCount: 0, //总数据条数
      search: "",
    };
  },
  mounted() {
    this.getTableData();
    if (document.documentElement.clientWidth < 720) {
      console.log("触发移动端布局");
      this.ifSmall = true
    }
  },
  methods: {
    //调用接口取数据
    getTableData() {
      //参数绑定「分页大小、页码」
      let params = new URLSearchParams();
      params.append("limit", this.pageSize);
      params.append("page", this.currentPage);
      params.append("key", this.search);
      getAwardList(params)
        .then((res) => {
          console.log("-----------获取表格数据---------------");
          console.log(res.data);
          this.tableData = res.data;
          this.dataCount = res.count;
        })
        .catch((failResponse) => {});
    },
    //查找奖项
    onSearch() {
      this.getTableData();
    },
    //取消查找
    cancelSearch(){
      this.search = "";
      this.getTableData();
    },
    //数据格式化
    formatter(row, column) {
      return row.address;
    },
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      console.log(`每页 ${val} 条`);
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      console.log(`当前页: ${val}`);
      this.getTableData();
    },
    //处理选中，隐藏奖项列表，显示提交表单
    handleEdit(index, row) {
      console.log("选中了", index, row);
      this.awardSelected = row.awardName;
      this.awardIdSelected = row.id;
      this.ifSelected = true;
    },
    //返回重选奖项
    goBack() {
      this.ifSelected = false;
    },
  },
  computed: {
    ...mapGetters([]),
  },
};
</script>

<style>
.upload > .el-button {
  margin-top: 1em;
  margin-bottom: 1em;
}
.back-button {
  margin-top: 1em;
  margin-bottom: 1em;
}
.pagination {
  margin-top: 20px;
}
</style>
