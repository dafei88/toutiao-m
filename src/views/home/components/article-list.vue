<template>
  <div class="article-list">
    <!-- PullRefresh下拉刷新组件 -->
    <!-- 通过 success-text 可以设置刷新成功后的顶部提示文案。 -->
    <!-- success-duration 刷新成功提示展示时长(ms) -->
    <van-pull-refresh v-model="isPullRefreshLoading" :success-text="refreshSuccessText" :success-duration="1000" @refresh="onRefresh">
      <!-- List列表组件通过 loading 和 finished 两个变量控制加载状态，当组件滚动到底部时，会触发 load 事件并将 loading 设置成 true。此时可以发起异步操作并更新数据，数据更新完毕后，将 loading 设置成 false 即可。若数据已全部加载完毕，则直接将 finished 设置成 true 即可。 -->
      <!-- load事件：
    1）list初始化后会触发一次load事件，用于加载第一屏的数据。如果一次请求加载的数据条数较少，导致列表内容无法铺满当前屏幕，list会继续触发load事件，直到内容铺满屏幕或数据加载完成。
    2）loading属性：
    非加载中，loading为false,此时会根据滚动位置判断是否触发load事件（列表内容不足一屏幕时，会直接触发load事件）。
    加载中，loading为true,表示正在发送异步请求，此时不会触发load事件 。
    3）finished属性：
    在每次请求完毕后，需要手动将loading设置为false，表示本次加载结束。所有数据加载结束，finished为true,此时不会触发load事件。-->
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" :error.sync="error" error-text="请求失败，点击重新加载" @load="onLoad">
        <article-item :article="article" v-for="(article, index) in list" :key="index"> </article-item>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article.js'
import ArticleItem from '@/components/article-item/index.vue'
export default {
  name: 'ArticleListIndex',
  components: {
    ArticleItem
  },
  // 接受父组件传递过来的属性
  props: {
    channel: {
      type: Object,
      require: true
    }
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      timestamp: null, // 请求获取下一页数据的时间戳
      error: false, // 控制列表加载失败的提示状态
      isPullRefreshLoading: false, // 是否下拉刷新
      refreshSuccessText: '刷新成功' // 下拉刷新成功提示文本
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onLoad() {
      try {
        // 1）请求获取文章列表数据
        const { data: res } = await getArticles({
          // 频道Id
          channel_id: this.channel.id,
          // timestamp 简单理解就是请求数据的页码
          // 请求第1页数据：当前最新时间戳
          // 请求第2页的数据：时间戳会在第一页请求结果中返回
          // 请求第3页的数据：时间戳会在第二页请求结果中返回
          timestamp: this.timestamp || Date.now()
        })

        // 2）把请求结果数据放到data的list中
        // 数组的展开操作符，它会把数组元素一个一个拿出来
        const results = res.data.results
        this.list.push(...results)
        // 3）本次数据加载结束之后 把加载状态设置为false
        this.loading = false
        // 4) 如果本次加载有数据  那下次加载也可能的有
        if (results.length) {
          this.timestamp = res.data.pre_timestamp
        } else {
          // 没有数据
          this.finished = true
        }
      } catch (error) {
        // 展示错误提示
        this.error = true
        //  请求失败了，关闭“加载中...""
        this.loading = false
      }
    },
    // 下拉刷新的时候触发该函数
    async onRefresh() {
      try {
        // 1）请求获取数据
        const { data: res } = await getArticles({
          // 频道Id
          channel_id: this.channel.id,
          // 下拉刷新时，每次请求获取最新数据
          timestamp: Date.now()
        })
        // 为了看到失败的情况  模拟随机失败
        // if (Math.random() > 0.5) {
        //   JSON.parse('dadada')
        // }
        // 2）将下拉刷新获取的数据追加到数组顶部
        this.list.unshift(...res.data.results)
        // 3）关闭下拉刷新"加载中..."
        this.isPullRefreshLoading = false
        // 4）更新下拉刷新成功提示的文本
        this.refreshSuccessText = `刷新成功，更新了${res.data.results.length}条数据`
      } catch (error) {
        // 5）关闭下拉刷新"加载中..."
        this.isPullRefreshLoading = false
        // 6) 提示下拉刷新失败
        this.refreshSuccessText = '刷新失败'
      }
    }
  }
}
</script>

<style scoped lang="less">
// 在组件的根节点上设置如下，就可以使得每个文章列表组件（就是本组件）实例产生自己的滚动容器
.article-list {
  height: 79vh;
  overflow-y: auto;
}
</style>
