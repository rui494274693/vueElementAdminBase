<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.queryWord" placeholder="名字" style="width: 200px;" class="filter-item"
        @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-plus" @click="handleCreate()">新增</el-button>
    </div>
    <el-table v-loading="listLoading" :header-cell-style="{background:'#eef1f6',color:'#606266'}" row-key="id" :data="list"
      border fit highlight-current-row style="width: 100%;" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">

      <el-table-column fixed prop="realName" label="名字" width="150" />
      <el-table-column prop="phone" label="联系电话" align="center" />
      <el-table-column prop="email" label="邮箱" align="center" />
      <el-table-column prop="age" label="年龄" />
      <el-table-column prop="address" label="地址" />
      <el-table-column label="单选" width="60" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.sex==0">男</span>
          <span v-if="scope.row.sex==1">女</span>
        </template>
      </el-table-column>
      <el-table-column label="多选" width="60" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.duoxuan==1">选项一</span>
          <span v-if="scope.row.duoxuan==2">选项二</span>
          <span v-if="scope.row.duoxuan==3">选项三</span>
        </template>
      </el-table-column>
      <el-table-column prop="data" label="日期" />
      <el-table-column prop="datatime" label="日期时间" />
      <el-table-column prop="hhmm" label="时分" />
      <el-table-column prop="hhmmss" label="时分秒" />
      <el-table-column prop="remark" label="备注" />
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
    list,
    addDemo,
    updateDemo,
    deleteDemo
  } from '@/api/demo'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // 分页
  import DialogForm from '@/components/DialogForm' // 对话框表单

  export default {
    name: 'dialogForm',
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
        list: null, // table数据
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
            code: 'realName',
            label: '名字',
            value: ''
          },
          {
            code: 'phone',
            label: '联系电话',
            value: ''
          },
          {
            code: 'email',
            label: '邮箱',
            value: ''
          },
          {
            code: 'age',
            label: '年龄',
            value: '1'
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
            code: 'duoxuan',
            label: '多选',
            value: [],
            type: 'checkbox',
            options: [{
              label: '选项一',
              value: '1'
            }, {
              label: '选项二',
              value: '2'
            }, {
              label: '选项二',
              value: '3'
            }]
          },
          {
            code: 'hhmm',
            label: '时间选择器',
            value: '',
            type: 'timeSelect',
            options: {
              start: '08:30',
              step: '00:15',
              end: '18:30'
            }
          },
          {
            code: 'datatime',
            label: '日期',
            value: '',
            type: 'timePicker',
            options: {

            }
          },
          {
            code: 'data',
            label: '日期',
            value: '',
            type: 'datePicker',
            pickType: 'datetime',
            options: {

            }
          },
          {
            code: 'select',
            label: '下拉',
            value: [],
            type: 'select',
            options: [{
              label: '下拉选项一',
              value: '0'
            }, {
              label: '下拉选项二',
              value: '1'
            },{
              label: '下拉选项三',
              value: '2'
            },{
              label: '下拉选项四',
              value: '3'
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

          realName: [{
            required: true,
            message: '请输入名称',
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
        var obj = {}
        for (let te of this.temp) {
          obj[te.code] = te.value
        }
        console.log(obj);
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
        list(this.listQuery).then(res => {
          if (res.code = '1000') {
            const {
              data
            } = res
            this.list = data.records
            this.total = data.total
            this.listLoading = false
          }
        })
      },

      // 赋值
      resetTemp(data) {
        if (data) {
          this.dialogTitle = '修改'
          //将data.userDetails里的值放到data上
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
            if(typeof te.value=='object'){
              te.value = []
            }else{
              te.value = ''
            }

          })
        }
      },
      // 新增
      createData(data) {
        addDemo(data).then((res) => {
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
        updateDemo(data).then((res) => {
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
          deleteDemo(data).then((res) => {
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
<style>

</style>
