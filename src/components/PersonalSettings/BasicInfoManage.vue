<template>
  <div class="basicinfo-manage">
    <div class="left">
      <el-form label-width="100px"
               :model="basicInfoData"
               ref="basicInfoData"
               class="demo-form-inline"
               label-position="left">
        <el-form-item label="昵称"
                      prop="nickName">
          <el-input v-model="basicInfoData.nickName"
                    placeholder="请输入昵称"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名"
                      prop="realName">
          <el-input v-model="basicInfoData.realName"
                    placeholder="请输入真实姓名"></el-input>
        </el-form-item>
        <el-form-item label="民族"
                      prop="nation">
          <el-input v-model="basicInfoData.nation"
                    placeholder="请输入民族"></el-input>
        </el-form-item>
        <el-form-item label="性别"
                      prop="gender">
          <el-radio-group v-model="basicInfoData.gender">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="出生日期"
                      prop="birthDate">
          <el-date-picker v-model="basicInfoData.birthDate"
                          type="date"
                          placeholder="请选择日期"
                          style="width: '100% !important'">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="现住地址"
                      prop="currentAddress">
          <el-input v-model="basicInfoData.currentAddress"
                    placeholder="请输入现住地址"></el-input>
        </el-form-item>
        <el-form-item label="邮箱"
                      prop="emailAddress">
          <span>{{ basicInfoData.emailAddress}}</span>
        </el-form-item>
        <el-form-item label="加入时间"
                      prop="createTime">
          <span>{{ basicInfoData.createTime}}</span>
        </el-form-item>
        <el-form-item label="信誉等级"
                      prop="creditLevel">
          <span>{{ basicInfoData.creditLevel}}</span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     :loading="editLoading"
                     @click="onSubmit">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="right">
      <el-avatar :size="100"
                 :src="basicInfoData.profilePhoto"></el-avatar>
      <el-upload action=""
                 :on-change="getImageFile"
                 :before-upload="beforeAvatarUpload"
                 :auto-upload="false"
                 :show-file-list="false">
        <el-button type="primary"
                   class="editbtn">修改头像</el-button>
      </el-upload>

    </div>
  </div>
</template>
<script>

import { Message } from 'element-ui'
import moment from 'moment'
import { updateUserInfoAPI, getUserInfoAPI } from '@/services/services'


export default {

  data () {
    return {
      basicInfoData: {
      },
      editLoading: false

    }
  },
  mounted () {
    this.getUser()
  },

  methods: {
    // 获取用户个人信息
    getUser () {
      getUserInfoAPI().then(res => {
        if (res.description === 'success') {
          let userInfo = res.data
          const level = {
            1: '较差',
            2: '中等',
            3: '良好',
            4: '优秀',
            5: '极好'
          }
          this.basicInfoData = {
            nickName: userInfo.nickName,
            realName: userInfo.realName,
            gender: userInfo.gender,
            birthDate: userInfo.birthDate,
            currentAddress: userInfo.currentAddress,
            emailAddress: userInfo.emailAddress,
            createTime: moment(userInfo.createTime).format('YYYY-MM-DD hh:mm:ss'),
            profilePhoto: userInfo.profilePhoto,
            nation: userInfo.nation,
            creditLevel: level[userInfo.creditLevel]


          }
        }
      })
    },
    // 保存
    onSubmit () {
      this.$refs.basicInfoData.validate((valid) => {
        if (valid) {
          this.editLoading = true
          updateUserInfoAPI({
            ...this.basicInfoData, birthDate: this.basicInfoData.birthDate ? moment(this.basicInfoData.birthDate).format('YYYY-MM-DD') : null
          }).then((res) => {
            this.editLoading = false
            if (res.description === 'success') {
              Message.success({ message: '修改成功!' })
              this.getUser()
            } else {
              Message.error({ message: `修改失败！` })
              return false;
            }
          })
        }
      });
    },
    // 获取图片信息
    getImageFile (file, fileList) {
      this.getImageBase64(file.raw).then(async (res) => {
        const imgSrc = await this.compressImg(res, 1000, 1000)
        this.basicInfoData.profilePhoto = imgSrc;
      });
    },
    compressImg (img, mx, mh) {
      return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        const { width: originWidth, height: originHeight } = img
        let dataURL = ''
        // 最大尺寸限制
        const maxWidth = mx
        const maxHeight = mh
        // 目标尺寸
        let targetWidth = originWidth
        let targetHeight = originHeight
        if (originWidth > maxWidth || originHeight > maxHeight) {
          if (originWidth / originHeight > 1) {
            // 宽图片
            targetWidth = maxWidth
            targetHeight = Math.round(maxWidth * (originHeight / originWidth))
          } else {
            // 高图片
            targetHeight = maxHeight
            targetWidth = Math.round(maxHeight * (originWidth / originHeight))
          }
        }
        canvas.width = targetWidth
        canvas.height = targetHeight
        context.clearRect(0, 0, targetWidth, targetHeight)
        // 图片绘制
        context.drawImage(img, 0, 0, targetWidth, targetHeight)
        dataURL = canvas.toDataURL('image/jpeg') // 转换图片为dataURL
        resolve(dataURL)
      })
    },
    //转换成base64方法
    getImageBase64 (file) {
      return new Promise((resolve, reject) => {
        const img = new Image()
        const reader = new FileReader()
        reader.onload = function (e) {
          img.src = e.target.result
        }
        reader.onerror = function (e) {
          reject(e)
        }
        reader.readAsDataURL(file)
        img.onload = function () {
          resolve(img)
        }
        img.onerror = function (e) {
          reject(e)
        }
      })
    },
    beforeAvatarUpload (file) {
      const filetype = ['image/jpeg', 'image/png', 'image/jpg']
      const isJPG = filetype.includes(file.type);
      const isLt2M = file.size / 1024 / 1024 <= 1;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 1MB!');
      }
      return isJPG && isLt2M;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >
.basicinfo-manage {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.left {
  width: 70%;
}
.right {
  width: 20%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.editbtn {
  margin-top: 20px;
}
.el-input {
  width: 100% !important;
}
</style>
