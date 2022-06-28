<template>
  <div class="my-container">
    <div class="header user-info" v-if="user">
      <div class="base-info">
        <div class="left">
          <!-- Image图片组件 -->
          <!--  通过 fit 属性可以设置图片填充模式。fit="cover" 保持宽高缩放图片，使图片的短边能完全显示出来，裁剪长边 -->
          <van-image class="head-portrait" fit="cover" round :src="userInfo.photo" />
          <span class="name">{{ userInfo.name }}</span>
        </div>
        <div class="right">
          <van-button size="mini" round>编辑资料</van-button>
        </div>
      </div>
      <div class="data-statistics">
        <div class="data-item">
          <span class="count">{{ userInfo.art_count }}</span>
          <span class="text">头条</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.follow_count }}</span>
          <span class="text">关注</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.fans_count }}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.like_count }}</span>
          <span class="text">获赞</span>
        </div>
      </div>
    </div>
    <div class="header not-login" v-else>
      <div class="login-btn" @click="$router.push('/login')">
        <img class="mobile-img" src="~@/assets/mobile.png" alt="" />
        <span class="text">登录 / 注册</span>
      </div>
    </div>
    <!-- Grid宫格组件 默认一行展示四个格子，可以通过 column-num 自定义列数。 -->
    <!-- clickable开启格子点击反馈,使得交互效果更好 -->
    <van-grid class="grid-nav" :column-num="2" clickable>
      <!-- Grid宫格组件，通过to属性设置vue-router跳转链接，通过url属性设置URL跳转链接 -->
      <van-grid-item class="grid-item">
        <!-- Grid宫格组件中提供了Slots插槽。slot="icon"表示自定义图标 -->
        <i slot="icon" class="toutiao toutiao-shoucang"></i>
        <!-- Grid宫格组件中提供了Slots插槽。slot="text"表示自定义文字 -->
        <span slot="text">收藏</span>
      </van-grid-item>
      <van-grid-item class="grid-item">
        <i slot="icon" class="toutiao toutiao-lishixiao"></i>
        <span slot="text">历史</span>
      </van-grid-item>
    </van-grid>
    <!-- Cell单元格组件 -->
    <van-cell title="消息通知" is-link> </van-cell>
    <van-cell class="xiao-zhi" title="小智同学" is-link></van-cell>
    <!-- clickable开启格子点击反馈,使得交互效果更好 -->
    <van-cell clickable class="lgout-cell" title="退出登录" v-if="user" @click="logout"></van-cell>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { getUserInfo } from '@/api/user'
export default {
  name: 'MyIndex',
  components: {},
  props: {},
  data() {
    return {
      // 用户信息
      userInfo: {}
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created() {
    if (this.user) {
      // 如果用户已登录，则加载用户信息
      this.loadUserInfo()
    }
  },
  mounted() {},
  methods: {
    logout() {
      // Dialog弹出框组件
      this.$dialog
        .confirm({
          title: '确认退出吗？'
        })
        .then(() => {
          console.log('确认退出')
          // 清除登录状态： vuex 和本地存储
          this.$store.commit('setUser', null)
        })
        .catch(() => {
          console.log('取消退出')
        })
    },
    async loadUserInfo() {
      try {
        const { data: res } = await getUserInfo()
        console.log('用户信息', res.data)
        this.userInfo = res.data
      } catch (error) {
        this.$toast('获取用户信息失败')
      }
    }
  }
}
</script>
<style scoped lang="less">
.my-container {
  .header {
    height: 361px;
    // 在css中使用@代表src的目录位置时，需要在@前面加个符号~
    background: url('~@/assets/banner.png');
    background-size: cover;
  }
  .not-login {
    display: flex;
    justify-content: center;
    align-items: center;
    .login-btn {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .mobile-img {
        width: 132px;
        height: 132px;
        margin-bottom: 15px;
      }
      .text {
        font-size: 28px;
        color: #fff;
      }
    }
  }
  .user-info {
    .base-info {
      height: 231px;
      box-sizing: border-box;
      padding: 76px 32px 23px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        display: flex;
        align-items: center;
        .head-portrait {
          width: 132px;
          height: 132px;
          margin-right: 23px;
          border: 4px solid #fff;
        }
        .name {
          color: #fff;
          font-size: 30px;
        }
      }
    }
    .data-statistics {
      height: 130px;
      display: flex;
      .data-item {
        height: 100%;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;
        .count {
          font-size: 30px;
        }
        .text {
          font-size: 23px;
        }
      }
    }
  }
  .grid-nav {
    height: 141px;
    .grid-item {
      height: 100%;
      .toutiao-shoucang {
        color: #eb5253;
        font-size: 45px;
      }
      .toutiao-lishixiao {
        color: #ff9d1d;
        font-size: 45px;
      }
      span.text {
        font-size: 28px;
      }
    }
  }
  .xiao-zhi {
    margin-bottom: 9px;
  }
  .lgout-cell {
    text-align: center;
    color: #d86262;
  }
}
</style>
