<!-- 左侧菜单 -->
<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper leftMenuScroll">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
        :router="true"
      >
        <div v-if="!demoMenu">
          <sidebar-item
            v-for="route in show_routes"
            :key="route.path"
            :item="route"
            :base-path="route.path"
          />
        </div>

        <div v-if="demoMenu">
          <sidebar-item
            v-for="route in demo_routes"
            :key="route.path"
            :item="route"
            :base-path="route.path"
          />
        </div>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/styles/variables.scss";

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      "permission_routes",
      "demo_routes",
      "add_routes",
      "sidebar",
      "demoMenu",
      "activeTopMenuId",
    ]),

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
    },
  },
  watch: {
    ...mapGetters(["activeTopMenuId"]),
    //监听顶部的导航栏菜单
    activeTopMenuId(val, val2) {
      var that = this;
      const add_routes = this.add_routes;
      var list = [];
      for (var i = 0; i < add_routes.length; i++) {
        if (add_routes[i].id == val) {
          that.show_routes = add_routes[i].children;
        }
      }
    },
  },
  data() {
    return {
      show_routes: [],
    };
  },
  mounted() {
    var that = this;

    const id = this.activeTopMenuId;
    const add_routes = this.add_routes;
    var list = [];
    for (var i = 0; i < add_routes.length; i++) {
      if (add_routes[i].id == id) {
        that.show_routes = add_routes[i].children;
      }
    }
  },
  methods: {},
};
</script>
