<template>
  <div class="topMenu">
    <div style="width: 100%;">
      <el-tabs v-model="activeMenuId" @tab-click="handleClick">
        <el-tab-pane v-for="(route, index) in allMenu" :key="route.path"  :name="route.id">
           <span slot="label"><i style="font-size:18px;vertical-align: middle;" :class="route.icon"></i> {{route.meta.title}}</span>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import store from '@/store';
import { mapGetters } from 'vuex';
export default {
  computed: {
    ...mapGetters(['permission_routes', 'demo_routes', 'add_routes', 'sidebar', 'demoMenu', 'activeTopMenuId']),
    allMenu() {
      const add_routes = this.add_routes;

      const list = [];
      for (var i = 0; i < add_routes.length; i++) {
        if (!add_routes[i].hidden) {
          list.push(add_routes[i]);
        }
      }
      return list;
    },
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  },
  watch:{
  activeTopMenuId(val){
    this.activeMenuId = val
  }
  },
  data() {
    return {
      activeIndex: '1',
      activeMenuId: '',
    };
  },
  mounted() {
    var defaultActiveTopMenuId 
    for(var i=0;i<this.add_routes.length;i++){
       if(this.add_routes[i].hidden==false){
         defaultActiveTopMenuId = this.add_routes[i].id;
         break
       }
    }
    
    this.activeMenuId = localStorage.getItem('activeTopMenuId') || defaultActiveTopMenuId;
    this.handleClick()
  },
  methods: {

    //选中顶部一级菜单时，将选中的菜单ID存到store里
    handleClick(data) {
      store.dispatch('permission/setTopMenuId', {
        id: this.activeMenuId
      });
      //存到本地 ，防止刷新丢失
      localStorage.setItem('activeTopMenuId', this.activeMenuId);
    }
  }
};
</script>

<style scoped>
.topMenu {
  flex: 1;
  overflow: auto;
  height: 50px;
  vertical-align: middle;
  background: #304156;
}
.wid2 {
  /* width: calc(100vw - 190px); */
}
.topMenuWrap {
  width: auto;
  display: inline-block;
  padding: 0 5px;
  cursor: pointer;
}
</style>
<style>
.topMenu .el-tabs__header {
  margin-bottom: 0;
}
.topMenu .el-tabs__content {
  display: none;
}
.topMenu .el-tabs__nav-wrap:after {
  display: none;
}
.topMenu .el-tabs__item {
  margin-top: 5px;
  color: #fff;
}
.topMenu .el-tabs__item.is-active {
  color: #1890ff;
}
.topMenu .el-tabs__nav-next,
.topMenu .el-tabs__nav-prev {
  line-height: 54px;
  color: #fff;
  font-size: 20px;
  padding: 0px 10px;
}
.topMenu .el-tabs__nav-wrap.is-scrollable{
  padding: 0 40px;
}
</style>
