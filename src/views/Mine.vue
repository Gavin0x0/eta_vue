<template>
  <div class="mine">
    <h3>获奖记录</h3>
    <div v-show="!ifShowDetail">
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
        :default-sort="{ prop: 'date', order: 'descending' }"
      >
        <template v-for="col in Columns">
          <el-table-column
            align="center"
            v-if="col.ifShow"
            :prop="col.value"
            :width="col.width"
            :label="col.name"
            sortable="custom"
            :key="col.value"
          >
          </el-table-column>
        </template>
        <el-table-column label="操作" width="80" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleShow(scope.$index, scope.row)"
              >查看</el-button
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
    <template v-if="roleId === 5"
      ><StuDetail
        :detailData="detailData"
        :goback="goBack"
        v-show="ifShowDetail"
      >
      </StuDetail
    ></template>
    <template v-if="roleId !== 5"
      ><TeaDetail
        :detailData="detailData"
        :goback="goBack"
        v-show="ifShowDetail"
      >
      </TeaDetail
    ></template>
  </div>
</template>

<script>
import { getMyAwardList, getStuDetail, getTeaDetail } from "../api";
import StuDetail from "../components/StuDetail.vue";
import TeaDetail from "../components/TeaDetail.vue";
import { mapGetters } from "vuex";
export default {
  name: "Mine",
  components: { StuDetail, TeaDetail },
  computed: {
    ...mapGetters(["roleId"]),
  },
  data() {
    return {
      ifSmall: false,
      paginationLayout: "prev, pager,next, jumper, ->, total, sizes",
      ifShowDetail: false,
      detailData: {},
      currentPage: 1,
      pageSize: 10,
      tableData: [{}],
      // 数据列
      Columns: [
        { name: "审核状态", value: "reviewName", width: "120", ifShow: true },
        { name: "奖项", value: "awardName", width: "280", ifShow: true },
        { name: "获奖等级", value: "rankName", width: "120", ifShow: true },
        { name: "上传时间", value: "createAt", width: "auto", ifShow: true },
      ],
      dataCount: 0, //总数据条数
    };
  },
  mounted() {
    this.getTableData(10, 1);
    if (document.documentElement.clientWidth < 720) {
      //closeDebug console.log("触发移动端布局");
      this.paginationLayout = "prev, pager, next,  ->, total";
      this.ifSmall = true;
      this.Columns = [
        { name: "状态", value: "reviewName", width: "80", ifShow: true },
        { name: "奖项", value: "awardName", width: "auto", ifShow: true },
        { name: "等级", value: "rankName", width: "120", ifShow: false },
        { name: "上传时间", value: "createAt", width: "auto", ifShow: false },
      ];
    }
  },
  methods: {
    //调用接口取数据
    getTableData(limit, page) {
      //参数绑定「分页大小、页码」
      let params = new URLSearchParams();
      params.append("limit", limit);
      params.append("page", page);
      getMyAwardList(params)
        .then((res) => {
          //closeDebug console.log("-----------获取表格数据---------------");
          //closeDebug console.log(res.data);
          (this.tableData = res.data), (this.dataCount = res.count);
        })
        .catch((failResponse) => {});
    },
    //数据格式化
    formatter(row, column) {
      return row.address;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      //closeDebug console.log(`每页 ${val} 条`);
      this.getTableData(val, 1);
    },
    handleCurrentChange(val) {
      //closeDebug console.log(`当前页: ${val}`);
      this.getTableData(this.pageSize, val);
    },
    handleShow(index, row) {
      //closeDebug console.log("点击查看", index, row);
      let params = new URLSearchParams();
      params.append("id", row.id);
      if (this.roleId === 5) {
        getStuDetail(params)
          .then((res) => {
            //closeDebug console.log("-----------获取学生奖项详情---------------");
            let obj = JSON.parse(res.msg);
            //closeDebug console.log("个人奖项详情", obj);
            this.detailData = obj;
          })
          .catch((failResponse) => {});
      } else {
        getTeaDetail(params)
          .then((res) => {
            //closeDebug console.log("-----------获取教师奖项详情---------------");
            let obj = JSON.parse(res.msg);
            //closeDebug console.log("个人奖项详情", obj);
            this.detailData = obj;
          })
          .catch((failResponse) => {});
      }

      this.ifShowDetail = true;
    },
    //返回重选奖项
    goBack() {
      this.ifShowDetail = false;
    },
  },
};
</script>

<style>
.pagination {
  margin-top: 20px;
}
</style>
