const req = require.context('../../icons/svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys()

const re = /\.\/(.*)\.svg/

var icons = requireAll(req).map(i => {
  return i.match(re)[1]
})
const addicon = ["kongjianjianmo","rizhi","zuoye","menjinxitong","geipaishui","bianpeidian","nenghao","xiaofangxitong1","changdi","zhaomingxitong","baoshimoban","gongsiguanli","shangpinguanli","xiaoqufuwu","wuyeguanli","wuyeshujufuwu","zulinzhongxin","shequfuwuzhan","sousuo1","gonggao","bumen","renwu","shenpi","jinrirenwu","xiaoxi","zuixindongtai","location","location1","zuixindongtai1","tupian","faburenwu","faxian","shenpi1","woderizhitianxie","577daqia","gonggao1","renwu1","rili","shenpi2","tongxunlu","gongdan","ribao","shezhi","xunjianguiji","shuaixuan","calendar","shijian","dingwei","caidan","jiaose","zidian","jiaojieban","gaojing","biaozhun","pingjia","jifang","dianti","shouye","shipin","daimazhongxin","shujuyunwei","quanxian","wangguan","jiankong","xiaochengxu","xiaofangxitong","zhucezhongxin","zuzhijiagou"]
const svgIcons =  icons.concat(addicon)
export default svgIcons
