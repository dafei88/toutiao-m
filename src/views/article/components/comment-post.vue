<template>
  <div class="comment-post">
    <!-- Field输入框  -->
    <van-field class="post-field" v-model.trim="message" rows="2" autosize type="textarea" maxlength="50" placeholder="请输入留言" show-word-limit />
    <van-button class="post-btn" :disabled="!message.length" @click="onPostComment">发布</van-button>
  </div>
</template>

<script>
import { addComment } from '@/api/comment.js'
export default {
  name: 'CommentPost',
  components: {},
  props: {
    target: {
      type: [Number, String, Object],
      required: true
    }
  },
  inject: {
    articleId: {
      type: [Number, String, Object],
      default: null
    }
  },
  data() {
    return {
      message: ''
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onPostComment() {
      this.$toast.loading({
        message: '发布中...',
        forbidClick: true, // 禁用背景点击
        duration: 0 // 如果为0毫秒, 则持续展示 直到出现下一个对Toast轻提示组件的调用
      })
      try {
        // 请求接口添加评论
        const { data: res } = await addComment({
          // 评论文章即为文章id； 对评论进行回复即为评论id
          target: this.target,
          // 评论内容
          content: this.message,
          // 对文章进行评论时，不需传此参数；对评论进行评论时，此参数为文章id
          art_id: this.articleId
        })
        console.log('评论响应', res)
        // 发布的评论交给父组件： 1）在父组件关闭弹框； 2）在父组件中把最新发布的评论在评论列表中置顶
        this.$emit('post-success', res.data)
        // 清空文本框
        this.message = ''
        this.$toast.success('发布成功')
      } catch (error) {
        this.$toast.fail('发布失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
.comment-post {
  display: flex;
  align-items: center;
  padding: 32px 0 32px 32px;
  .post-field {
    background-color: #f5f7f9;
  }
  .post-btn {
    width: 150px;
    border: none;
    padding: 0;
    color: #6ba3d8;
    &::before {
      display: none;
    }
  }
}
</style>
