<template>
  <div class="manage-stu">
    <h3>学生管理</h3>
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
        <el-button type="primary" @click="onQuery">筛选</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" @click="handleResetPass">重置密码</el-button>
      </el-form-item>
      <el-form-item>
        <el-popconfirm
          confirm-button-text="确认删除"
          cancel-button-text="不用了"
          confirm-button-type="danger"
          cancel-button-type=""
          icon="el-icon-info"
          icon-color="red"
          title="警告：确认删除？此操作会删除所有相应记录，请谨慎操作"
          @confirm="handleDel"
        >
          <el-button type="danger" slot="reference">删除用户</el-button>
        </el-popconfirm>
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
      ref="multipleTable"
      :data="tableData"
      border
      style="width: 100%"
      @sort-change="onSortChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" type="selection" width="55">
      </el-table-column>
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
          <el-button
            size="mini"
            @click="select2Change(scope.$index, scope.row)"
            >编辑</el-button
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
      :total="dataCount"
    >
    </el-pagination>
    <el-dialog title="修改用户信息" :visible.sync="ifShowUpdateDialog" width="80%">
      <h4>在输入栏按下回车进行提交修改</h4>
      <el-form label-position="left" label-width="50px">
        <el-form-item label="姓名">
          <el-input v-model="selectStu.name" @focus="focusField" @change="handleChange" name="name"></el-input>
        </el-form-item>
        <el-form-item label="年级">
          <el-input v-model="selectStu.gradeId" @focus="focusField" @change="handleChange" name="gradeId"></el-input>
        </el-form-item>
        <el-form-item label="专业">
          <el-input v-model="selectStu.majorName" @focus="focusField" @change="handleChange" name="majorName"></el-input>
        </el-form-item>
        <el-form-item label="班级">
          <el-input v-model="selectStu.classNo" @focus="focusField" @change="handleChange" name="classNo"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  getStuList,
  initManageStu,
  getClassList,
  delStu,
  resetStuPass,
  updateStu,
} from "../api";
export default {
  name: "ManageStu",
  components: {},
  computed: {},
  data() {
    return {
      paginationLayout: "prev, pager,next, jumper, ->, total, sizes",
      ifShowUpdateDialog: false, //修改弹窗
      selectStu: {}, //选中的学生
      selectField: "", //正在修改的表单域
      // 数据列
      Columns: [
        { name: "编号", value: "userId", width: "100", ifShow: false },
        { name: "学号", value: "username", width: "120", ifShow: true },
        { name: "姓名", value: "name", width: "120", ifShow: true },
        { name: "性别", value: "genderName", width: "80", ifShow: false },
        { name: "年级", value: "gradeName", width: "100", ifShow: true },
        { name: "专业", value: "majorName", width: "auto", ifShow: true },
        { name: "班号", value: "classNo", width: "100", ifShow: true },
      ],
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
      },
      //下拉栏内容列表
      gradeList: [],
      majorList: [],
      classList: [],
      //选中的数据
      multipleSelection: [],
    };
  },
  computed: {},
  mounted() {
    this.initQueryList();
    this.onQuery();
    if (document.documentElement.clientWidth < 720) {
      console.log("触发移动端布局");
      this.paginationLayout = "prev, pager, next,  ->, total";
      
    }
  },
  methods: {
    //初始化查询参数
    initQueryList() {
      initManageStu()
        .then((res) => {
          console.log("-----------初始化查询参数---------------");
          let obj = JSON.parse(res.msg);
          console.log(obj);
          this.gradeList = obj.grade;
          this.majorList = obj.major;
        })
        .catch((failResponse) => {});
    },
    //更新可供筛选的班级列表
    QueryClass() {
      let _this = this;
      console.log(
        "选中的筛选值",
        "年级：",
        this.form2Query.gradeId,
        "专业",
        this.form2Query.majorId,
        "班级",
        this.form2Query.classId
      );
      let params = new URLSearchParams();
      params.append("gradeId", this.form2Query.gradeId);
      params.append("majorId", this.form2Query.majorId);
      getClassList(params)
        .then((res) => {
          console.log("-----------获取班级列表---------------");
          console.log(res);
          _this.classList = res;
        })
        .catch((failResponse) => {});
    },
    //处理多选框变化
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log("多选框：", val);
    },
    //处理重置用户密码
    handleResetPass() {
      let params = new URLSearchParams();
      for (let stu in this.multipleSelection) {
        params.append("ids[]", this.multipleSelection[stu].userId);
      }
      let _this = this;
      resetStuPass(params)
        .then((res) => {
          console.log("-----------重置用户密码---------------");
          if (res.code === 0) {
            _this.$message({
              message: res.msg,
              type: "success",
            });
            this.$refs.multipleTable.clearSelection();
          } else {
            _this.$message({
              message: res.msg,
              type: "error",
            });
          }
        })
        .catch((failResponse) => {});
    },
    //处理删除学生
    handleDel() {
      let params = new URLSearchParams();
      for (let stu in this.multipleSelection) {
        params.append("studentNos[]", this.multipleSelection[stu].stuNo);
      }
      let _this = this;
      delStu(params)
        .then((res) => {
          console.log("-----------删除用户---------------");
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
    //处理修改信息
    select2Change(index, row) {
      console.log("点击编辑", index, row);
      this.selectStu = row;
      this.ifShowUpdateDialog = true;
    },
    focusField(field){
      console.log("正在修改：",field)
      this.selectField = field.target.name
    },
    handleChange(val) {
      console.log("onchange:",val)
      let params = new URLSearchParams();
      params.append("modifiedField", this.selectField);
      params.append("stuNo", this.selectStu.stuNo);
      params.append("newName", this.selectStu.name); 
      params.append("newGradeId", this.selectStu.gradeId); 
      params.append("newMajorName", this.selectStu.majorName); 
      params.append("newClassNo", this.selectStu.classNo); 
      let _this = this;
      updateStu(params)
        .then((res) => {
          console.log("-----------删除用户---------------");
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
      params.append("gradeId", this.form2Query.gradeId); //年级
      params.append("majorId", this.form2Query.majorId); //专业
      params.append("classId", this.form2Query.classId); //班级
      params.append("keyUsername", this.form2Query.keyUsername); //用户id
      params.append("keyName", this.form2Query.keyName); //姓名
      params.append("order", this.orderMode); //排序方式
      params.append("field", this.orderField); //排序字段
      getStuList(params)
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
        this.orderMode = "";
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
