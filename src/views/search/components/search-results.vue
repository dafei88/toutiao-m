<template>
  <div class="search-results">
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :error.sync="error" error-text="加载失败，请点击重试">
      <van-cell v-for="(article, index) in list" :key="index" :title="article.title" />
    </van-list>
  </div>
</template>

<script>
import { getSearchResults } from '@/api/search.js'
export default {
  name: 'SearchResults',
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  components: {},
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      perPage: 20,
      error: false
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onLoad() {
      try {
        // 1.请求获取数据
        const { data: res } = await getSearchResults({
          page: this.page,
          per_page: this.perPage,
          q: this.searchText
        })
        console.log(res)
        // 为了看到失败的情况  模拟随机失败
        if (Math.random() > 0.5) {
          JSON.parse('dadada')
        }
        // 2.将数据添加到数组中
        this.list.push(...res.data.results)
        // 3.将本次加载中的loading关闭
        this.loading = false
        // 4.判断是否还有数据。
        if (res.data.results.length) {
          // 如果有，则更新获取下一页数据的页码
          this.page++
        } else {
          // 如果没有，则将加载状态finished设置为结束
          this.finished = true
        }
      } catch (error) {
        // 此时将error设置成true 即可显示错误提示，用户点击错误提示后会重新触发load事件。
        this.error = true
        // 将本次加载中的loading关闭
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="less">
.search-results {
}
</style>
