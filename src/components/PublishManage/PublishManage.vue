<template>
  <div class="publish-manage">
    <div class="options">
      <el-button type="primary"
                 @click="handleAddVisable(true)">新增发布</el-button>

    </div>
    <div class="wrap"
         v-loading="tableLoading">
      <div class="table">
        <el-table :data="publishList"
                  style="width: 100%"
                  :row-class-name="tableRowClassName">
          <el-table-column prop="title"
                           label="标题"
                           width="180">
          </el-table-column>
          <el-table-column prop="description"
                           label="描述"
                           width="180">
          </el-table-column>
          <el-table-column prop="reward"
                           label="赏金">
          </el-table-column>
        </el-table>

      </div>
      <div style="text-align: right; padding: 10px 0 10px 10px">
        <el-pagination style="padding: 0"
                       background
                       layout="prev, pager, next"
                       :current-page="pageNum"
                       :total="total"
                       :page-size="pageSize"
                       @current-change="handleCurrentChange">
        </el-pagination>
      </div>

    </div>

    <el-dialog title="新增发布"
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
      total: 0,
      tableLoading: false,
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
      this.tableLoading = true
      publishListAPI({ pageNum: this.pageNum, pageSize: this.pageSize }).then(res => {
        if (res.description === 'success') {
          this.publishList = res.data.list
          this.total = res.data.total
          this.tableLoading = false
        }
      })
    },
    //分页
    handleCurrentChange (page) {
      this.pageNum = page
      this.getPublishList()
    },
    // 新增发布
    handleAdd () {
      this.$refs.addData.validate((valid) => {
        if (valid) {
          this.addLoading = true
          console.log(this.addData.imageUrl)
          publishCreateAPI({ ...this.addData, imageUrl: JSON.stringify(this.addData.imageUrl) }).then((res) => {
            this.addLoading = false
            if (res.description === 'success') {
              Message.success({ message: '操作成功！' })
              this.handleAddVisable(false)
              this.getPublishList()
            } else {
              Message.success({ message: `${res.description}！` })
            }
          })
        }
      });
    },
    // 获取图片信息
    getImageFile (file, fileList) {
      this.getImageBase64(file.raw).then(async (res) => {
        const imgSrc = await this.compressImg(res, 1000, 1000)
        this.addData.imageUrl.push(imgSrc);
      });
      // 大于1张隐藏
      this.hideUploadEdit = fileList.length >= 1;
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
    tableRowClassName ({ rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row'
      } else if (rowIndex === 3) {
        return 'success-row'
      }
      return ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >
.publish-manage {
  width: 100%;
  height: 100%;
}
.options {
  margin-bottom: 20px;
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
.el-table .warning-row {
  background: oldlace;
}
.el-table .success-row {
  background: #f0f9eb;
}
</style>
