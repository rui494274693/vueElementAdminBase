<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-plus"
        @click="handleCreate()"
      >
        新增菜单
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
      <el-table-column
        prop="orderIndex"
        label="序号"
        width="80"
        align="center"
      />
      <el-table-column prop="name" label="name" />
      <el-table-column prop="title" label="菜单名称" />
      <el-table-column prop="path" label="路由" />
      <el-table-column prop="component" label="文件路径" />
      <el-table-column label="图标" width="50" align="center">
        <template slot-scope="scope">
          <i style="font-size: 20px" :class="scope.row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column label="是否显示">
        <template slot-scope="scope">
          <span class="text-green" v-if="scope.row.hidden == false">显示</span>
          <span class="text-red" v-if="scope.row.hidden == true">隐藏</span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" />
      <el-table-column
        label="操作"
        align="center"
        width="300"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button type="primary" size="small " @click="handleCreate(row)">
            编辑
          </el-button>
          <el-button
            size="small "
            type="success"
            @click="handleCreate(undefined, row.id)"
          >
            增加子栏目
          </el-button>
          <el-button size="small " type="danger" @click="deleteMenu(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增修改 -->
    <el-dialog
      v-el-drag-dialog
      :title="textMap[dialogStatus]"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogFormVisible"
      :width="'602px'"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="100px"
        label-suffix=":"
        width="60%"
      >
        <el-form-item label="name" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="菜单名称" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="跳转路由" prop="path">
          <el-input v-model="temp.path" />
        </el-form-item>
        <el-form-item label="文件路径" prop="component">
          <el-input v-model="temp.component" />
        </el-form-item>
        <el-form-item label="菜单" prop="hidden">
          <template>
            <el-radio-group v-model="temp.hidden" size="small">
              <el-radio-button :label="false">显示</el-radio-button>
              <el-radio-button :label="true">隐藏</el-radio-button>
            </el-radio-group>
          </template>
        </el-form-item>
        <el-form-item label="排序" prop="orderIndex">
          <el-input v-model="temp.orderIndex" />
        </el-form-item>
        <el-form-item label="图标" prop="ico">
          <div ref="iconbox" class="iconbox">
            <span
              v-for="item in elementIcons"
              :key="item"
              class="iconitem"
              :data-item="{ item }"
              :class="{ active: temp.icon == item }"
              @click="togIcon(item)"
            >
              <!-- <svg-icon :icon-class="item" /> -->
              <i :class="item"></i>
            </span>
          </div>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="temp.remark"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="请输入备注"
          />
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
  </div>
</template>

<script>
import { uploadMenu, adddMenu, deleteMenu } from "@/api/system/menu.js";
import { newRouters, allRouters } from "@/api/system/addRoutes";
import elDragDialog from "@/directive/el-drag-dialog"; // 拖动
import svgIcons from "@/utils/icon/allIcon.js";
import elementIcons from "@/utils/element-icons";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // 分页

export default {
  name: "menuTable",
  components: {
    Pagination,
  },
  directives: {
    waves,
    elDragDialog,
  },
  filters: {},
  data() {
    return {
      elementIcons: elementIcons,
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
        name: "",
        orderIndex: "",
        hidden: false,
        component: "",
        path: "",
        icon: "",
        remark: "",
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "修改",
        create: "新增",
      },
      dialogPvVisible: false,
      rules: {
        // 验证规则
        name: [
          {
            required: true,
            message: "请输入name",
            trigger: "blur",
          },
        ],
        title: [
          {
            required: true,
            message: "请输入菜单名称",
            trigger: "blur",
          },
        ],
        path: [
          {
            required: true,
            message: "请输入跳转路由",
            trigger: "blur",
          },
        ],
        component: [
          {
            required: true,
            message: "请输入文件路径",
            trigger: "blur",
          },
        ],
        orderIndex: [
          {
            required: true,
            message: "请输入排序",
            trigger: "blur",
          },
        ],
      },
      importanceOptions: [1, 2, 3],
      downloadLoading: false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      allRouters().then((res) => {
        if ((res.code = "1000")) {
          const { data } = res;
          this.list = data;
          // setTimeout(() => {
          this.listLoading = false;
          // }, 100)
        }
      });
    },
    // 切换图标
    togIcon(icon) {
      this.temp.icon = icon;
    },
    // 打开弹出窗
    handleCreate(data, pid) {
      var that = this;
      this.resetTemp(data, pid);
      this.dialogFormVisible = true;

      function objFn(obj, objIndex, objs) {
        return obj === that.temp.icon;
      }
      var index = that.elementIcons.findIndex(objFn);
      setTimeout(() => {
        // 使用定时器 防止dom节点未生成时滑动保存
        var top =
          parseInt(
            (index + 1) / parseInt(this.$refs.iconbox.clientWidth / 36)
          ) * 38; // 计算icon滑动的距离
        this.$nextTick(() => {
          this.$refs.iconbox.scrollTop = top;
          this.$refs["dataForm"].clearValidate();
        }, 500);
      });
    },
    // 赋值
    resetTemp(data, pid) {
      if (data) {
        this.dialogStatus = "update";
        this.temp = {
          id: data.id,
          title: data.title,
          name: data.name,
          hidden: data.hidden,
          orderIndex: data.orderIndex,
          path: data.path,
          component: data.component,
          icon: data.icon,
          remark: data.remark,
        };
      } else {
        this.dialogStatus = "create";
        this.temp = {
          id: "",
          name: "",
          title: "",
          orderIndex: "",
          hidden: false,
          path: "",
          component: "",
          icon: "",
          remark: "",
        };
      }
      if (pid) {
        //子菜单
        this.temp.pid = pid;
      }
    },
    //新增
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          adddMenu(this.temp).then((res) => {
            if (res.code == 1000) {
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: "创建成功",
                type: "success",
                duration: 2000,
              });
              this.getList(); //更新数据
            }
          });
        }
      });
    },
    //修改
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          uploadMenu(this.temp).then((res) => {
            if (res.code == 1000) {
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: "修改成功",
                type: "success",
                duration: 2000,
              });
              this.getList(); //更新数据
            }
          });
        }
      });
    },
    //删除
    deleteMenu(row) {
      this.$confirm("此操作将删除该菜单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          var data = {
            id: row.id,
          };
          deleteMenu(data).then((res) => {
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
.iconbox {
  border: 1px solid #dcdfe6;
  height: 140px;
  overflow: auto;
  border-radius: 5px;
  font-size: 24px;
}

.iconitem {
  display: inline-block;
  margin: 5px;
  padding: 0 5px;
  cursor: pointer;
  border: 1px solid transparent;
  vertical-align: middle;
}

.iconitem.active {
  border: 1px solid #1890ff;
  border-radius: 5px;
  color: #1890ff;
}

.iconitem .svg-icon {
  font-size: 24px;
  color: #666666;
  vertical-align: middle;
}
</style>
