<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" left-arrow title="黑马头条"></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="this.loading">
        <!-- Loading加载组件 设置 vertical 属性后，图标和文案会垂直排列。 -->
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div class="article-detail" v-else-if="article.title">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image class="avatar" slot="icon" round fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">{{ article.pubdate | relativeTime }}</div>
          <!-- $event是子组件传来的参数 -->
          <follow-user v-model="article.is_followed" :aut-id="article.aut_id"></follow-user>
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div class="article-content markdown-body" v-html="article.content" ref="article-content"></div>
        <van-divider>正文结束</van-divider>
        <!-- 文章评论列表 -->
        <comment-list @reply-click="onReplyClick" @update-list="updateCommentList" :list="commentList" :source="article.art_id" @onload-success="totalCommentCount = $event.total_count"></comment-list>
        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button class="comment-btn" type="default" round size="small" @click="isPostShow = true">写评论</van-button>
          <!-- Icon图标组件 设置 badge 属性后，会在图标右上角展示相应的徽标 -->
          <van-icon name="comment-o" :badge="this.totalCommentCount" color="#777" />
          <collect-article v-model="article.is_collected" :art-id="article.art_id"></collect-article>
          <like-article v-model="article.attitude" :art-id="article.art_id"></like-article>
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div class="error-wrap" v-else-if="errStatus === 404">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div class="error-wrap" v-else>
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArticle">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>
    <!-- 对文章评论的的弹层 -->
    <!-- Popup弹出层 -->
    <!-- 弹出层是懒渲染的：只有在第一次展示的时候才会渲染里面的内容 -->
    <van-popup v-model="isPostShow" position="bottom">
      <comment-post :target="article.art_id" @post-success="onPostSuccess"></comment-post>
    </van-popup>
    <!-- 对评论回复的弹层 -->
    <van-popup v-model="isReplyShow" style="height: 100%" position="bottom">
      <!-- v-if等于ture时 渲染元素（或组件）   v-if等于false时 移除元素（或组件） 这样就会使得你每次点击评论的回复按钮时 弹层的内容(也就是CommentList组件）就会被重新加载渲染 -->
      <comment-reply
        v-if="isReplyShow"
        :comment="currentComment"
        @close="isReplyShow = false"
        @update-is-liking="currentComment.is_liking = $event"
        @update-reply-count="updateReplyCount"
      ></comment-reply>
    </van-popup>
  </div>
</template>

<script>
import { getArticleById } from '@/api/article'
// ImagePreview图片预览组件比较特殊，使用时需要单独导入
import { ImagePreview } from 'vant'
import followUser from '@/components/follow-user/index.vue'
import CollectArticle from '@/components/collect-article/index.vue'
import LikeArticle from '@/components/like-article/index.vue'
import CommentList from '@/views/article/components/article-comment.vue'
import CommentPost from '@/views/article/components/comment-post.vue'
import CommentReply from '@/views/article/components/comment-reply.vue'
export default {
  name: 'ArticleIndex',
  components: {
    followUser,
    CollectArticle,
    LikeArticle,
    CommentList,
    CommentPost,
    CommentReply
  },
  props: {
    articleId: {
      // 点击文章列表项中的某一项到文章详情组件，传来的articleId的值是Number类型
      // 直接复制文章详情的链接（例如：http://localhost:8080/#/article/8103）到浏览器中，传来的articleId的值是String类型
      // 当数据超出javaScript安全整数范围时，就会变成BigNumber类型的对象。因为articleId是后端返回的数据，在request.js中，针对后端返回的数据进行了处理。
      type: [Number, String, Object],
      required: true
    }
  },
  // 给所有的后代组件提供数据
  provide: function () {
    return {
      articleId: this.articleId
    }
  },
  data() {
    return {
      article: {},
      loading: true, // 加载中
      errStatus: 0,
      totalCommentCount: 0,
      isPostShow: false,
      // 定义commentList数组类型的变量，是为了获取子组件CommentList的评论列表  这样做的原因：我们需要在本组件（也就是CommentList的父组件）操作CommentList的评论列表。比如添加评论
      commentList: [],
      isReplyShow: false,
      currentComment: {}
    }
  },
  computed: {},
  watch: {},
  created() {
    this.loadArticle()
  },
  mounted() {},
  methods: {
    async loadArticle() {
      // 内容加载失败后 点击重试  这时需要设置this.loading = true
      this.loading = true
      try {
        const { data: res } = await getArticleById(this.articleId)
        // 为了看到失败的情况 模仿随机失败
        // if (Math.random() > 0.5) {
        //   JSON.parse('agbdsds')
        // }
        this.article = res.data
        // 初始化图片点击预览
        // 在vue中，数据驱动视图不是立即的 所以使用setTimeout进行延迟一下
        setTimeout(() => {
          console.log(this.$refs['article-content'])
          this.previewImage()
        }, 0)
        console.log('获取文章详情', res)
      } catch (error) {
        console.log('error', error)
        if (error.response && error.response.status === 404) {
          this.errStatus = 404
        }
        console.log('获取数据失败', error)
      }
      // 请求成功或失败 关闭loading
      this.loading = false
    },
    previewImage() {
      const articleContent = this.$refs['article-content']
      // 得到所有的img节点
      const imgs = articleContent.querySelectorAll('img')
      console.log('文章详情中所有的img节点', imgs)
      const images = []
      imgs.forEach((img, index) => {
        // 将每个图片的地址放到images数组中
        images.push(img.src)
        // 给每个图片添加点击事件
        img.onClick = () => {
          ImagePreview({
            images: images,
            // 起始位置: 从0开始
            startPosition: index,
            closeable: true
          })
        }
      })
      console.log('文章中所有图片的url地址', images)
    },
    onPostSuccess(obj) {
      // 关闭弹层
      this.isPostShow = false
      // 将发布内容放到评论列表顶部
      this.commentList.unshift(obj.new_obj)
    },
    updateCommentList(results) {
      this.commentList.push(...results)
    },
    onReplyClick(comment) {
      console.log(comment)
      // 显示对评论回复的弹出层
      this.isReplyShow = true
      this.currentComment = comment
    },
    updateReplyCount(val) {
      this.currentComment.reply_count++
    }
  }
}
</script>

<style scoped lang="less">
@import './github-markdown.css';
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
