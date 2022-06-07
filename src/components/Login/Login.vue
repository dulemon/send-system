<template>
  <div class="login">

    <div class="wrap">

      <div class="form">
        <div class="title">二手交易平台</div>
        <div class="content">
          <el-form :model="loginData"
                   ref="loginData"
                   :rules="rules">
            <el-form-item prop="emailAddress">
              <el-input v-model="loginData.emailAddress"
                        prefix-icon="el-icon-user"
                        placeholder="请输入账号"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="loginData.password"
                        prefix-icon="el-icon-unlock"
                        placeholder="请输入密码"
                        show-password></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div>
          <!-- <router-link to="/home"> -->
          <el-button type="primary"
                     class="submit"
                     @click="handleLogin">登录</el-button>
          <!-- </router-link> -->
        </div>
        <div class="foot">
          <span>还没账号？</span>
          <router-link to="/register"><span class="text">去注册 ></span></router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import { loginAPI } from '@/services/services'
import { Message } from 'element-ui'

export default {
  data () {
    return {
      loginData: {
        emailAddress: '',
        password: ''
      },
      rules: {
        emailAddress: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
      },

    }
  },
  methods: {
    handleLogin () {
      this.$refs.loginData.validate((valid) => {
        if (valid) {
          loginAPI(this.loginData).then((res) => {
            if (res.description === 'success') {
              console.log(res.data)

              if (res.data[0].role === 3) {
                this.$router.push('/home/my/publish')
              } else {
                this.$router.push('/home/audit/manage')
              }

              sessionStorage.setItem('userInfo', JSON.stringify(res.data[0]))
            } else {
              Message.error({ message: `${res.description}！` })
            }
          })
        }
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >
.login {
  width: 100%;
  height: 100%;
  background-image: url("imgs/bg.png");
  background-color: #e8f2ff;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: -80px 80px;
  position: relative;
  display: flex;
  justify-content: center;
}
.wrap {
  width: 40%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.form {
  padding: 40px;
  box-shadow: -8px 8px 8px rgb(0 21 41 / 8%);
  background: #fff;
  width: 380px;
  position: relative;
  left: 280px;
  bottom: 70px;
}
.title {
  padding: 20px 20px 40px 0px;
  color: #333;
  /* font-weight: bold; */
  font-size: 30px;
  text-align: center;
}
.content {
  padding-bottom: 20px;
}
.submit {
  width: 100%;
  height: 50px;
}
.foot {
  padding-top: 20px;
  text-align: right;
  font-size: 14px;
  cursor: pointer;
}
.text {
  color: #409eff;
  margin-left: 10px;
}
>>> .el-input__icon {
  font-size: 18px;
}
>>> .el-input__inner {
  height: 45px;
}
</style>
