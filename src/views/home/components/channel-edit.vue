<template>
  <div class="channel-edit">
    <!-- Cell单元格组件 -->
    <!-- :border="false"去掉边框 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button class="edit-btn" slot="default" type="danger" plain round size="mini" @click="isEdit = !isEdit">{{ isEdit ? '完成' : '编辑' }}</van-button>
    </van-cell>
    <!-- Grid宫格组件格子间距-->
    <van-grid class="my-grid" :gutter="10">
      <van-grid-item class="grid-item" v-for="(channel, index) in myChannels" :key="index" @click="onMyChannelClick(channel, index)">
        <!-- Grid宫格组件提供了Slots插槽，slot="icon" 自定义图片 -->
        <!-- !fixedChannels.includes(channel.id)不是固定频道时为true -->
        <van-icon v-show="isEdit && !fixedChannels.includes(channel.id)" class="" slot="icon" name="clear"></van-icon>
        <!-- Grid宫格组件提供了Slots插槽，slot="text" 自定义文字 -->
        <span class="text" :class="{ active: index === activeIndex }" slot="text">{{ channel.name }}</span>
      </van-grid-item>
    </van-grid>
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <van-grid class="recommend-grid" :gutter="10">
      <van-grid-item class="grid-item" icon="plus" v-for="channel in recommendChannels" :key="channel.id" :text="channel.name" @click="addChannel(channel)" />
    </van-grid>
  </div>
</template>

<script>
import { getAllChannels, addUserChannel, deleteUserChannel } from '@/api/channel.js'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage.js'
export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    activeIndex: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      // 所有频道数据
      allChannels: [],
      isEdit: false,
      // 固定频道Id数组，不允许删除
      fixedChannels: [0]
    }
  },
  computed: {
    ...mapState(['user']),
    // 方式一：
    // recommendChannels() {
    //   const recoChannels = []
    //   this.allChannels.forEach((channel) => {
    //     // find遍历数组，找到满足条件的元素项
    //     const ret = this.myChannels.find((mychannel) => {
    //       return mychannel.id === channel.id
    //     })
    //     // 如果我的频道中不包括该频道，则放到推荐频道中
    //     if (!ret) {
    //       recoChannels.push(channel)
    //     }
    //   })
    //   return recoChannels
    // }
    // 方式二：
    recommendChannels() {
      // 数组的filter方法： 遍历数组，把符合条件的元素存储到新数组中 并返回新数组
      return this.allChannels.filter((channel) => {
        // 数组的find方法：遍历数组，把符合条件的第一个元素返回
        return !this.myChannels.find((mychannel) => {
          return mychannel.id === channel.id
        })
      })
    }
  },
  watch: {},
  created() {
    this.loadAllChannels()
  },
  mounted() {},
  methods: {
    async loadAllChannels() {
      try {
        const { data: res } = await getAllChannels()
        console.log('获取所有频道数据', res)
        this.allChannels = res.data.channels
      } catch (error) {
        this.$toast('获取所有频道数据失败', error)
      }
    },
    async addChannel(channel) {
      this.$emit('add-my-channel', channel)
      // 数据持久化处理
      if (this.user) {
        // 已登录，把数据请求接口放到线上
        try {
          await addUserChannel({
            id: channel.id,
            seq: this.myChannels.length
          })
        } catch (error) {
          this.$toast('保存失败，请稍后重试')
        }
      } else {
        // 未登录，把数据存储到本地
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },
    onMyChannelClick(channel, index) {
      // this.isEdit为true  编辑状态，则执行删除频道
      // this.isEdit为false  非编辑状态，则执行切换频道
      if (this.isEdit) {
        // 删除频道
        // 如果是固定频道 则不删除
        if (this.fixedChannels.includes(channel.id)) {
          return
        }
        // 如果被删除的频道索引小于等于被激活频道的索引
        if (index <= this.activeIndex) {
          // 激活频道的索引减1
          this.$emit('update-active', this.activeIndex - 1, true)
        }
        // 参数1: 要删除的元素的开始索引(包括开始索引)
        // 参数2: 删除的个数。 如果不指定删除的个数，则从参数1开始（包括参数1）删除到最后
        // this.myChannels.splice(index, 1)
        this.$emit('delete-my-channel', index)
        // 处理持久化
        this.deleteChannel(channel)
      } else {
        // 切换频道 改变首页中的active
        this.$emit('update-active', index, false)
      }
    },
    async deleteChannel(channel) {
      if (this.user) {
        try {
          // 已登录，则将数据更新到线上
          await deleteUserChannel(channel.id)
        } catch (error) {
          this.$toast('操作失败，请稍后重试')
        }
      } else {
        // 未登录，则将数据存储到本地
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    }
  }
}
</script>
<style scoped lang="less">
.channel-edit {
  padding: 85px 0;
  .title-text {
    font-size: 32px;
    color: #333;
  }
  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  /deep/.grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }
      .active {
        color: red;
      }
    }
  }
  /deep/.recommend-grid {
    .grid-item {
      .van-grid-item__content {
        display: flex;
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
      }
    }
  }
  /deep/.my-grid {
    .grid-item {
      .van-grid-item__content {
        .van-grid-item__icon-wrapper {
          position: unset;
          .van-icon-clear {
            position: absolute;
            top: -10px;
            right: -10px;
            font-size: 30px;
            color: #cacaca;
            z-index: 2;
          }
        }
      }
    }
  }
}
</style>
