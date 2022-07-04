<template>
  <div class="search-suggestion">
    <van-cell icon="search" :key="index" v-for="(text, index) in suggestions" @click="$emit('search', text)">
      <div v-html="highlight(text)" slot="title"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestion } from '@/api/search'
import { debounce } from 'lodash'
export default {
  name: 'SearchSuggestion',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      // 联想建议数据列表
      suggestions: []
    }
  },
  computed: {},
  watch: {
    searchText: {
      // 当searchText发生变化时，触发handler函数。注意： handler函数名称是固定的
      // debounce函数
      // 参数1：一个函数
      // 参数2：延迟时间，单位毫秒ms
      handler: debounce(function (value) {
        console.log(value)
        this.loadSearchSuggestion(this.searchText)
      }, 500),
      // 该回调将会在侦听开始之后立即调用
      immediate: true
    }
  },
  created() {},
  mounted() {},
  methods: {
    async loadSearchSuggestion(q) {
      try {
        const { data: res } = await getSearchSuggestion(q)
        this.suggestions = res.data.options
      } catch (error) {
        this.$toast('数据获取失败，请稍后重试')
      }
    },
    highlight(text) {
      const hightlightStr = `<span class="active">${this.searchText}</span>`
      // 如果需要根据变量（也就是动态值）创建正则表达式，则手动new RegExp()
      // 参数1： 匹配模式字符串 它会根据该字符串创建正则对象
      // 参数2：匹配模式 。g表示对整个text进行匹配；i表示忽略大小写。
      const reg = new RegExp(this.searchText, 'gi')
      if (text) {
        return text.replace(reg, hightlightStr)
      }
    }
  }
}
</script>

<style scoped lang="less">
.search-suggestion {
  /deep/ span.active {
    color: #3296fa;
  }
}
</style>
