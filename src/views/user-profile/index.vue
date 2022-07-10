<template>
  <div class="user-profile">
    <van-nav-bar title="个人信息" class="page-nav-bar" left-arrow @click-left="$router.back()" />
    <!-- Cell单元格组件 设置 is-link 属性后会在单元格右侧显示箭头 -->
    <input type="file" hidden ref="file" @change="onFileChange" />
    <van-cell title="头像" is-link @click="$refs.file.click()">
      <van-image width="30" class="avatar" height="30" round fit="cover" :src="userInfo.photo" />
    </van-cell>
    <van-cell title="昵称" :value="userInfo.name" is-link @click="isUpdateNameShow = true"></van-cell>
    <van-cell title="性别" :value="userInfo.gender === 0 ? '男' : '女'" is-link @click="isUpdateGenderShow = true"></van-cell>
    <van-cell title="生日" :value="userInfo.birthday" is-link @click="isUpdateBirthdayShow = true"></van-cell>
    <!-- Popup弹出层组件 -->
    <!-- 编辑昵称弹框 -->
    <van-popup position="top" style="height: 100%" v-model="isUpdateNameShow">
      <update-name v-if="isUpdateNameShow" @close="isUpdateNameShow = false" v-model.trim="userInfo.name"></update-name>
    </van-popup>
    <!-- 编辑性别弹框 -->
    <van-popup position="bottom" v-model="isUpdateGenderShow">
      <update-gender v-if="isUpdateGenderShow" @close="isUpdateGenderShow = false" v-model="userInfo.gender"></update-gender>
    </van-popup>
    <!-- 编辑生日选择器 -->
    <van-popup position="bottom" v-model="isUpdateBirthdayShow">
      <update-birthday v-if="isUpdateBirthdayShow" v-model="userInfo.birthday" @close="isUpdateBirthdayShow = false"></update-birthday>
    </van-popup>
    <van-popup position="bottom" style="height: 100%" v-model="isUpdatePhotoShow">
      <update-photo v-if="isUpdatePhotoShow" :img="img" @close="isUpdatePhotoShow = false" @update-photo="updatePhoto"></update-photo>
    </van-popup>
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user.js'
import UpdateName from '@/views/user-profile/components/update-name.vue'
import UpdateGender from '@/views/user-profile/components/update-gender.vue'
import UpdateBirthday from '@/views/user-profile/components/update-birthday.vue'
import UpdatePhoto from '@/views/user-profile/components/update-photo.vue'
export default {
  name: 'UserProfile',
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdatePhoto
  },
  props: {},
  data() {
    return {
      // 个人信息
      userInfo: {},
      isUpdateNameShow: false,
      isUpdateGenderShow: false,
      isUpdateBirthdayShow: false,
      isUpdatePhotoShow: false,
      img: null // 预览的图片
    }
  },
  computed: {},
  watch: {},
  created() {
    this.loadUserProfile()
  },
  mounted() {},
  methods: {
    async loadUserProfile() {
      try {
        const { data: res } = await getUserProfile()
        console.log('获取用户的个人资料', res)
        this.userInfo = res.data
      } catch (error) {
        this.$toast('获取数据失败')
      }
    },
    // 当文件改变时触发
    onFileChange() {
      // 获取文件对象
      const file = this.$refs.file.files[0]
      // 基于文件对象获取blob数据
      const data = window.URL.createObjectURL(file)
      this.img = data
      console.log(data)
      this.isUpdatePhotoShow = true
      // <input type="file" hidden ref="file" @change=”onFileChange” /> 如果两次选择了同一张图片  则第二次不会触发change事件。
      // 解决办法：每次使用完毕 把它的value清空
      console.log('图片所在位置的绝对路径：', this.$refs.file.value)
      this.$refs.file.value = ''
    },
    updatePhoto(val) {
      this.userInfo.photo = val
    }
  }
}
</script>

<style scoped lang="less">
.user-profile {
  .avatar {
    width: 60px;
    height: 60px;
  }
  .van-popup {
    background-color: #f5f7f9;
  }
}
</style>
