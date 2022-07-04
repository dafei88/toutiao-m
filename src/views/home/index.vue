<template>
  <div class="home-container">
    <!-- NavBar导航栏组件 -->
    <!-- fixed表示固定在顶部 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <!-- NavBar导航栏提供了Slots插槽 slot="title" 自定义标题-->
      <!-- Button按钮组件 通过icon属性设置按钮图标，支持 Icon 组件里的所有图标，也可以传入图标 URL。-->
      <van-button class="search-btn" slot="title" icon="search" size="mini" type="info" round to="/search">搜索</van-button>
    </van-nav-bar>
    <!-- Tab标签页组件 通过v-model绑定当前激活标签对应的索引值，默认情况下启用第一个标签 -->
    <!-- 通过 animated 属性可以开启切换标签内容时的转场动画 -->
    <!-- 通过 swipeable 属性可以开启滑动切换标签页。 -->
    <van-tabs class="channel-tabs" v-model="active" animated swipeable>
      <van-tab :title="item.name" v-for="item in channels" :key="item.id">
        <!-- 文章列表 -->
        <article-list :channel="item"></article-list>
      </van-tab>
      <!-- Tabs标签页组件提供了Slots插槽，slot="nav-right"  仅用作占位符-->
      <div slot="nav-right" class="placeholder"></div>
      <!-- Tabs标签页组件提供了Slots插槽，slot="nav-right" 自定义了标题右侧内容-->
      <div slot="nav-right" class="hambuger-btn" @click="isChannelEditShow = true">
        <i class="toutiao toutiao-liebiao"></i>
      </div>
    </van-tabs>
    <!-- Popup -->
    <van-popup v-model="isChannelEditShow" closeable close-icon-position="top-left" position="bottom" :style="{ height: '100%' }">
      <channel-edit :my-channels="channels" :active-index="active" @update-active="onUpdateActive" @add-my-channel="addMyChannel" @delete-my-channel="deleteMyChannel"></channel-edit>
    </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from '@/views/home/components/article-list.vue'
import ChannelEdit from '@/views/home/components/channel-edit.vue'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage.js'
export default {
  name: 'HomeIndex',
  components: {
    ArticleList,
    ChannelEdit
  },
  props: {},
  data() {
    return {
      active: 0,
      channels: [], // 频道列表
      isChannelEditShow: false
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created() {
    this.loadChannels()
  },
  mounted() {},
  methods: {
    async loadChannels() {
      try {
        let channels = []
        if (this.user) {
          // 已登录， 请求获取用户的频道列表
          const { data: res } = await getUserChannels()
          channels = res.data.channels
        } else {
          // 未登录，判断是否有本地的频道列表数据  如果有，直接拿来使用；如果没有，请求获取默认频道列表。
          // 注意：获取登录用户的频道列表和获取默认推荐的频道列表（用户未登录 且本地没有存储频道列表时，后端提供的一个默认推荐的频道列表）是同一个数据接口
          const loadChannels = getItem('TOUTIAO_CHANNELS')
          if (loadChannels) {
            channels = loadChannels
          } else {
            const { data: res } = await getUserChannels()
            channels = res.data.channels
          }
        }
        this.channels = channels
      } catch (error) {
        this.$toast('获取频道列表失败')
      }
    },
    // isChannelEditShow = true 作为第二个参数。如果有传值过来，用传过来的值 把该值赋值给isChannelEditShow；如果没有传值过来，则用isChannelEditShow = true
    onUpdateActive(value, isChannelEditShow = true) {
      console.log('子组件传过来的值', value)
      this.isChannelEditShow = isChannelEditShow
      this.active = value
    },
    addMyChannel(channel) {
      this.channels.push(channel)
    },
    deleteMyChannel(index) {
      this.channels.splice(index, 1)
    }
  }
}
</script>

<style scoped lang="less">
.home-container {
  margin-bottom: 100px;
  // 因为导航栏和标签页的头部使用了固定定位  不占用空间   防止文章列表上上移
  // 导航栏头部高度加上标签页头部的高度
  margin-top: 174px;
  //  ::v-deep
  ::v-deep.van-nav-bar__title {
    max-width: unset;
    .search-btn {
      width: 555px;
      height: 64px;
      background-color: #5babfb;
      border: none;
      font-size: 28px;
      .van-icon-search:before {
        font-size: 32px;
      }
    }
  }
  // 当我们使用scoped实现组件样式私有化时，如果想要修改element-ui、Vant等组件库中的组件样式时，则需要深度选择器进行样式的更改。
  //深度选择器1) >>> ;2) /deep/ ;3) ::v-deep ;
  /deep/ .channel-tabs {
    .van-tabs__wrap {
      // 固定在头部
      position: fixed;
      top: 92px;
      left: 0;
      right: 0;
      z-index: 1;
      height: 82px;
    }
    .van-tab {
      border-right: 1px solid #edeff3;
      min-width: 200px;
      font-style: 30px;
      color: #777;
    }
    .van-tab--active {
      color: #333;
    }
    .van-tabs__nav {
      padding-bottom: 0px;
    }
    .van-tabs__line {
      width: 31px !important;
      height: 6px;
      background-color: #3296fa;
      bottom: 8px;
    }
    .hambuger-btn {
      position: fixed;
      right: 0;
      width: 66px;
      height: 82px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fff;
      // 背景颜色的透明度
      opacity: 0.902;
      i.toutiao {
        font-size: 33px;
      }
      // 渐变左边框  可以使用图片来处理
      &::before {
        content: '';
        position: absolute;
        left: 0;
        width: 1px;
        height: 100%;
        background-image: url(~@/assets/gradient-gray-line.png);
        // 背景图的填充模式
        background-size: contain;
      }
    }
    .placeholder {
      // 当父元素是flex布局(也就是display=flex)，且父元素的宽度小于所有子元素的宽度之和时,子元素的宽度会减小（每个子元素都会对应一个flex-shrink的值）。
      // flex-shrink的值越大,对应子元素的宽度减小的越厉害。如果flex-shrink的值为0,表示对应子元素的宽度不减小。
      flex-shrink: 0;
      width: 66px;
      height: 82px;
    }
  }
}
</style>
