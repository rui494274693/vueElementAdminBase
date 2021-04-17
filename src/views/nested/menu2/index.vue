<template>

  <div style="padding:30px;">
    menu 2
    <el-input v-model="queryWord" placeholder="用户账号 或 用户名称" />
  </div>
</template>

<script>
  export default {
    name: 'Menu2',
    data() {
      return {
        queryWord:''
      }
     }
  }
</script>
