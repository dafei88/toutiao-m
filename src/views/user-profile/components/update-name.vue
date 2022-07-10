<template>
  <div class="update-name">
    <van-nav-bar title="设置昵称" left-text="取消" right-text="完成" @click-left="$emit('close')" @click-right="updateUsername"> </van-nav-bar>
    <!-- 对于 textarea，可以通过 autosize 属性设置高度自适应。 -->
    <div class="field-wrap">
      <van-field v-model="message" rows="2" autosize type="textarea" maxlength="50" show-word-limit placeholder="请输入昵称" />
    </div>
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user.js'
export default {
  name: 'UpdateName',
  components: {},
  model: {
    prop: 'username',
    event: 'update-username'
  },
  props: {
    username: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      message: this.username
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async updateUsername() {
      this.$toast.loading({
        message: '保存中...',
        // 禁止背景点击
        forbidClick: true,
        duration: 0
      })
      try {
        if (!this.message.length) {
          this.$toast.success('昵称不能为空')
        }
        // 更新数据库
        const { data: res } = await updateUserProfile({
          name: this.message
        })
        console.log('更新昵称成功', res)
        // 更新视图
        this.$emit('update-username', this.message)
        // 关闭弹层
        this.$emit('close')
        // 提示成功
        this.$toast.success('更新昵称成功')
      } catch (error) {
        this.$toast.fail('更新昵称失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
.field-wrap {
  padding: 20px;
}
</style>
