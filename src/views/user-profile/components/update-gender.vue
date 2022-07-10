<template>
  <!-- Picker选择器组件 单列选择时，可以通过 default-index 属性设置初始选中项的索引。 -->
  <van-picker title="标题" :default-index="gender" show-toolbar :columns="columns" @change="onPickeChange" @cancel="$emit('close')" @confirm="onConfirm" />
</template>

<script>
import { updateUserProfile } from '@/api/user.js'
export default {
  name: 'UpdateGender',
  props: {
    gender: {
      type: Number,
      required: true
    }
  },
  model: {
    prop: 'gender',
    event: 'update-gender'
  },
  components: {},
  data() {
    return {
      columns: ['男', '女'],
      localGender: 0
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onConfirm() {
      this.$toast.loading({
        message: '保存中...',
        // 禁止背景点击
        forbidClick: true,
        duration: 0
      })
      try {
        if (!this.columns.length) {
          this.$toast.success('性别不能为空')
        }
        // 更新数据库
        const { data: res } = await updateUserProfile({
          gender: this.localGender
        })
        console.log('更新性别成功', res)
        // 更新视图
        this.$emit('update-gender', this.localGender)
        // 关闭弹层
        this.$emit('close')
        // 提示成功
        this.$toast.success('更新性别成功')
      } catch (error) {
        this.$toast.fail('更新性别失败')
      }
    },
    onPickeChange(picker, value, index) {
      console.log(picker, value, index)
      this.localGender = index
    }
  }
}
</script>

<style scoped lang="less">
</style>
