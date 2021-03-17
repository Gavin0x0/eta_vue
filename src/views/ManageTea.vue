<template>
  <div class="manage-tea">
    <h3>教师管理</h3>
    <el-form :inline="true" class="demo-form-inline" size="mini">
      <el-form-item>
        <el-input
          v-model="form2Query.keyUsername"
          placeholder="搜索教职工号"
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
      :small="ifSmall"
      :total="dataCount"
    >
    </el-pagination>
    <el-dialog title="修改用户信息" :visible.sync="ifShowUpdateDialog" width="80%">
      <h4>在输入栏按下回车进行提交修改</h4>
      <el-form label-position="left" label-width="50px" @submit.native.prevent>
        <el-form-item label="姓名">
          <el-input
            v-model="selectTea.name"
            @change="handleChange"
            name="name"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-collapse>
          <el-collapse-item title="设置角色">
            <el-form
              :inline="true"
              class="demo-form-inline"
              size="mini"
            >
              <el-form-item>
                <el-select
                  v-model="newRoleId"
                  style="width:120px"
                  size="mini"
                  placeholder="请选择角色"
                >
                  <el-option
                    v-for="item in roleList"
                    :key="item.id"
                    :label="item.roleName"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <template v-if="newRoleId === 3">
                <el-form-item>
                  <el-select
                    v-model="form2Search.gradeId"
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
                    v-model="form2Search.majorId"
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
                    v-model="form2Search.classId"
                    placeholder="请选择管理的班级"
                    style="width:180px"
                    multiple
                  >
                    <el-option
                      v-for="opt in classList"
                      :key="opt.id"
                      :label="opt.className"
                      :value="opt.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-form>

            <el-button type="primary" @click="onSetRole" style="width:100%"
              >设置</el-button
            >
          </el-collapse-item>
        </el-collapse>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  getTeaList,
  initManageTea,
  getClassList,
  delTea,
  resetTeaPass,
  updateTea,
  setRole,
} from "../api";
export default {
  name: "ManageTea",
  components: {},
  computed: {},
  data() {
    return {
      ifSmall:false,
      paginationLayout: "prev, pager,next, jumper, ->, total, sizes",
      ifShowUpdateDialog: false, //修改弹窗
      selectTea: {}, //选中的教师
      oldRoleId: "",
      newRoleId: "",
      // 数据列
      Columns: [
        { name: "ID", value: "userId", width: "100", ifShow: true },
        { name: "教职工号", value: "username", width: "150", ifShow: true },
        { name: "姓名", value: "name", width: "120", ifShow: true },
        { name: "性别", value: "genderName", width: "80", ifShow: false },
        { name: "角色", value: "roleName", width: "auto", ifShow: true },
      ],
      currentPage: 1,
      pageSize: 10,
      tableData: [{}], //展示的数据
      dataCount: 0, //总数据条数
      orderMode: "", //排序方式
      orderField: "", //排序字段
      //用于筛选的表单
      form2Query: {
        keyUsername: "", //教职工
        keyName: "", //姓名
      },
      //用于筛选的表单
      form2Search: {
        gradeId: "", 
        majorId: "", 
        classId: "",
      },
      //下拉栏内容列表
      gradeList: [],
      majorList: [],
      classList: [],
      roleList: [],
      //选中的数据
      multipleSelection: [],
    };
  },
  computed: {},
  mounted() {
    this.initQueryList();
    this.onQuery();
    if (document.documentElement.clientWidth < 720) {
      //closeDebug console.log("触发移动端布局");
      this.ifSmall = true
      this.paginationLayout = "prev, pager,next, ->, total";
      this.Columns=[
        { name: "ID", value: "userId", width: "100", ifShow: false },
        { name: "教职工号", value: "username", width: "150", ifShow: false },
        { name: "姓名", value: "name", width: "80", ifShow: true },
        { name: "性别", value: "genderName", width: "80", ifShow: false },
        { name: "角色", value: "roleName", width: "auto", ifShow: true },
      ]
    }
  },
  methods: {
    //初始化查询参数
    initQueryList() {
      initManageTea()
        .then((res) => {
          //closeDebug console.log("-----------初始化查询参数---------------");
          let obj = JSON.parse(res.msg);
          //closeDebug console.log(obj);
          this.gradeList = obj.grade;
          this.majorList = obj.major;
          this.roleList = obj.role;
        })
        .catch((failResponse) => {});
    },
    //更新可供筛选的班级列表
    QueryClass() {
      let _this = this;
      //closeDebug console.log("选中的筛选值","年级：",this.form2Search.gradeId,"专业",this.form2Search.majorId);
      let params = new URLSearchParams();
      params.append("gradeId", this.form2Search.gradeId);
      params.append("majorId", this.form2Search.majorId);
      getClassList(params)
        .then((res) => {
          //closeDebug console.log("-----------获取班级列表---------------");
          //closeDebug console.log(res);
          _this.classList = res;
        })
        .catch((failResponse) => {});
    },

    //处理多选框变化
    handleSelectionChange(val) {
      this.multipleSelection = val;
      //closeDebug console.log("多选框：", val);
    },
    //处理重置用户密码
    handleResetPass() {
      let params = new URLSearchParams();
      for (let tea in this.multipleSelection) {
        params.append("ids[]", this.multipleSelection[tea].userId);
      }
      let _this = this;
      resetTeaPass(params)
        .then((res) => {
          //closeDebug console.log("-----------重置用户密码---------------");
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
    //处理删除教师
    handleDel() {
      let params = new URLSearchParams();
      for (let tea in this.multipleSelection) {
        params.append("teacherNos[]", this.multipleSelection[tea].teaNo);
      }
      let _this = this;
      delTea(params)
        .then((res) => {
          //closeDebug console.log("-----------删除用户---------------");
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
      //closeDebug console.log(`每页 ${val} 条`);
      this.onQuery();
    },
    //处理跳页
    handleCurrentChange(val) {
      this.currentPage = val;
      //closeDebug console.log(`当前页: ${val}`);
      this.onQuery();
    },
    //处理修改信息
    select2Change(index, row) {
      //closeDebug console.log("点击编辑", index, row);
      this.selectTea = row;
      this.oldRoleId = row.roleId;
      this.newRoleId = row.roleId;
      this.ifShowUpdateDialog = true;
    },
    handleChange(val) {
      //closeDebug console.log("onchange:", val);
      let params = new URLSearchParams();
      params.append("username", this.selectTea.username);
      params.append("newName", this.selectTea.name);
      let _this = this;
      updateTea(params)
        .then((res) => {
          //closeDebug console.log("-----------更新教师信息---------------");
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
    onSetRole() {
      let params = new URLSearchParams();
      params.append("ids[]", this.selectTea.userId);
      params.append("usernames[]", this.selectTea.username);
      params.append("roleId", this.newRoleId);
      params.append("oldroleIds[]", this.oldRoleId);
      if (this.newRoleId === 3) {
        for (let item in this.form2Search.classId) {
          params.append("classIds[]", this.form2Search.classId[item]);
        }
      }
      let _this = this;
      setRole(params)
        .then((res) => {
          //closeDebug console.log("-----------设置教师角色---------------");
          if (res.code === 0) {
            _this.$message({
              message: res.msg,
              type: "success",
            });
            _this.onQuery();
            _this.form2Search.gradeId="";
            _this.form2Search.majorId="";
            _this.form2Search.classId="";
            _this.ifShowUpdateDialog=false;
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
      //closeDebug console.log("submit:", this.form2Query);
      //参数绑定「分页大小、页码以及筛选参数」
      let params = new URLSearchParams();
      params.append("limit", this.pageSize);
      params.append("page", this.currentPage);
      params.append("keyUsername", this.form2Query.keyUsername); //用户id
      params.append("keyName", this.form2Query.keyName); //姓名
      params.append("order", this.orderMode); //排序方式
      params.append("field", this.orderField); //排序字段
      getTeaList(params)
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
