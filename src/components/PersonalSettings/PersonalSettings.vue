<template>
  <div class="personal-settings">
    <div class="wrap">
      <div class="title">
        <span>个人设置</span>
      </div>
      <div class="content">
        <div class="left">
          <span :class="{'active' : currenTab === 0}"
                @click="handleClickTab(0)">基本信息</span>
          <span :class="{'active' : currenTab===1}"
                @click="handleClickTab(1)">修改密码</span>
          <span :class="{'active' : currenTab===2}"
                @click="handleClickTab(2)">
            账户中心
          </span>
        </div>
        <div class="right"
             v-if="currenTab=== 0">
          <BasicInfoManage />
        </div>
        <div class="right"
             v-else-if="currenTab===1">
          <PasswordManage />
        </div>
        <div class="right"
             v-else>
          <WalletCenter />
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import PasswordManage from './PasswordManage'
import BasicInfoManage from './BasicInfoManage'
import WalletCenter from './WalletCenter'

export default {
  components: {
    PasswordManage,
    BasicInfoManage,
    WalletCenter
  },
  data () {
    return {
      currenTab: 0

    }
  },

  methods: {
    handleClickTab (type) {
      this.currenTab = type

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >
.personal-settings {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: auto;
}
.wrap {
  width: 800px;
  height: 100%;
  background: #fff;
  border: 1px solid #e8e8e8;
}
.title {
  border: 1px solid #e8e8e8;
  border-top: none;
  padding: 20px;
  font-size: 16px;
  font-weight: 500;
}
.content {
  display: flex;
  height: calc(100% - 64px);
}
.content .left {
  width: 150px;
  border-right: 1px solid #e8e8e8;
  padding: 10px 20px;
}
.left span {
  display: block;
  text-align: center;
  padding: 12px;
  /* background: rgba(0, 128, 255, 0.1);
  color: #0080ff; */
  border-radius: 5px;
  margin-bottom: 10px;
  cursor: pointer;
}
.left span:hover {
  background: rgba(0, 128, 255, 0.1);
  color: #0080ff;
}
.left span.active {
  background: rgba(0, 128, 255, 0.1);
  color: #0080ff;
}
.content .right {
  padding: 10px 30px;
  width: calc(100% - 60px);
  overflow-y: auto;
}
</style>
