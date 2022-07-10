<template>
  <div class="update-photo">
    <img class="img" :src="img" ref="img" alt="" />
    <div class="toolbar">
      <div class="cancel" @click="$emit('close')">取消</div>
      <div class="confirm" @click="onConfirm">完成</div>
    </div>
  </div>
</template>

<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { updateUserPhoto } from '@/api/user.js'
export default {
  name: 'UpdatePhoto',
  components: {},
  props: {
    img: {
      type: [String, Object],
      required: true
    }
  },
  data() {
    return {
      cropper: null
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    const image = this.$refs.img
    this.cropper = new Cropper(image, {
      // 如果将viewMode设置为0,则裁剪框可以扩展到画布外部，而1将会将裁剪框限制为画布的大小
      viewMode: 1,
      // 设置画布的拖动模式
      dragMode: 'move',
      // 裁剪框的长宽比例
      aspectRatio: 1,
      // 裁剪框自动撑满画布大小，并且它依然遵循aspectRatio的长宽比例设置
      autoCropArea: 1,
      // 裁剪框不可移动
      cropBoxMovable: false,
      // 裁剪框不可缩放
      cropBoxResizable: false,
      // 关掉背景
      background: false,
      // 画布是否可以移动
      movable: true
    })
  },
  methods: {
    onConfirm() {
      this.$toast.loading({
        message: '保存中...',
        // 禁止背景点击
        forbidClick: true,
        duration: 0
      })
      try {
        // 基于服务端的裁切，使用getData方法得到裁切的区域参数
        // console.log(this.cropper.getData())
        // 基于纯客户端的图片裁切，使用getCroppedCanvas方法得到裁切之后的图片对象
        this.cropper.getCroppedCanvas().toBlob(async (blob) => {
          console.log(blob)
          // 如果接口要求Content-Type是application/json，则传递普通JavaScript对象；如果接口要求content-Type是multipart/form-data，则必须传递FormData对象
          const formData = new FormData()
          formData.append('photo', blob)
          const { data: res } = await updateUserPhoto(formData)
          console.log('更换头像成功', res)
          // 关闭弹层
          this.$emit('close')
          // 更新视图
          this.$emit('update-photo', res.data.photo)
        })
        this.$toast.success('更新头像成功')
      } catch (error) {
        this.$toast.fail('更新头像失败')
      }
    }
  }
}
</script>

<style scoped lang='less'>
.update-photo {
  background-color: #000;
  height: 100%;
  .img {
    max-width: 100%;
  }
  .toolbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    .cancel,
    .confirm {
      width: 90px;
      height: 90px;
      font-size: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
    }
  }
}
</style>
