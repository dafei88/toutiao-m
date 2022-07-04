<template>
  <div class="search-container">
    <form class="search-form" action="/">
      <!-- Search搜索组件  通过 background 属性可以设置搜索框外部的背景色。-->
      <van-search v-model="searchText" show-action placeholder="请输入搜索关键词" background="#3296fa" @search="onSearch" @cancel="onCancel" @focus="isResultShow = false" />
    </form>
    <!-- 搜索结果 -->
    <search-results v-if="isResultShow" :search-text="searchText"></search-results>
    <!-- 联想建议 -->
    <search-suggestion @search="onSearch" v-else-if="searchText" :search-text="searchText"></search-suggestion>
    <!-- 搜索历史 -->
    <search-history :search-histories="searchHistories" v-else @deleteHistory="deleteHistory" @deleteAllHistorys="deleteAllHistorys" @search="onSearch"></search-history>
  </div>
</template>

<script>
import SearchHistory from '@/views/search/components/search-history.vue'
import SearchResults from '@/views/search/components/search-results.vue'
import SearchSuggestion from '@/views/search/components/search-suggestion.vue'
import { setItem, getItem } from '@/utils/storage.js'
export default {
  name: 'SearchIndex',
  components: {
    SearchHistory,
    SearchResults,
    SearchSuggestion
  },
  props: {},
  data() {
    return {
      searchText: '',
      isResultShow: false,
      // 当本地存储没有'TOUTIAO_SEARCH_HISTORIES'这个键时， getItem('TOUTIAO_SEARCH_HISTORIES')的值为null
      searchHistories: getItem('TOUTIAO_SEARCH_HISTORIES') || []
    }
  },
  computed: {},
  watch: {
    searchHistories: {
      handler(value) {
        setItem('TOUTIAO_SEARCH_HISTORIES', value)
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    // 点击移动端键盘上的搜索或者点击pc端键盘上的enter键
    onSearch(val) {
      console.log('val', val)
      // 点击联想建议列表中的某一项时  需要把该项的内容赋值给searchText
      this.searchText = val
      // 存储搜索历史记录
      // 要求：不要有重复历史记录 最新的排在最前面
      const index = this.searchHistories.indexOf(val)
      if (index !== -1) {
        // 去掉重复的
        this.searchHistories.splice(index, 1)
      }
      this.searchHistories.unshift(val)
      // 搜索结果
      this.isResultShow = true
    },
    onCancel() {
      this.$router.back()
    },
    deleteHistory(index) {
      this.searchHistories.splice(index, 1)
    },
    deleteAllHistorys() {
      this.searchHistories = []
    }
  }
}
</script>

<style scoped lang="less">
.search-container {
  padding-top: 108px;
  .van-search__action {
    color: #fff;
  }
  .search-form {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>
