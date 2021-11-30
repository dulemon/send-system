<template>
  <div class="register">
    <div class="form">
      <h2>账号注册</h2>
      <div class="content">
        <el-form :model="registerData"
                 :rules="rules"
                 ref="registerData">
          <el-form-item prop="emailAddress">
            <el-input v-model="registerData.emailAddress"
                      prefix-icon="el-icon-message"
                      placeholder="请输入邮箱"></el-input>

          </el-form-item>
          <el-form-item>
            <div class="form-item">
              <el-input v-model="registerData.authCode"
                        prefix-icon="el-icon-key"
                        placeholder="请输入验证码"></el-input>
              <el-button type="primary"
                         class="key-code"
                         :disabled="btnDisabled"
                         @click="handleGetCode">{{btnName}}</el-button>
            </div>
          </el-form-item>
          <el-form-item prop="telPhone">
            <el-input v-model="registerData.telPhone"
                      prefix-icon="el-icon-mobile"
                      placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="registerData.password"
                      prefix-icon="el-icon-unlock"
                      placeholder="请输入密码"
                      show-password></el-input>
          </el-form-item>
          <el-form-item prop="nickName">
            <el-input v-model="registerData.nickName"
                      prefix-icon="el-icon-user"
                      placeholder="请输入昵称"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-button type="primary"
                   class="submit"
                   @click="handleRegister">注册</el-button>
      </div>
      <div class="foot">
        <span>已有账号？</span>
        <router-link to="/login"><span class="text">立即登录 ></span></router-link>
      </div>
    </div>
  </div>
</template>
<script>

import { sendVerifyCodeAPI, registerAPI } from '@/services/services'
import { Message } from 'element-ui'


export default {
  data () {
    var validateEmail = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入邮箱'))
      } else {
        let reg = /^[A-Za-z0-9-._]+@[A-Za-z0-9-]+(.[A-Za-z0-9]+)*(.[A-Za-z]{2,6})$/
        if (!reg.test(value)) {
          callback(new Error('邮箱格式不正确'))
        } else {
          this.btnDisabled = false
          callback()
        }
      }
    }
    var validateTelphone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号'))
      } else {
        let reg = /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/
        if (!reg.test(value)) {
          callback(new Error('手机号格式不正确'))
        } else {
          callback()
        }
      }
    }
    var validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        let reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
        if (!reg.test(value)) {
          callback(new Error('密码至少为8位，且包含数字和字母'))
        }
        callback()
      }
    }
    var validateNickname = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入昵称'))
      }
      callback()
    }

    return {
      registerData: {
        emailAddress: '',
        authCode: '',
        telPhone: '',
        password: '',
        nickName: ''
      },
      rules: {
        emailAddress: [
          { validator: validateEmail, trigger: 'blur' }
        ],
        telPhone: [
          { validator: validateTelphone, trigger: 'blur' }
        ],
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ],
        nickName: [
          { validator: validateNickname, trigger: 'blur' }
        ]
      },
      btnName: '获取验证码',
      btnDisabled: true,
    }
  },
  methods: {
    handleGetCode () {
      if (this.btnName === '获取验证码') {
        sendVerifyCodeAPI({ emailAddress: this.registerData.emailAddress }).then((res) => {
          if (res.description === 'success') {
            Message.success({ message: '邮件发送成功！' })
          }
        })
        let time = 59
        let timeIntervale = setInterval(() => {
          if (!time) {
            clearInterval(timeIntervale)
            this.btnName = `获取验证码`
            this.btnDisabled = false
            return
          }
          time -= 1
          this.btnName = `重新获取(${time})s`
        }, 1000)
        this.btnDisabled = true
      }
    },
    handleRegister () {
      this.$refs.registerData.validate((valid) => {
        if (valid) {
          registerAPI(this.registerData).then((res) => {
            if (res.description === 'success') {
              Message.success({ message: '注册成功！' })
              this.$router.push('/login')
            } else {
              Message.error({ message: `注册失败,${res.description}！` })
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
.register {
  width: 100%;
  height: 100%;
  background-image: url("imgs/register.png");
  background-color: #e8f2ff;
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
}
.form {
  width: 400px;
  min-height: 389px;
  background: #fff;
  border-radius: 8px;
  padding: 26px 38px;
}
.content {
  padding-top: 40px;
}
.form-item {
  display: flex;
}
.submit {
  width: 100%;
  height: 50px;
  margin-top: 15px;
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
.key-code {
  margin-left: 20px;
  height: 40px;
}
</style>
