<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-input v-model="listQuery.title" :placeholder="$t('table.title')" style="width: 200px;" class="filter-item"
            @keyup.enter.native="handleFilter" /> -->
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-plus"
        @click="handleCreate()"
      >
        新增角色
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :header-cell-style="{ background: '#F9F9F9', color: '#606266' }"
      row-key="id"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <!-- <el-table-column type="selection" width="55">
          </el-table-column> -->
      <el-table-column prop="roleName" label="角色名称" />
      <el-table-column prop="roleCode" label="角色编码" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button type="primary" size="small " @click="openPower(row)">
            权限管理
          </el-button>
          <el-button size="small " type="success" @click="handleCreate(row)">
            修改角色
          </el-button>

          <el-button size="small " type="success" @click="openAddUser(row)">
            添加用户
          </el-button>
          <el-button size="small " type="danger" @click="deleteRoles(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="2"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <!-- 新增修改 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="100px"
        label-suffix=":"
        width="60%"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="temp.roleName" />
        </el-form-item>
        <el-form-item label="角色编码" prop="roleCode">
          <el-input v-model="temp.roleCode" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t("table.cancel") }}
        </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          {{ $t("table.confirm") }}
        </el-button>
      </div>
    </el-dialog>
    <!-- 权限管理 -->
    <el-dialog
      :title="'当前角色：' + currentRole"
      :visible.sync="dialogPowerVisible"
    >
      <div class="powerBox">
        <el-tree
          :data="treeData"
          show-checkbox
          node-key="id"
          ref="tree"
          :check-strictly="true"
          :default-expand-all="true"
          :props="defaultProps"
          :check-on-click-node="true"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closePower()"> 取消 </el-button>
        <el-button type="primary" @click="adpower()"> 确定 </el-button>
      </div>
    </el-dialog>
    <!-- 添加角色  -->
    <el-dialog
      :title="'角色名称：' + userName"
      :visible.sync="dialogUserVisible"
      width="700px"
    >
      <div class="userBox">
        <el-transfer
          v-model="userValue"
          :data="allUsers"
          filterable
          :titles="['未添加用户', '已添加用户']"
        ></el-transfer>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeUser()"> 取消 </el-button>
        <el-button type="primary" @click="addUser()"> 确定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { uploadMenu, adddMenu, deleteMenu } from "@/api/system/menu";
import {
  getAllRole,
  addRole,
  updateRole,
  getRoutesMenu,
  uploadRoutesMenu,
  deleteRole,
  getAllUser,
  roleIdGetUsers,
  roleOfUsers,
} from "@/api/system/role";
import svgIcons from "@/utils/icon/allIcon.js";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // 分页
import { newRouters, allRouters } from "@/api/system/addRoutes";
export default {
  name: "role",
  components: {
    Pagination,
  },
  directives: {
    waves,
  },
  filters: {},
  data() {
    return {
      userValue: [], // 选中的用户
      allUsers: [], //全部用户
      userName: "",
      userId: "",
      dialogUserVisible: false,
      treeData: [],
      treeSelectRoleId: "",
      defaultProps: {
        children: "children",
        label: "title",
      },
      currentRole: "", // 当前修改权限的角色
      dialogPowerVisible: false, // 抽屉 权限管理
      svgIcons: svgIcons, // 图标
      list: [], // table数据
      total: 0, // 总页数 分页
      listLoading: true, // 数据加载时的loading
      listQuery: {
        // 查询
        page: 1,
        limit: 10,
        title: undefined,
      },
      temp: {
        // 新增修改的表单数据
        id: "",
        roleCode: "",
        roleName: "",
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "修改",
        create: "新增",
      },
      rules: {
        // 验证规则
        roleCode: [
          {
            required: true,
            message: "请输入角色名称",
            trigger: "blur",
          },
        ],
        roleName: [
          {
            required: true,
            message: "请输入角色编码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getList(); // 角色列表
    this.getMenuList(); // 菜单列表
    this.allUser(); // 用户列表
  },
  methods: {
    allUser() {
      getAllUser().then((res) => {
        if ((res.code = "1000")) {
          var list = [];
          const { data } = res;
          data.forEach((da) => {
            var ad = {
              key: da.id,
              label: da.realName,
            };
            list.push(ad);
          });
          this.allUsers = list;
        }
      });
    },
    //打开添加用户
    openAddUser(row) {
      var params = {
        roleId: row.id,
      };
      roleIdGetUsers(params).then((res) => {
        if ((res.code = "1000")) {
          var list = [];
          const { data } = res;
          data.forEach((da) => {
            list.push(da.id);
          });
          this.userValue = list;
          this.dialogUserVisible = true;
          this.userId = row.id;
          this.userName = row.roleName;
        }
      });
    },
    // 添加用户
    addUser() {
      var params = {
        roleId: this.userId,
        userIds: this.userValue.join(","),
      };
      roleOfUsers(params).then((res) => {
        if ((res.code = "1000")) {
          this.$notify({
            title: "成功",
            message: "修改成功",
            type: "success",
            duration: 2000,
          });
          this.dialogUserVisible = false;
        }
      });
    },
    //关闭添加用户弹出窗
    closeUser() {
      this.dialogUserVisible = false;
      this.userId = "";
      this.userName = "";
      this.userValue = [];
    },
    // 权限管理 菜单列表数据
    getMenuList() {
      allRouters().then((res) => {
        if ((res.code = "1000")) {
          const { data } = res;
          this.treeData = data;
        }
      });
    },
    //关闭 权限管理弹出窗
    closePower() {
      this.$refs.tree.setCheckedKeys([]); //清除选中
      this.dialogPowerVisible = false;
    },
    // 打开权限管理弹出窗
    openPower(data) {
      this.currentRole = data.roleName;
      this.dialogPowerVisible = true;
      this.treeSelectRoleId = data.id;
      var params = {
        roleId: data.id,
      };
      getRoutesMenu(params).then((res) => {
        if ((res.code = "1000")) {
          const { data } = res;
          var treeSelect = [];
          data.forEach((da) => {
            treeSelect.push(da.id);
          });
          this.$refs.tree.setCheckedKeys(treeSelect); //选中
        }
      });
    },
    // 确认权限
    adpower() {
      var ids = this.treeSelectRoleId;

      var params = {
        roleId: this.treeSelectRoleId,
        fIds: this.$refs.tree.getCheckedKeys().join(),
      };
      console.log(1);
      uploadRoutesMenu(params).then((res) => {
        if ((res.code = "1000")) {
          this.currentRole = "";
          this.dialogPowerVisible = false;
          this.treeSelectRoleId = "";
          this.$notify({
            title: "成功",
            message: "权限修改成功",
            type: "success",
            duration: 2000,
          });
        }
      });
    },
    // 获取数据
    getList() {
      getAllRole().then((res) => {
        if ((res.code = "1000")) {
          const { data } = res;
          this.list = data;
          this.listLoading = false;
        }
      });
    },
    // 打开弹出窗
    handleCreate(data) {
      this.resetTemp(data);
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      }, 500);
    },
    // 赋值
    resetTemp(data) {
      if (data) {
        this.dialogStatus = "update";
        this.temp = {
          id: data.id,
          roleCode: data.roleCode,
          roleName: data.roleName,
        };
      } else {
        this.dialogStatus = "create";
        this.temp = {
          id: "",
          roleCode: "",
          roleName: "",
        };
      }
    },
    // 新增
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          addRole(this.temp).then((res) => {
            if (res.code == 1000) {
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: "创建成功",
                type: "success",
                duration: 2000,
              });
              this.getList(); // 更新数据
            }
          });
        }
      });
    },
    // 修改
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          updateRole(this.temp).then((res) => {
            if (res.code == 1000) {
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: "修改成功",
                type: "success",
                duration: 2000,
              });
              this.getList(); // 更新数据
            }
          });
        }
      });
    },
    // 删除
    deleteRoles(row) {
      this.$confirm("此操作将删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          var data = {
            id: row.id,
          };
          console.log("删除");
          deleteRole(data).then((res) => {
            if (res.code == 1000) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.getList();
            }
          });
        })
        .catch(() => {});
    },
  },
};
</script>
<style scoped>
.powerBox {
  width: 100%;
  height: 200px;
  border: 1px solid #ccc;
  overflow: auto;
}

.userBox {
  width: 100%;
  height: 310px;
  /* border: 1px solid #ccc; */
  overflow: auto;
  margin: 0 auto;
}
</style>
