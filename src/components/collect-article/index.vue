<template>
  <van-icon @click="onCollect" :color="isCollected ? '#ffa500' : ''" :name="isCollected ? 'star' : 'star-o'" />
</template>

<script>
import { collectArticle, cancelCollectArticle } from '@/api/article.js'
export default {
  name: 'CollectArticle',
  model: {
    prop: 'is-collected',
    event: 'update-is-collected'
  },
  components: {},
  props: {
    isCollected: {
      type: Boolean,
      required: true
    },
    artId: {
      type: [String, Number, Object],
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
    async onCollect() {
      try {
        if (this.isCollected) {
          // 已收藏 取消收藏
          const { data: res } = await cancelCollectArticle(this.artId)
          console.log('取消收藏成功', res)
        } else {
          // 未收藏 添加收藏
          const { data: res } = await collectArticle(this.artId)
          console.log('添加收藏成功', res)
        }
        this.$emit('update-is-collected', !this.isCollected)
        // 因为未收藏（或已收藏）时  isCollected为false（或true） , 点击收藏图标  调用接口添加（或取消）收藏  成功后, 使用this.$emit在父组件中修改article.is-collected的值  注意父组件中article.is-collected的修改对子组件的isCollected的影响不是立即的 .  也就是说：调用接口添加(或取消)收藏成功时 子组件中的isCollected的值没有及时被修改   这时也就出现了 this.isCollected的值为false时 表示收藏成功  this.isCollected的值为true时  表示收藏失败
        this.$toast.success(!this.isCollected ? '收藏成功' : '已取消收藏')
      } catch (error) {
        this.$toast('操作失败，请重试！')
      }
    }
  }
}
</script>

<style scoped lang="less">
</style>
