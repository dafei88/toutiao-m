<template>
  <!-- Cell单元格组件 -->
  <!-- 这里提供了三种路由方法： -->
  <!-- :to="'/article/'+article.art_id" -->
  <!-- :to="`/article/${article.art_id}`" -->
  <!-- :to="{
      name: 'article',
      params: {
        articleId: article.art_id
      }
    }" -->
  <van-cell
    class="article-item"
    :to="{
      // 根据路由名称进行跳转
      name: 'article',
      // 传递路由动态参数
      params: {
        // 属性名:路由路径中设计的动态参数名称
        articleId: article.art_id
      }
    }"
  >
    <!-- Cell单元格组件提供了Slots插槽，slot="title"自定义左侧 title 的内容; slot="label"自定义标题下方 label 的内容; slot="default"自定义右侧 value 的内容-->
    <!-- Style内置样式组件 van-multi-ellipsis--l2表示最多显示两行 -->
    <div slot="title" class="title van-multi-ellipsis--l2">{{ article.title }}</div>
    <van-image class="right-cover" slot="default" fit="cover" v-if="article.cover.type === 1" :src="article.cover.images[0]" />
    <div slot="label">
      <div class="cover-wrap" v-if="article.cover.type === 3">
        <div class="cover-item" v-for="(img, index) in article.cover.images" :key="index">
          <van-image class="cover-item-img" slot="default" fit="cover" :src="img" />
        </div>
      </div>
      <div class="label-info-wrap">
        <span>{{ article.aut_name }}</span>
        <span>{{ article.comm_count }}</span>
        <span>{{ article.pubdate | relativeTime }}</span>
      </div>
    </div>
  </van-cell>
</template>

<script>
export default {
  name: 'AriticleItem',
  components: {},
  props: {
    article: {
      type: Object,
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
  methods: {}
}
</script>

<style scoped lang="less">
.article-item {
  .title {
    font-size: 32px;
    color: #3a3a3a;
  }
  .van-cell__value {
    flex: unset;
    width: 232px;
    height: 146px;
    padding-left: 25px;
  }
  .right-cover {
    width: 232px;
    height: 146px;
  }
  .label-info-wrap span {
    font-size: 22px;
    color: #b4b4b4;
    margin-right: 25px;
  }
  .cover-wrap {
    display: flex;
    padding: 30px 0;
    .cover-item {
      flex: 1;
      height: 146px;
      &:not(:last-child) {
        padding-right: 4px;
      }
      .cover-item-img {
        width: 100%;
        height: 146px;
      }
    }
  }
}
</style>
