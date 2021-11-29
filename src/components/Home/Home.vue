<template>
  <div class="home">
    <div class="top">
      <div class="left"> Ant Design Pro</div>
      <div class="right">
        <div class=right-item>
          <el-avatar size="small"
                     src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>

        </div>
        <div class="right-item">
          <router-link to="/home/personal/settings"> <span>欢迎您, {{ userInfo.nickName }}</span></router-link>
        </div>
        <div class="right-item">
          <router-link to="/login"> <i class="el-icon-switch-button"></i></router-link>
        </div>
      </div>
    </div>
    <div class="wrap">
      <div class="left">
        <el-menu default-active="1"
                 class="el-menu-vertical-demo"
                 @open="handleOpen"
                 @close="handleClose">
          <el-menu-item index="1">
            <i class="el-icon-menu"></i>
            <span slot="title">导航二</span>
          </el-menu-item>
          <el-menu-item index="2">
            <i class="el-icon-menu"></i>
            <span slot="title">投诉管理</span>
          </el-menu-item>
          <el-menu-item index="3">
            <i class="el-icon-menu"></i>
            <span slot="title">订单管理</span>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="right">
        <keep-alive>
          <router-view msg="abc"></router-view>
        </keep-alive>
      </div>

    </div>

  </div>
</template>
<script>
export default {
  data () {
    return {
      menuList: [],
      userInfo: JSON.parse(sessionStorage.getItem('userInfo'))

    }
  },
  methods: {
    // goSettings () {

    // }
  }


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >
.home {
  width: 100%;
  height: 100%;
}

.wrap {
  display: flex;
  height: calc(100% - 60px);
}
.wrap .left {
  width: 220px;
  height: 100%;
  background: #fff;
  box-shadow: 2px 0 6px rgb(0 21 41 / 35%);
}
.wrap .right {
  width: calc(100% - 220px);
  height: 100%;
  background: #f0f2f5;
  padding: 20px;
}
.top {
  height: 60px;
  background: #001529;
  color: #fff;
  display: flex;
  justify-content: space-between;
}
.top .left {
  width: 220px;
  font-size: 20px;
  line-height: 60px;
  font-weight: bolder;
  padding-left: 20px;
}
.right {
  padding-right: 20px;
  display: flex;
  align-items: center;
}
.right-item {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  cursor: pointer;
}
.right-item span,
.right-item i {
  color: #fff;
}

>>> .el-menu {
  border-right: none;
}
</style>
