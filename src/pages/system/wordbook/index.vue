<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate()">
        新增字典
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-refresh" @click="refreshType()">
        刷新字典缓存
      </el-button>
    </div>
    <el-table v-loading="listLoading" :header-cell-style="{background:'#F9F9F9',color:'#606266'}"  row-key="id" :data="list"
      border fit highlight-current-row style="width: 100%;"  :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column prop="orderIndex" label="排序" width="80" align="center" />
      <el-table-column prop="typeName" label="字典名称" />
      <el-table-column prop="typeCode" label="字典编码" />
      <el-table-column prop="typeValue" label="值" />
      <el-table-column prop="remark" label="备注" />
      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="small " @click="handleCreate(row)">
            编辑
          </el-button>
          <el-button size="small " type="success" @click="handleCreate(undefined,row.id)">
            增加子栏目
          </el-button>
          <el-button size="small " type="danger" @click="deleteMenu(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增修改 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" >
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px" label-suffix=":"
        >
        <el-form-item label="字典名称" prop="typeName">
          <el-input v-model="temp.typeName" />
        </el-form-item>
        <el-form-item label="字典编码" prop="typeCode">
          <el-input v-model="temp.typeCode" />
        </el-form-item>
        <el-form-item label="值" prop="typeValue">
          <el-input v-model="temp.typeValue" />
        </el-form-item>
        <el-form-item label="排序" prop="orderIndex">
          <el-input v-model="temp.orderIndex" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入备注" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getAllType,
    addType,
    updateType,
    refreshCache,
    deleteType
  } from '@/api/system/workbook'

  export default {
    name: 'workbook',
    data() {
      return {
        list: [], // table数据
        total: 0, // 总页数 分页
        listLoading: true, // 数据加载时的loading
        listQuery: { // 查询
          page: 1,
          limit: 10,
          title: undefined
        },
        temp: { // 新增修改的表单数据
          id: '',
          typeName: '',
          typeCode: '',
          typeValue: '',
          orderIndex: '',
          remark: ''

        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '修改',
          create: '新增'
        },
        dialogPvVisible: false,
        rules: { // 验证规则
          typeName: [{
            required: true,
            message: '请输入字典名称',
            trigger: 'blur'
          }],
          typeCode: [{
            required: true,
            message: '请输入字典编码',
            trigger: 'blur'
          }],
          orderIndex: [{
            required: true,
            message: '请输入排序',
            trigger: 'blur'
          }]

        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      refreshType(){
        refreshCache().then(res => {
          if (res.code = '1000') {
           this.$notify({
             title: '成功',
             message: '刷新缓存成功',
             type: 'success',
             duration: 2000
           })
           this.getList() //更新数据
          }
        })
      },
      //获取数据
      getList() {
        getAllType().then(res => {
          if (res.code = '1000') {
            const {
              data
            } = res
            this.list = data
            this.listLoading = false
          }
        })
      },
      // 打开弹出窗
      handleCreate(data,pid) {
        this.resetTemp(data,pid)
        this.dialogFormVisible = true

        setTimeout(() => { // 使用定时器 防止dom节点未生成时滑动保存
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
          }, 500)
        })
      },
      // 赋值
      resetTemp(data,pid) {
        if(data){
          this.dialogStatus = 'update'
          this.temp = {
            id: data.id,
            typeName: data.typeName,
            typeCode: data.typeCode,
            typeValue: data.typeValue,
            orderIndex: data.orderIndex,
            remark: data.remark
          }
        }else{
          this.dialogStatus = 'create'
          this.temp = {
            id: '',
            typeName: '',
            typeCode: '',
            typeValue: '',
            orderIndex: '',
            remark: ''
          }
        }
        if(pid){ //子菜单
          this.temp.pid = pid
        }
      },
      //新增
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            addType(this.temp).then((res) => {
              if (res.code == 1000) {
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                })
                this.getList() //更新数据
              }

            })
          }
        })
      },
      //修改
      updateData(){
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.temp.url = this.temp.path + ',' + this.temp.component
            updateType(this.temp).then((res) => {
              if (res.code == 1000) {
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: '修改成功',
                  type: 'success',
                  duration: 2000
                })
                this.getList()  //更新数据
              }

            })
          }
        })
      },
      //删除
      deleteMenu(row) {
        this.$confirm('此操作将删除该字典, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var data = {id:row.id}
          deleteType(data).then((res) => {
            if (res.code == 1000) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getList()
            }
          })

        }).catch(() => {

        });
      },
    }
  }
</script>
<style scoped>
</style>
