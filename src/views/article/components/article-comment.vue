<template>
  <div class="comment-list">
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :error.sync="error" error-text="请求失败，点击重新加载">
      <comment-item
        @reply-click="$emit('reply-click', $event)"
        @update-is-liking="updateIsLiking($event, item)"
        @update-like-count="updateLikeCount($event, item)"
        v-for="(item, index) in list"
        :key="index"
        :comment="item"
      ></comment-item>
    </van-list>
  </div>
</template>

<script>
import { getComment } from '@/api/comment.js'
import CommentItem from '@/views/article/components/comment-item.vue'
export default {
  name: 'CommentList',
  components: {
    CommentItem
  },
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    },
    list: {
      type: Array,
      // 针对数组设置默认值
      // 方式一
      // default: () => []
      // 方式二
      default: function () {
        return []
      }
    },
    type: {
      type: String,
      // 自定义Prop数据验证
      validator(value) {
        return ['a', 'c'].includes(value)
      },
      default: 'a'
    }
  },
  data() {
    return {
      loading: false,
      finished: false,
      offset: null,
      limit: 10,
      error: false
    }
  },
  computed: {},
  watch: {},
  created() {
    // List列表组件 不在可视区域时 不会触发load事件 也就没有请求获取评论或评论回复的接口 使得：当不在可视区域时 ，底部区域的评论图标右上角的评论总数为0。希望即使不在可视区域时，底部区域的评论图标右上角的评论总数为实际评论数量。解决办法： 在created生命周期函数中，调用load绑定的事件onLoad
    // 在这里手动触发List列表组件的onLoad事件，this.load不会自动变为true   也就不会出现"加载中..."  怎么解决呢？
    this.loading = true
    this.onLoad()
  },
  mounted() {},
  methods: {
    async onLoad() {
      try {
        // 1.请求获取数据
        const { data: res } = await getComment({
          // 'a'表示对文章的评论；'c'表示评论的回复 这里是对文章的评论
          type: this.type,
          // 文章id 评论id
          source: this.source,
          // 本次返回结果的最后一个评论的id 作为请求下一页数据的offset参数，若本次无具体数据返回，则值为null
          offset: this.offset,
          // 获取的评论数据个数
          limit: this.limit
        })
        // 为了看到失败的情况 模仿随机失败
        // if (Math.random() > 0.5) {
        //   JSON.parse('abadddasdg')
        // }
        console.log('评论列表', res)
        const { results } = res.data
        if (this.type === 'a') {
          // 把请求获取评论或评论回复接口的结果传递给父组件使用
          this.$emit('onload-success', res.data)
        }
        // 2.将数据添加到列表中
        this.$emit('update-list', results)
        // 3. 将loading设置为false
        this.loading = false
        // 4. 判断是否还有数据。 如果有 则更新获取下一页数据的页码； 如果没有 则finished设置为true
        if (results.length) {
          this.offset = res.data.last_id
        } else {
          this.finished = true
        }
      } catch (error) {
        this.$toast('获取数据失败', error)
        this.error = true
        this.loading = false
      }
    },
    updateLikeCount(val, item) {
      console.log('val的值', val)
      console.log('item的值', item)
      item.like_count = item.like_count + val
    },
    updateIsLiking(val, item) {
      item.is_liking = val
    }
  }
}
</script>

<style>
</style>
