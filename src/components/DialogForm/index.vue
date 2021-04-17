<template>
  <el-dialog :title="title" :visible.sync="isOpen" :before-close="closeDialog">
    <div style="height: 400px;overflow: auto;">
      <el-form ref="dataForm" :rules="rules" :model="model" label-position="right" label-width="120px" label-suffix=":">
        <el-form-item :label="item.label" v-for="item in temp" :key='item.code' :prop="item.code" v-show="item.show==undefined || item.show==true">
          <el-input v-if="item.type==undefined || item.type=='input'" v-model="item.value" :placeholder="'请输入'+item.label" />
          <el-input v-if="item.type=='password'" type="password" v-model="item.value" :placeholder="'请输入'+item.label" />
          <el-input v-if="item.type=='textarea'" v-model="item.value" :autosize="{ minRows: 2, maxRows: 4}" type="textarea"
            :placeholder="'请输入'+item.label" />
          <el-radio-group v-model="item.value" v-if="item.type=='radio'">
            <el-radio :label="op.value" v-for="op in item.options" :key='op.code'>{{op.label}}</el-radio>
          </el-radio-group>
                 <el-checkbox-group v-model="item.value" v-if="item.type=='checkbox'">
            <el-checkbox :label="op.value" v-for="op in item.options" :key='op.code'>{{op.label}}</el-checkbox>
          </el-checkbox-group>

          <el-select v-if="item.type=='select'" :multiple="item.multiple" v-model="item.value" clearable :placeholder="'请选择'+item.label">
            <el-option v-for="op in item.options" :key="op.value" :label="op.label" :value="op.value">
            </el-option>
          </el-select>
          <el-time-picker v-if="item.type=='timePicker'" v-model="item.value" :picker-options="item.options" :placeholder="'请选择'+item.label">
          </el-time-picker>
          <el-time-select v-if="item.type=='timeSelect'" v-model="item.value" :picker-options="item.options" :placeholder="'请选择'+item.label">
          </el-time-select>
          <el-date-picker v-if="item.type=='datePicker'" :type="item.type==undefined?'date':item.pickType" v-model="item.value"
            :picker-options="item.options" :placeholder="'请选择'+item.label">
          </el-date-picker>
          <slot v-if="item.type=='slot'" :name="item.name" :data="item.json" :value="item.value"></slot>
        </el-form-item>

      </el-form>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog()">
        取消
      </el-button>
      <el-button type="primary" @click="submitForm()">
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name: 'dialogForm',
    props: {
      rules: {
        type: Object,
        default () {
          return {}
        }
      },
      title: {
        type: String,
        default: '新增'
      },
      isOpen: {
        type: Boolean,
        default: false
      },
      temp: {
        type: Array,
        default () {
          return []
        }
      },
    },
    computed: {
      model: {
        get() {
          var obj = {}
          for (let te of this.temp) {
            obj[te.code] = te.value
          }
          return obj
        }
      }
    },
    methods: {
      submitForm() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$emit('submit',
              this.model
            )
          } else {
            this.$emit('submit',
              undefined
            )
          }
        })
      },
      closeDialog() {
        var data = {
          isOpen: false
        }
        this.$emit('close', data)
      }
    }
  }
</script>

<style>
</style>
