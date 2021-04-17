<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.queryWord" placeholder="用户账号 或 用户名称" style="width: 200px;" class="filter-item"
        @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-plus" @click="handleCreate()">新增用户</el-button>
    </div>
    <el-table v-loading="listLoading" :header-cell-style="{background:'#F9F9F9',color:'#606266'}" row-key="id" :data="list"
      border fit highlight-current-row style="width: 100%;" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column fixed prop="userKey" label="用户账号" width="150" />
      <el-table-column fixed prop="realName" label="用户名称" width="150" />
      <el-table-column prop="userDetails.mobilePhone" label="联系电话" align="center" />
      <el-table-column prop="userDetails.officePhone" label="办公电话" align="center" />
      <el-table-column prop="userDetails.Email" label="邮箱" align="center" />
      <el-table-column prop="userDetails.site" label="地址" />
      <el-table-column prop="userDetails.age" label="年龄" />
      <el-table-column label="性别" width="60" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.userDetails.sex==0">男</span>
          <span v-if="scope.row.userDetails.sex==1">女</span>
        </template>
      </el-table-column>
      <el-table-column prop="userDetails.remark" label="备注" />
      <el-table-column label="状态" width="60" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.state==1" style="color: #67C23A;">正常</span>
          <span v-if="scope.row.state==2" style="color: #F56C6C;">停用</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="small " type="success" @click="handleCreate(row)">
            修改
          </el-button>
          <el-button size="small " type="danger" @click="deleteDate(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>9" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 新增修改 -->
    <DialogForm ref="dialogForm" :isOpen.sync="isOpen" :title="dialogTitle" :rules.sync="rules" :temp.sync="temp"
      v-on:close="closeDialogForm" v-on:submit="submitDialogForm">
    </DialogForm>
  </div>
</template>

<script>
  import {
    userList,
    addUser,
    updateUser,
    deleteUser
  } from '@/api/system/user'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // 分页
  import DialogForm from '@/components/DialogForm' // 对话框表单

  export default {
    name: 'user',
    directives: {
      waves
    },
    components: {
      Pagination,
      DialogForm
    },
    data() {
      return {
        dialogTitle: '新增',
        isOpen: false,
        list: [], // table数据
        total: 0, // 总页数 分页
        listLoading: true, // 数据加载时的loading
        listQuery: { // 查询
          page: 1,
          limit: 10,
          queryWord: ''
        },
        temp: [{
            code: 'id',
            value: '',
            show: false
          },
          {
            code: 'userKey',
            label: '用户账号',
            value: ''
          },
          {
            code: 'realName',
            label: '用户名称',
            value: ''
          },
          {
            code: 'password',
            label: '密码',
            type: 'password',
            value: ''
          },
          {
            code: 'mobilePhone',
            label: '联系电话',
            value: ''
          },
          {
            code: 'officePhone',
            label: '办公电话',
            value: ''
          },
          {
            code: 'Email',
            label: '邮箱',
            value: ''
          },
          {
            code: 'site',
            label: '地址',
            value: ''
          },
          {
            code: 'age',
            label: '年龄',
            value: ''
          },
          {
            code: 'sex',
            label: '性别',
            value: '',
            type: 'radio',
            options: [{
              label: '男',
              value: '0'
            }, {
              label: '女',
              value: '1'
            }]
          },
          {
            code: 'remark',
            label: '备注',
            type: 'textarea',
            value: ''
          }
        ],
        rules: { // 验证规则
          userKey: [{
            required: true,
            message: '请输入用户账号',
            trigger: 'blur'
          }],
          realName: [{
            required: true,
            message: '请输入用户名称',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }]

        }
      }
    },

    created() {
      this.getList() // 列表数据
    },
    methods: {
      //关闭弹出窗
      closeDialogForm(data) {
        this.isOpen = data.isOpen
      },
      //搜索
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      // 打开弹出窗
      handleCreate(data) {
        this.resetTemp(data)
        this.isOpen = true
        this.$nextTick(() => {
          this.$refs.dialogForm.$refs['dataForm'].clearValidate()
        }, 500)
      },
      //确定
      submitDialogForm(data) {
        if (data && this.dialogTitle == '新增') {
          this.createData(data)
        } else if (data && this.dialogTitle == '修改') {
          this.updateData(data)
        }
      },
      // 获取数据
      getList() {
        userList(this.listQuery).then(res => {
          if (res.code = '1000') {
            const {
              data
            } = res
            this.list = data.records
            this.total = data.total
            this.listLoading = false
          }
        }).catch(er => {
          this.listLoading = false
        })
      },

      // 赋值
      resetTemp(data) {
        if (data) {
          this.dialogTitle = '修改'
          //将data.userDetails里的值放到data上
          var adArrObj = ['mobilePhone', 'officePhone', 'Email', 'site', 'age', 'sex', 'remark']
          for (var i = 0; i < adArrObj.length; i++) {
            data[adArrObj[i]] = data.userDetails[adArrObj[i]]
          }
          //赋值
          this.temp.forEach(te => {
            te.value = ''
            if (data[te.code]) {
              te.value = data[te.code]
            }
          })
        } else {
          this.dialogTitle = '新增'
          this.temp.forEach(te => {
            te.value = ''
          })
        }
      },
      // 新增
      createData(data) {
        addUser(data).then((res) => {
          if (res.code == 1000) {
            this.isOpen = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.getList() // 更新数据
          }
        })
      },
      // 修改
      updateData(data) {
        updateUser(data).then((res) => {
          if (res.code == 1000) {
            this.isOpen = false
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
            this.getList() // 更新数据
          }
        })
      },
      // 删除
      deleteDate(row) {
        this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var data = {
            id: row.id
          }
          deleteUser(data).then((res) => {
            if (res.code == 1000) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getList()
            }
          })
        }).catch(() => {

        })
      }
    }
  }
</script>
<style scoped>

</style>
