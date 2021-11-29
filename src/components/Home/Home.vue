<template>
  <div class="home">
    <div class="top">
      <div class="left">这是一个测试系统</div>
      <div class="right">
        <div class=right-item>
          <el-avatar size="small"
                     src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>

        </div>
        <div class="right-item">
          <el-tooltip class="item"
                      content="个人设置"
                      placement="bottom">
            <router-link to="/home/personal/settings"> <span>欢迎您, {{userInfo ? userInfo.nickName : "admin"}}</span></router-link>
          </el-tooltip>
        </div>
        <div class="right-item">
          <el-tooltip class="item"
                      effect="dark"
                      content="退出登录"
                      placement="bottom">
            <router-link to="/login"> <i class="el-icon-switch-button"></i></router-link>
          </el-tooltip>

        </div>
      </div>
    </div>
    <div class="wrap">
      <div class="left">
        <el-menu :default-active="currentActive"
                 class="el-menu-vertical-demo"
                 @open="handleOpen"
                 @close="handleClose">

          <el-menu-item :index="item.key"
                        v-for="item in menuList"
                        :key="item.key">
            <i class="el-icon-menu"></i>
            <router-link :to="item.url">
              <span>{{item.title}}</span>
            </router-link>
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
      menuList: [
        {
          title: '发布管理',
          url: '/home/publish/manage',
          key: '1',

        },
        {
          title: '投诉管理',
          url: '/home/publish/manage',
          key: '2',

        },
        {
          title: '订单管理',
          url: '/home/publish/manage',
          key: '3',

        }
      ],
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')),
      currentActive: '1',

    }
  },
  methods: {

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
  padding-top: 15px;
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
  font-size: 14px;
}
.is-active a.router-link-exact-active,
.is-active a.router-link-active {
  color: #409eff !important;
}
a {
  text-decoration: none;
  color: #000;
}
.router-link-active {
  text-decoration: none;
  color: #000;
}
.el-menu-item {
  line-height: unset !important;
  display: flex;
  align-items: center;
}

>>> .el-menu {
  border-right: none;
}
</style>
