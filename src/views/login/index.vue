<template>
  <div class="login-container">
    <!-- NavBar导航栏组件 -->
    <van-nav-bar class="page-nav-bar" title="登录" />
    <!-- Form表单组件 -->
    <van-form @submit="onSubmit" ref="loginFormRef">
      <!-- Field输入框组件 -->
      <!-- type="number"表示输入框只能输入数字 -->
      <!-- maxlength="11"表示输入框只能输入11位 -->
      <van-field name="mobile" v-model="user.mobile" placeholder="请输入手机号" type="number" maxlength="11" :rules="userFormRules.mobile">
        <!-- Field输入框组件中提供了Slots插槽。slot="left-icon"表示自定义输入框头部图标  -->
        <i slot="left-icon" class="toutiao toutiao-shouji"></i>
      </van-field>

      <van-field name="code" v-model="user.code" placeholder="请输入验证码" type="number" maxlength="6" :rules="userFormRules.code">
        <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
        <!-- Field输入框组件  通过 button 插槽可以在输入框尾部插入按钮 -->
        <template #button>
          <!-- CountDown倒计时组件 -->
          <!-- :time="time" 第二个time表示倒计时时间 -->
          <!-- format="ss s" 通过 format 属性设置倒计时文本的内容 -->
          <!-- @finish="isCountDownShow = false" 倒计时结束时触发 -->
          <van-count-down v-if="isCountDownShow" :time="1000 * 60" format="ss s" @finish="isCountDownShow = false" />
          <!-- 在表单中，除了提交按钮外，可能还有一些其他的功能性按钮，如发送验证码按钮。在使用这些按钮时，要注意将native-type设置为button,否则会触发表单提交 -->
          <van-button round size="small" native-type="button" v-else type="default" class="send-sms-btn" @click="onSendSms">发送验证码</van-button>
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <!-- 当我们点击登录的时候，会触发native-type指定的submit事件,从Form表单的@submit="onSubmit"可知， 该submit事件进而触发了onSubmit事件 -->
        <van-button block type="info" native-type="submit" class="login-btn">登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user'
export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data() {
    return {
      user: {
        mobile: '',
        code: ''
      },
      userFormRules: {
        mobile: [
          { required: true, message: '手机号不能为空' },
          {
            pattern: /1[3|5|7|8]\d{9}/,
            message: '手机号格式错误'
          }
        ],
        code: [
          { required: true, message: '验证码不能为空' },
          {
            pattern: /\d{6}/,
            message: '验证码格式错误'
          }
        ]
      },
      // 是否展示倒计时
      isCountDownShow: false
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onSubmit() {
      // 1.获取表单数据
      const user = this.user
      // 2.表单验证
      // Vant组件库提供了Toast轻提示组件,使用方法如下：
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true, // 禁用背景点击
        duration: 0 // 如果为0毫秒, 则持续展示 直到出现下一个对Toast轻提示组件的调用
      })
      // 3.提交表单请求登录
      try {
        const { data: res } = await login(user)
        // 将refresh_token和token存储到vuex中
        this.$store.commit('setUser', res.data)
        this.$toast.success('登录成功')
      } catch (err) {
        if (err.response.status === 400) {
          this.$toast.fail('手机号或验证码错误')
        } else {
          this.$toast.fail('登录失败，请稍后重试')
        }
      }
      // 4.根据请求响应结果处理后续操作
    },
    async onSendSms() {
      // 1.校验手机号
      // Form表单组件提供了validate方法，用来验证表单，并且支持传入输入框的name属性值来验证单个表单项。注意：1）validate方法需要表单的实例对象来调用；2）validate方法的返回值是promise。
      try {
        await this.$refs.loginFormRef.validate('mobile')
      } catch (error) {
        return ''
      }
      // 2.验证通过，显示倒计时
      this.isCountDownShow = true
      // 3.请求发送验证码
      try {
        await sendSms(this.user.mobile)
        this.$toast.success('发送验证码成功')
      } catch (error) {
        // 发送验证码失败时，关闭倒计时
        this.isCountDownShow = false
        if (error.response.status === 429) {
          this.$toast.fail('点击“发送验证码”太频繁，请稍后重试')
        } else {
          this.$toast.fail('发送验证码失败')
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  .toutiao {
    font-size: 37px;
  }
  .send-sms-btn {
    background-color: #ededed;
    width: 156px;
    height: 46px;
    line-height: 46px;
    font-size: 20px;
    color: #666;
  }
  .login-btn-wrap {
    margin: 53px 33px;
    .login-btn {
      background-color: #6db4fd;
      //   去掉外边框
      border: none;
    }
  }
}
</style>
