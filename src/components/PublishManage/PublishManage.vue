<template>
  <div class="publish-manage">
    <div class="options">
      <el-button type="primary"
                 @click="handleAddVisable(true)">发布信息</el-button>

    </div>
    <div class="wrap">
      <div class="table">
        <el-table :data="publishList"
                  style="width: 100%"
                  :row-class-name="tableRowClassName">
          <el-table-column prop="date"
                           label="日期"
                           width="180">
          </el-table-column>
          <el-table-column prop="name"
                           label="姓名"
                           width="180">
          </el-table-column>
          <el-table-column prop="address"
                           label="地址">
          </el-table-column>
        </el-table>

      </div>

    </div>

    <el-dialog title="发布信息"
               :visible.sync="addVisable">
      <el-form ref="addData"
               :model="addData"
               :rules="rules"
               label-width="100px">
        <el-form-item label="标题"
                      prop="title"
                      width="300px">
          <el-input v-model="addData.title"
                    placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="描述"
                      prop="description"
                      width="300px">
          <el-input type="textarea"
                    v-model="addData.description"
                    placeholder="请输入描述信息"></el-input>
        </el-form-item>
        <el-form-item label="赏金"
                      prop="reward"
                      width="300px">
          <el-input v-model.number="addData.reward"
                    placeholder="请输入赏金"></el-input>
        </el-form-item>
        <el-form-item label="上传图片"
                      prop="imageUrl">
          <el-upload :class="{ hide: hideUploadEdit }"
                     action=""
                     :on-change="getImageFile"
                     :on-remove="handlePicRemove"
                     :on-preview="handlePicPreview"
                     :limit="5"
                     list-type="picture-card"
                     :auto-upload="false">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%"
                 :src="dialogImageUrl"
                 alt="" />
          </el-dialog>

        </el-form-item>
      </el-form>

      <span slot="footer"
            class="dialog-footer">
        <el-button @click="addVisable = false">取 消</el-button>
        <el-button type="primary"
                   @click="handleAdd"
                   :loading="addLoading">确 定</el-button>
      </span>

    </el-dialog>

  </div>

</template>
<script>

import { publishListAPI, publishCreateAPI } from '@/services/services'
import { Message } from 'element-ui'

export default {

  data () {
    return {
      addData: {
        title: '',
        description: '',
        reward: '',
        imageUrl: []
      },
      dialogImageUrl: "",
      dialogVisible: false,
      hideUploadEdit: false, // 是否隐藏上传按钮
      addVisable: false,
      addLoading: false,
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入描述', trigger: 'blur' }
        ],
        reward: [
          { required: true, message: '请输入赏金', trigger: 'blur' },
          { type: 'number', message: '赏金必须为数字值' }
        ]
      },
      publishList: [],
      pageNum: 1,
      pageSize: 10,
    }
  },

  mounted () {
    this.getPublishList()

  },

  methods: {
    handleAddVisable (visible) {
      this.addVisable = visible
    },
    //获取发布信息列表
    getPublishList () {
      publishListAPI({ pageNum: this.pageNum, pageSize: this.pageSize }).then(res => {
        console.log(res)
      })

    },
    handleAdd () {
      this.$refs.addData.validate((valid) => {
        if (valid) {
          this.addLoading = true
          publishCreateAPI({ ...this.addData, imageUrl: JSON.stringify(this.addData.imageUrl) }).then((res) => {
            if (res.description === 'success') {
              Message.success({ message: '操作成功！' })
              this.handleAddVisable(false)
              this.addLoading = false
            } else {
              Message.success({ message: `${res.description}！` })
              this.addLoading = false
            }
          })
        }
      });
    },
    // 获取图片信息
    getImageFile (file, fileList) {
      this.getImageBase64(file.raw).then((res) => {
        console.log("res", res);
        this.addData.imageUrl.push(res);
      });
      // 大于1张隐藏
      this.hideUploadEdit = fileList.length >= 1;
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
    //删除
    handlePicRemove (file, fileList) {
      this.hideUploadEdit = fileList.length >= 1;
      this.getImageBase64(file.raw).then((res) => {
        this.addData.imageUrl.filter((item) => item !== res);
      });
      console.log(file, fileList)
      // this.imageUrl = "";
    },
    //预览
    handlePicPreview (file) {
      console.log("file", file);
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },



  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >
.publish-manage {
  width: 100%;
  height: 100%;
}
.martop {
  margin-top: 20px;
}
.imgwidth {
  width: 100px;
  height: 100px;
}
.image-slot {
  width: 100px;
  height: 100px;
}
.image-slot i {
  font-size: 100px;
}
.hide .el-upload--picture-card {
  display: none;
}
.el-textarea,
.el-input {
  width: 400px;
}
</style>
