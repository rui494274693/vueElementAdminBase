<template>
  <div class="icons-container">
    <el-tabs type="border-card">
      <el-tab-pane label="Icons">
        <div v-for="item of svgIcons" :key="item" @click="handleClipboard(generateIconCode(item),$event)">
          <el-tooltip placement="top">
            <div slot="content">
              {{ generateIconCode(item) }}
            </div>
            <div class="icon-item">
              <svg-icon :icon-class="item" class-name="disabled" />
              <span>{{ item }}</span>
            </div>
          </el-tooltip>
        </div>
        <!-- <div v-for="item of addicon" :key="item" >
          <el-tooltip placement="top">
            <div slot="content">
              {{ item }}
            </div>
            <div class="icon-item">
              <svg-icon :icon-class="item" class-name="disabled" />
              <span>{{ item }}</span>
            </div>
          </el-tooltip>
        </div> -->
      </el-tab-pane>
      <el-tab-pane label="Element-UI Icons">
        <div v-for="item of elementIcons" :key="item" @click="handleClipboard(generateElementIconCode(item),$event)">
          <el-tooltip placement="top">
            <div slot="content">
              {{ generateElementIconCode(item) }}
            </div>
            <div class="icon-item">
              <i :class="item" />
              <span>{{ item }}</span>
            </div>
          </el-tooltip>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import clipboard from '@/utils/clipboard'
import svgIcons from '@/utils/icon/allIcon'
import elementIcons from './element-icons'


export default {
  name: 'Icons',
  data() {
    return {
      svgIcons,
      elementIcons
      // 'addicon':["kongjianjianmo","rizhi","zuoye","menjinxitong","geipaishui","bianpeidian","nenghao","xiaofangxitong1","changdi","zhaomingxitong","baoshimoban","gongsiguanli","shangpinguanli","xiaoqufuwu","wuyeguanli","wuyeshujufuwu","zulinzhongxin","shequfuwuzhan","sousuo1","gonggao","bumen","renwu","shenpi","jinrirenwu","xiaoxi","zuixindongtai","location","location1","zuixindongtai1","tupian","faburenwu","faxian","shenpi1","woderizhitianxie","577daqia","gonggao1","renwu1","rili","shenpi2","tongxunlu","gongdan","ribao","shezhi","xunjianguiji","shuaixuan","calendar","shijian","dingwei","caidan","jiaose","zidian","jiaojieban","gaojing","biaozhun","pingjia","jifang","dianti","shouye","shipin","daimazhongxin","shujuyunwei","quanxian","wangguan","jiankong","xiaochengxu","xiaofangxitong","zhucezhongxin","zuzhijiagou"]
    }
  },
  methods: {
    generateIconCode(symbol) {
      return `<svg-icon icon-class="${symbol}" />`
    },
    generateElementIconCode(symbol) {
      return `<i class="${symbol}" />`
    },
    handleClipboard(text, event) {
      clipboard(text, event)
    }
  }
}
</script>

<style lang="scss" scoped>
.icons-container {
  margin: 10px 20px 0;
  overflow: hidden;

  .icon-item {
    margin: 20px;
    height: 85px;
    text-align: center;
    width: 100px;
    float: left;
    font-size: 30px;
    color: #24292e;
    cursor: pointer;
  }

  span {
    display: block;
    font-size: 16px;
    margin-top: 10px;
  }

  .disabled {
    pointer-events: none;
  }
}
</style>
