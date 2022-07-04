<template>
  <div class="search-history">
    <!-- Cell单元格组件 -->
    <van-cell title="搜索历史">
      <div v-if="isDeleteShow">
        <span @click="deleteAllHistorys">全部删除</span>
        &nbsp;&nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </div>
      <van-icon v-else slot="default" name="delete-o" @click="isDeleteShow = true" />
    </van-cell>
    <van-cell :title="item" v-for="(item, index) in searchHistories" :key="index" @click="onSearchItemClick(item, index)">
      <van-icon v-if="isDeleteShow" slot="default" name="close" />
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  components: {},
  props: {
    searchHistories: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isDeleteShow: false
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onSearchItemClick(item, index) {
      if (this.isDeleteShow) {
        // 删除状态
        this.$emit('deleteHistory', index)
      } else {
        // 非删除状态，直接进入搜索
        this.$emit('search', item)
      }
    },
    deleteAllHistorys() {
      this.$emit('deleteAllHistorys')
    }
  }
}
</script>

<style scoped lang="less">
.search-history {
}
</style>
