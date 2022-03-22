<template>
  <div class="home">
    <div class="top">
      <div class="left">这是一个测试系统</div>
      <div class="right">
        <div class=right-item>
          <el-avatar size="small"
                     :src="userInfo.profilePhoto"></el-avatar>

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
        <el-menu :default-active="$route.path"
                 class="el-menu-vertical-demo">

          <el-menu-item :index="$route.path"
                        v-for="item in menuList"
                        :key="item.key">
            <router-link :to="item.url">
              <i :class="item.icon"></i>
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

import { getUserInfoAPI } from '@/services/services'

export default {
  data () {
    return {
      menuList: [],
      userInfo: {},
      // currentActive: '2',

    }
  },
  mounted () {

    // const pathName = window.location.hash.split('#')[1]
    // if (pathName === '/home/my/publish') {
    //   this.currentActive = '1'
    // }
    // if (pathName === '/home/publish/manage') {
    //   this.currentActive = '2'
    // }
    // if (pathName === '/home/order/manage') {
    //   this.currentActive = '3'
    // }
    // if (pathName === '/home/audit/manage') {
    //   this.currentActive = '4'
    // }
    // if (pathName === '/home/publish/manage') {
    //   this.currentActive = '5'
    // }
    // console.log(this.currentActive)
    this.getUser()
  },

  methods: {
    getUser () {
      getUserInfoAPI().then(res => {
        if (res.description === 'success') {
          this.userInfo = res.data
          if (this.userInfo.role === 3) {
            this.menuList = [
              {
                title: '我的发布',
                url: '/home/my/publish',
                key: '1',
                icon: 'el-icon-menu'

              },
              {
                title: '发布中心',
                url: '/home/publish/manage',
                key: '2',
                icon: 'el-icon-eleme'

              },
              {
                title: '订单管理',
                url: '/home/order/manage',
                key: '3',
                icon: 'el-icon-setting'
              }

            ]
            window.location.hash = '/home/my/publish'

          } else {
            this.menuList = [
              {
                title: '审核中心',
                url: '/home/audit/manage',
                key: '4',
                icon: 'el-icon-setting'

              },
              {
                title: '投诉管理',
                url: '/home/publish/manage',
                key: '5',
                icon: 'el-icon-document'

              },
            ]
            window.location.hash = '/home/audit/manage'
          }
        }
      })
    },

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
  height: calc(100% - 15px);
  overflow-y: auto;
  background: #fff;
  box-shadow: 2px 0 6px rgb(0 21 41 / 35%);
  padding-top: 15px;
}
.wrap .right {
  width: calc(100% - 220px);
  height: calc(100% - 40px);
  overflow-y: auto;
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

