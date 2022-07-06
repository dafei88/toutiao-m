<template>
  <div class="like-article">
    <van-icon @click="onLike" :color="this.attitude === 1 ? '#ffa500' : ''" :name="this.attitude === 1 ? 'good-job' : 'good-job-o'" />
  </div>
</template>

<script>
import { likeArticle, cancelLikeArticle } from '@/api/article.js'
export default {
  name: 'LikeArticle',
  components: {},
  model: {
    prop: 'attitude',
    event: 'update-attitude'
  },
  props: {
    attitude: {
      type: Number,
      required: true
    },
    artId: {
      type: String,
      required: true
    }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onLike() {
      try {
        // 无状态
        let status = -1
        if (this.attitude === 1) {
          // 已点赞 取消点赞
          const { data: res } = await likeArticle(this.artId)
          // 表示取消点赞
          status = 0
          console.log('取消点赞成功', res)
        } else {
          // 未点赞 添加点赞
          const { data: res } = await cancelLikeArticle(this.artId)
          // 表示点赞成功
          status = 1
          console.log('点赞成功', res)
        }
        this.$emit('update-attitude', status)
        this.$toast(status === 1 ? '点赞成功' : '已取消点赞')
      } catch (error) {
        this.$toast('操作失败，请重试!')
      }
    }
  }
}
</script>

<style scoped lang="less">
</style>
