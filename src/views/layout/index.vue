<template>
  <div class="layout-container">
    <!-- 子路由占位符 -->
    <router-view />
    <!-- Tabbar标签栏组件 -->
    <van-tabbar class="layout-tabbar" route>
      <!-- Tabbar标签栏组件提供了路由模式1）van-tabbar标签添加routes属性；2）van-tabbar-item标签添加to属性； -->
      <van-tabbar-item to="/home">
        <!-- Tabbar标签栏组件提供了Slots插槽 。slot="icon"表示自定义标签栏图标  -->
        <i slot="icon" class="toutiao toutiao-shouye"></i>
        <span>首页</span>
      </van-tabbar-item>
      <van-tabbar-item to="/qa">
        <i slot="icon" class="toutiao toutiao-wenda"></i>
        <span>问答</span>
      </van-tabbar-item>
      <van-tabbar-item to="/video">
        <i slot="icon" class="toutiao toutiao-shipin"></i>
        <span>视频</span>
      </van-tabbar-item>
      <van-tabbar-item to="/my">
        <i slot="icon" class="toutiao toutiao-wode"></i>
        <span>{{ user ? '我的' : '未登录' }}</span>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'LayoutIndex',
  components: {},
  props: {},
  data() {
    return {}
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style scoped lang="less">
.layout-container {
  .layout-tabbar {
    .toutiao {
      font-size: 40px;
    }
    span.text {
      font-size: 20px;
    }
  }
}
</style>
