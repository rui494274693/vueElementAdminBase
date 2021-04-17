<template>
  <div :class="classObj" class="app-wrapper">
    <!-- 布局 -->
    <div v-if="device === 'mobile' && sidebar.opened" class="drawer-bg" @click="handleClickOutside" />

    <!-- 左侧菜单 -->
    <sidebar class="sidebar-container" />

    <!-- 右侧顶部菜单 已打开tag和子页面 -->
    <div :class="{ hasTagsView: needTagsView }" class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">

        <!-- 顶部菜单 -->
        <navbar />

        <!-- 顶部已打开的tag -->
        <tags-view v-if="needTagsView" />

      </div>
      <!-- 子页面 -->
      <app-main />

      <!-- 右侧设置按钮 -->
      <right-panel v-if="showSettings"><settings /></right-panel>
    </div>
  </div>
</template>

<script>
import RightPanel from '@/components/RightPanel';
import { AppMain, Navbar, Settings, Sidebar, TagsView } from './components';
import ResizeMixin from './mixin/ResizeHandler';
import { mapState } from 'vuex';

export default {
  name: 'Layout',
  components: {
    AppMain, // 子页面
    Navbar,  // 顶部菜单
    RightPanel,
    Settings, // 右侧设置按钮
    Sidebar, // 左侧菜单
    TagsView //顶部已打开的tag
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar, //左侧边的状态 true 图标模式还是图标+文字模式
      device: state => state.app.device,  //布局栏  桌面模式还是移动端模式
      showSettings: state => state.settings.showSettings, //显示设置
      needTagsView: state => state.settings.tagsView,  //已打开页面的tag栏是否出现
      fixedHeader: state => state.settings.fixedHeader  //是否固定头部
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,  //true 左侧边栏图标模式  false  左侧边栏图标+文字模式
        openSidebar: this.sidebar.opened,  //false 左侧边栏图标模式  true  左侧边栏图标+文字模式
        withoutAnimation: this.sidebar.withoutAnimation, // false 左侧边栏显示 true 左侧边栏完全隐藏
        mobile: this.device === 'mobile'  //桌面模式还是移动端模式
      };
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', {
        withoutAnimation: false
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~@/styles/mixin.scss';
@import '~@/styles/variables.scss';

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
