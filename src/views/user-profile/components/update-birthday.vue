<template>
  <div class="update-birthday">
    <!-- DatetimePicker时间选择器 -->
    <!-- v-model="currentDate" 设置时间选择器的默认值 同步时间选择器的日期 -->
    <!-- :min-date="minDate" 设置时间选择器的日期下限 -->
    <!-- :max-date="maxDate" 设置时间选择器的日期上线 -->
    <van-datetime-picker v-model="currentDate" type="date" :min-date="minDate" :max-date="maxDate" @cancel="$emit('close')" @confirm="onConfirm" />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user.js'
import dayjs from 'dayjs'
export default {
  name: 'UpdateBirthday',
  components: {},
  model: {
    prop: 'birthday',
    event: 'update-birthday'
  },
  props: {
    birthday: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      minDate: new Date(1970, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.birthday)
    }
  },
  created() {},
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    async onConfirm() {
      this.$toast.loading({
        message: '保存中...',
        // 禁止背景点击
        forbidClick: true,
        duration: 0
      })
      try {
        // 更新数据库
        const { data: res } = await updateUserProfile({
          // dayjs(this.currentDate).format('YYYY-MM-DD') 把指定时间安装指定格式转换
          birthday: dayjs(this.currentDate).format('YYYY-MM-DD')
        })
        console.log('更新生日成功', res)
        // 更新视图
        this.$emit('update-birthday', dayjs(this.currentDate).format('YYYY-MM-DD'))
        // 关闭弹层
        this.$emit('close')
        // 提示成功
        this.$toast.success('更新生日成功')
      } catch (error) {
        this.$toast.fail('更新生日失败')
      }
    }
  }
}
</script>

<style>
</style>
