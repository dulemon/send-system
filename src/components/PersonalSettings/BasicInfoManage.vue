<template>
  <div class="basicinfo-manage">
    <div class="left">
      <el-form label-width="100px"
               :model="basicInfoData"
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
        <el-form-item label="性别"
                      prop="gender">
          <el-radio-group v-model="basicInfoData.gender">
            <el-radio label="1">男</el-radio>
            <el-radio label="2">女</el-radio>
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
        <el-form-item>
          <el-button type="primary"
                     @click="onSubmit">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="right">
      <el-avatar :size="100"
                 :src="basicInfoData.imgUrl"></el-avatar>
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


export default {

  data () {
    return {
      basicInfoData: {
        nickName: '杜若',
        realName: '李文',
        gender: '1',
        birthDate: '2020-09-08',
        currentAddress: '西安市雁塔区',
        emailAddress: '1401675454@qq.com',
        createTime: '2021-11-29',
        imgUrl: ''

      },

    }
  },

  methods: {
    // 获取图片信息
    getImageFile (file, fileList) {
      this.getImageBase64(file.raw).then((res) => {

        this.basicInfoData.imgUrl = res;
        console.log(this.basicInfoData)
      });
    },
    //转换成base64方法
    getImageBase64 (file) {
      return new Promise(function (resolve, reject) {
        let newImagereader = new FileReader();
        let imgInfo = "";
        newImagereader.readAsDataURL(file);
        newImagereader.onload = function () {
          imgInfo = newImagereader.result;
        };
        newImagereader.onerror = function (error) {
          reject(error);
        };
        newImagereader.onloadend = function () {
          resolve(imgInfo);
        };
      });
    },
    beforeAvatarUpload (file) {
      const filetype = ['image/jpeg', 'image/png', 'image/jpg']
      const isJPG = filetype.includes(file.type);
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
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
  height: 100%;
  overflow: auto;
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
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
