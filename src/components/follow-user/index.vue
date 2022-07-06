<template>
  <div class="follow-user">
    <!-- Button按钮组件 通过 loading 属性设置按钮为加载状态 -->
    <van-button class="follow-btn" round size="small" v-if="isFollowed" @click="onFollow" :loading="followLoading">已关注</van-button>
    <van-button class="follow-btn" type="info" color="#3296fa" round size="small" icon="plus" v-else @click="onFollow" :loading="followLoading">关注</van-button>
  </div>
</template>

<script>
import { addFollow, cancelFollow } from '@/api/user'
export default {
  name: 'FollowUser',
  model: {
    prop: 'is-followed',
    event: 'update-is-followed'
  },
  components: {},
  props: {
    isFollowed: {
      type: Boolean,
      required: true
    },
    autId: {
      type: [String, Object, Number],
      required: true
    }
  },
  data() {
    return {
      followLoading: false
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onFollow() {
      // 点击后 展示加载状态
      this.followLoading = true
      try {
        if (this.isFollowed) {
          // 已关注，取消关注
          const { data: res } = await cancelFollow(this.autId)
          console.log('取消关注成功', res)
        } else {
          // 没有关注，添加关注
          const { data: res } = await addFollow(this.autId)
          console.log('添加关注成功', res)
        }
        this.$emit('update-is-followed', !this.isFollowed)
      } catch (error) {
        const message = '操作失败，请重试'
        if (error.response && error.response.status === 400) {
          this.toast('不能关注自己的文章')
        }
        this.$toast(message)
      }
      // 获取数据后 无论成功或者失败 关闭加载状态
      this.followLoading = false
    }
  }
}
</script>

<style scoped lang="less">
.follow-user {
  .follow-btn {
    width: 170px;
    height: 58px;
  }
}
</style>
