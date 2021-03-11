<template>
  <div class="query-stu">
    <h3>管理学生获奖</h3>
    <div v-show="!ifShowDetail">
      <el-form :inline="true" class="demo-form-inline" size="mini">
        <el-form-item>
          <el-select
            v-model="form2Query.gradeId"
            placeholder="全部年级"
            @change="QueryClass"
            style="width:140px"
          >
            <el-option label="全部年级" value=""></el-option>
            <el-option
              v-for="opt in gradeList"
              :key="opt.id"
              :label="opt.gradeName"
              :value="opt.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="form2Query.majorId"
            placeholder="全部专业"
            @change="QueryClass"
            style="width:160px"
          >
            <el-option label="全部专业" value=""></el-option>
            <el-option
              v-for="opt in majorList"
              :key="opt.id"
              :label="opt.majorName"
              :value="opt.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="form2Query.classId"
            placeholder=""
            style="width:180px"
          >
            <el-option label="全部班级" value=""></el-option>
            <el-option
              v-for="opt in classList"
              :key="opt.id"
              :label="opt.className"
              :value="opt.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="form2Query.keyUsername"
            placeholder="搜索学号"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="form2Query.keyName"
            placeholder="搜索姓名"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-form :inline="true" class="demo-form-inline" size="mini">
        <el-form-item>
          <el-select
            v-model="form2Query.rankId"
            placeholder="全部等级"
            style="width:140px"
          >
            <el-option label="全部等级" value=""></el-option>
            <el-option
              v-for="opt in rankList"
              :key="opt.id"
              :label="opt.rankName"
              :value="opt.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="form2Query.keyAwardName"
            placeholder="搜索奖项名称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onQuery">筛选</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onExportXLS"
            >导出获奖信息(XLS)</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onExportZIP"
            >导出获奖图片(ZIP)</el-button
          >
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
            show-overflow-tooltip
          >
          </el-table-column>
        </template>
        <el-table-column label="操作" width="150" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleShow(scope.$index, scope.row)" style="margin-right:10px"
              >查看</el-button
            >
            <el-popconfirm
            confirm-button-text="确认删除"
            cancel-button-text="不用了"
            confirm-button-type="danger"
            cancel-button-type=""
            icon="el-icon-info"
            icon-color="red"
            title="警告：确认删除？此操作不可逆！"
            @confirm="handleDel(scope.$index, scope.row)"
          >
            <el-button
              size="mini"
              type="danger"
              slot="reference"
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
    </div>
    <StuDetail :detailData="detailData" :goback="goBack" v-show="ifShowDetail">
    </StuDetail>
    
    <el-row type="flex" justify="center">
      <el-button
        @click="onSelect2Show"
        v-if="roleId===1"
        v-show="ifShowDetail"
        style="margin:10px"
        type="primary"
        >设为展示项</el-button
      >
      <UpdateAwardButton :id="selectId" v-show="ifShowDetail" v-if="roleId===1||roleId===3"></UpdateAwardButton>
    </el-row>
  </div>
</template>

<script>
import {
  getStuAwardList,
  getStuDetail,
  getClassList,
  initQueryStu,
  delStuAward,
  exportStuAwardXLS,
  exportStuAwardZIP,
  addAwardShow,
} from "../api";
import StuDetail from "../components/StuDetail.vue";
import UpdateAwardButton from "../components/UpdateAwardButton.vue"
import { mapGetters } from "vuex";
export default {
  name: "QueryStu",
  components: { StuDetail,UpdateAwardButton },
  computed: {},
  data() {
    return {
      selectId:0,
      ifSmall:false,
      paginationLayout: "prev, pager,next, jumper, ->, total, sizes",
      ifShowUpdateDialog:false,
      ifShowDetail: false,
      // 数据列
      Columns: [
        { name: "学号", value: "username", width: "120", ifShow: true },
        { name: "姓名", value: "name", width: "80", ifShow: true },
        { name: "班级", value: "className", width: "200", ifShow: false },
        { name: "奖项等级", value: "rankName", width: "120", ifShow: true },
        { name: "获奖名次", value: "awardPlace", width: "120", ifShow: true },
        { name: "奖项名称", value: "awardName", width: "", ifShow: true },
        { name: "获奖时间", value: "awardTime", width: "200", ifShow: false },
        { name: "上传时间", value: "createAt", width: "200", ifShow: false },
        { name: "审核时间", value: "reviewAt", width: "200", ifShow: false },
      ],
      detailData: {},
      currentPage: 1,
      pageSize: 10,
      tableData: [{}], //展示的数据
      dataCount: 0, //总数据条数
      orderMode: "", //排序方式
      orderField: "", //排序字段
      //用于筛选的表单
      form2Query: {
        gradeId: "", //年级
        majorId: "", //专业
        classId: "", //班级
        keyUsername: "", //用户id
        keyName: "", //姓名
        rankId: "", //获奖等级
        keyAwardName: "", //奖项名
      },
      //下拉栏内容列表
      gradeList: [],
      majorList: [],
      classList: [],
      rankList: [],
    };
  },
  computed: {
    ...mapGetters([
      "roleId",
    ]),
  },
  mounted() {
    this.initQueryList();
    this.onQuery();
    if (document.documentElement.clientWidth < 720) {
      //closeDebug console.log("触发移动端布局");
      this.ifSmall = true
      this.paginationLayout = "prev, pager,next, ->, total";
      this.Columns=[
        { name: "学号", value: "username", width: "120", ifShow: false },
        { name: "姓名", value: "name", width: "80", ifShow: true },
        { name: "班级", value: "className", width: "200", ifShow: false },
        { name: "奖项等级", value: "rankName", width: "120", ifShow: false },
        { name: "获奖名次", value: "awardPlace", width: "120", ifShow: false },
        { name: "奖项名称", value: "awardName", width: "auto", ifShow: true },
        { name: "获奖时间", value: "awardTime", width: "200", ifShow: false },
        { name: "上传时间", value: "createAt", width: "200", ifShow: false },
        { name: "审核时间", value: "reviewAt", width: "200", ifShow: false },
      ]
    }
  },
  methods: {
    //初始化查询参数
    initQueryList() {
      initQueryStu()
        .then((res) => {
          //closeDebug console.log("-----------初始化查询参数---------------");
          let obj = JSON.parse(res.msg);
          //closeDebug console.log(obj);
          this.gradeList = obj.grade;
          this.majorList = obj.major;
          this.rankList = obj.rank;
        })
        .catch((failResponse) => {});
    },
    //更新可供筛选的班级列表
    QueryClass() {
      let _this = this;
      //closeDebug console.log("选中的筛选值","年级：",this.form2Query.gradeId,"专业",this.form2Query.majorId,"班级",this.form2Query.classId);
      let params = new URLSearchParams();
      params.append("gradeId", this.form2Query.gradeId);
      params.append("majorId", this.form2Query.majorId);
      getClassList(params)
        .then((res) => {
          //closeDebug console.log("-----------获取班级列表---------------");
          //closeDebug console.log(res);
          _this.classList = res;
        })
        .catch((failResponse) => {});
    },
    //数据格式化(还没用到)
    formatter(row, column) {
      return row.address;
    },
    //处理每页显示数据量变化
    handleSizeChange(val) {
      this.pageSize = val;
      //closeDebug console.log(`每页 ${val} 条`);
      this.onQuery();
    },
    //处理跳页
    handleCurrentChange(val) {
      this.currentPage = val;
      //closeDebug console.log(`当前页: ${val}`);
      this.onQuery();
    },
    //处理查看详情
    handleShow(index, row) {
      //closeDebug console.log("点击查看", index, row);
      let params = new URLSearchParams();
      params.append("id", row.id);
      //closeDebug console.log("选择了",row.id)
      this.selectId = row.id
      getStuDetail(params)
        .then((res) => {
          //closeDebug console.log("-----------获取个人奖项详情---------------");
          let obj = JSON.parse(res.msg);
          //closeDebug console.log("个人奖项详情", obj);
          this.detailData = obj;
        })
        .catch((failResponse) => {});
      this.ifShowDetail = true;
    },
    //处理删除奖项
    handleDel(index, row) {
      //closeDebug console.log("点击删除", index, row);
      let params = new URLSearchParams();
      params.append("id", row.id);
      let _this = this;
      delStuAward(params)
        .then((res) => {
          //closeDebug console.log("-----------删除奖项---------------");
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
    //返回重选奖项
    goBack() {
      this.ifShowDetail = false;
    },
    //处理数据筛选
    onQuery() {
      //closeDebug console.log("submit:", this.form2Query);
      //参数绑定「分页大小、页码以及筛选参数」
      let params = new URLSearchParams();
      params.append("limit", this.pageSize);
      params.append("page", this.currentPage);
      params.append("gradeId", this.form2Query.gradeId); //年级
      params.append("majorId", this.form2Query.majorId); //专业
      params.append("classId", this.form2Query.classId); //班级
      params.append("keyUsername", this.form2Query.keyUsername); //用户id
      params.append("keyName", this.form2Query.keyName); //姓名
      params.append("rankId", this.form2Query.rankId); //获奖等级
      params.append("keyAwardName", this.form2Query.keyAwardName); //奖项名
      params.append("order", this.orderMode); //奖项名
      params.append("field", this.orderField); //奖项名
      getStuAwardList(params)
        .then((res) => {
          //closeDebug console.log("-----------获取筛选后的表格数据---------------");
          //closeDebug console.log(res.data);
          this.tableData = res.data;
          this.dataCount = res.count;
        })
        .catch((failResponse) => {});
    },
    //处理排序后重新获取数据
    onSortChange(res) {
      //closeDebug console.log("触发排序:", res);
      if (res.order) {
        this.orderMode = res.order === "descending" ? "desc" : "asc";
        this.orderField = res.prop;
      } else {
        this.orderMode = "";
        this.orderField = "";
      }
      //closeDebug console.log(this.orderMode, this.orderField);
      this.onQuery();
    },
    //处理导出学生奖项表格文件
    onExportXLS() {
      //closeDebug console.log("export XLS:", this.form2Query);
      //参数绑定「筛选参数」
      let params = new URLSearchParams();
      params.append("gradeId", this.form2Query.gradeId); //年级
      params.append("majorId", this.form2Query.majorId); //专业
      params.append("classId", this.form2Query.classId); //班级
      params.append("keyUsername", this.form2Query.keyUsername); //用户id
      params.append("keyName", this.form2Query.keyName); //姓名
      params.append("rankId", this.form2Query.rankId); //获奖等级
      params.append("keyAwardName", this.form2Query.keyAwardName); //奖项名
      exportStuAwardXLS(params)
        .then((res) => {
          //closeDebug console.log("-----------导出学生奖项表格文件---------------");
          //closeDebug console.log(res);
          const blob = new Blob([res.data]);
          var downloadElement = document.createElement("a");
          var href = window.URL.createObjectURL(blob);
          downloadElement.href = href;
          //new一个时间对象
          var nowDate = new Date().toLocaleDateString();
          downloadElement.download = decodeURIComponent(
            nowDate + "_学生奖项.xls"
          );
          document.body.appendChild(downloadElement);
          downloadElement.click();
          document.body.removeChild(downloadElement);
          window.URL.revokeObjectURL(href);
        })
        .catch((failResponse) => {});
    },
    //处理导出学生奖项表格文件
    onExportZIP() {
      //closeDebug console.log("export ZIP:", this.form2Query);
      //参数绑定「筛选参数」
      let params = new URLSearchParams();
      params.append("gradeId", this.form2Query.gradeId); //年级
      params.append("majorId", this.form2Query.majorId); //专业
      params.append("classId", this.form2Query.classId); //班级
      params.append("keyUsername", this.form2Query.keyUsername); //用户id
      params.append("keyName", this.form2Query.keyName); //姓名
      params.append("rankId", this.form2Query.rankId); //获奖等级
      params.append("keyAwardName", this.form2Query.keyAwardName); //奖项名
      exportStuAwardZIP(params)
        .then((res) => {
          //closeDebug console.log("-----------导出学生奖项表格文件---------------");
          //closeDebug console.log(res);
          const blob = new Blob([res.data]);
          var downloadElement = document.createElement("a");
          var href = window.URL.createObjectURL(blob);
          downloadElement.href = href;
          //new一个时间对象
          var nowDate = new Date().toLocaleDateString();
          downloadElement.download = decodeURIComponent(
            nowDate + "_学生奖项图片.zip"
          );
          document.body.appendChild(downloadElement);
          downloadElement.click();
          document.body.removeChild(downloadElement);
          window.URL.revokeObjectURL(href);
        })
        .catch((failResponse) => {});
    },
    //设置为首页展示项
    onSelect2Show() {
      let _this = this
      let imageList = this.detailData.imagePaths;
      for (let it in imageList) {
        //closeDebug console.log("imageurl", imageList[it]);
        //closeDebug console.log("imagecontent", this.detailData.award);
        let params = new URLSearchParams();
        params.append("imageurl", imageList[it]);
        params.append("imagecontent", this.detailData.award);
        addAwardShow(params)
          .then((res) => {
            //closeDebug console.log("-----------设置为首页展示项---------------");
            //closeDebug console.log(res);
            if (res.code === 0) {
                _this.$message({
                  message: res.msg,
                  type: "success",
                });
              } else {
                _this.$message({
                  message: res.msg,
                  type: 'error'
                });
              }
          })
          .catch((failResponse) => {});
      }
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
