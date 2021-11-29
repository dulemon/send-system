<template>
  <div class="password-manage">
    <el-form :label-position="right"
             label-width="80px"
             :rules="rules"
             ref="updatePasswordData"
             :model="updatePasswordData">
      <el-form-item label="旧密码"
                    prop="oldPassword">
        <el-input v-model="updatePasswordData.oldPassword"
                  show-password></el-input>
      </el-form-item>
      <el-form-item label="新密码"
                    prop="newPassword">
        <el-input v-model="updatePasswordData.newPassword"
                  show-password></el-input>
      </el-form-item>
      <el-form-item label="确认密码"
                    prop="confirmPassword">
        <el-input v-model="updatePasswordData.confirmPassword"
                  show-password></el-input>
      </el-form-item>
      <div class="submit">
        <el-button type="primary"
                   @click="handleUpdate">确定</el-button>
      </div>
    </el-form>

  </div>
</template>
<script> 

import { updatePasswordAPI } from '@/services/services'
import { Message } from 'element-ui'


export default {
  data () {
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
    var validateConfrim = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入确认密码'))
      } else {
        let reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
        if (value !== this.updatePasswordData.newPassword) {
          callback(new Error('两次输入密码不一致'))
        }
        callback()
      }
    }
    return {
      updatePasswordData: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        oldPassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' },
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { validator: validatePassword, trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { validator: validateConfrim, trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    handleUpdate () {
      this.$refs.updatePasswordData.validate((valid) => {
        if (valid) {
          let params = this.updatePasswordData
          delete params.confirmPassword
          updatePasswordAPI(params).then((res) => {
            if (res.description === 'success') {
              Message.success({ message: '修改成功，请重新登录!' })
              this.$router.push('/login')
            } else {
              Message.success({ message: `修改失败！` })
              return false;
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
.password-manage {
  width: 80%;
  height: 100%;
  padding-top: 20px;
}
.submit {
  display: flex;
  justify-content: flex-end;
}
</style>
