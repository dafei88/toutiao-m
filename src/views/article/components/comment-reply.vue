<template>
  <div class="comment-reply">
    <van-nav-bar :title="comment.reply_count > 0 ? `${comment.reply_count}条回复` : '暂无回复'">
      <!-- NavBar导航栏组件提供了Slots插槽,slots="left"自定义左侧区域内容 -->
      <van-icon slot="left" name="cross" @click="$emit('close')" />
    </van-nav-bar>
    <div class="scroll-wrap">
      <comment-item :comment="comment" @update-is-liking="updateIsLiking($event)"></comment-item>
      <!-- 评论的回复列表 -->
      <van-cell title="全部回复" />
      <!-- :immediate-check="false" 是否在初始化时立即执行滚动位置检查 -->
      <comment-list :list="comList" :source="comment.com_id" type="c" :immediate-check="false" @update-list="updateList"></comment-list>
    </div>
    <!-- 发布对评论的评论 -->
    <div class="post-wrap">
      <van-button class="post-btn" size="small" round @click="isPostShow = true">写评论</van-button>
    </div>
    <van-popup v-model="isPostShow" position="bottom">
      <comment-post :target="comment.com_id" @post-success="postSuccess"></comment-post>
    </van-popup>
  </div>
</template>

<script>
import CommentItem from './comment-item.vue'
import CommentList from './article-comment.vue'
import CommentPost from './comment-post.vue'
export default {
  name: 'CommentReply',
  components: {
    CommentItem,
    CommentList,
    CommentPost
  },
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      comList: [],
      isPostShow: false
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    updateIsLiking(val) {
      this.$emit('update-is-liking', val)
    },
    updateList(results) {
      console.log('结果', results)
      this.comList.push(...results)
    },
    postSuccess(val) {
      // 更新回复的数量
      this.$emit('update-reply-count', 1)
      this.isPostShow = false
      this.comList.unshift(val.new_obj)
    }
  }
}
</script>

<style scoped lang="less">
.scroll-wrap {
  position: fixed;
  top: 92px;
  left: 0;
  right: 0;
  bottom: 88px;
  // 垂直方向的滚动条
  overflow-y: auto;
}
.post-wrap {
  height: 88px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-top: 1px solid #d8d8d8;
  .post-btn {
    width: 60%;
  }
}
</style>
