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
          <el-table-column prop="index"
                           label="序号"
                           type="index">
          </el-table-column>

          <el-table-column prop="title"
                           label="标题">
          </el-table-column>
          <el-table-column prop="description"
                           label="描述">
          </el-table-column>
          <el-table-column prop="imageUrl"
                           label="图片"
                           width="180">
            <template slot-scope="scope">
              <el-image style="width: 100px; height: 100px"
                        :src="scope.row.imageUrl[0]"
                        fit="cover"></el-image>
            </template>

          </el-table-column>
          <el-table-column prop="reward"
                           label="赏金">
            <template slot-scope="scope">
              <span>{{ scope.row.reward}}元</span>

            </template>
          </el-table-column>
          <el-table-column prop="auditStatus"
                           label="状态">
            <template slot-scope="scope">
              <span>{{ scope.row.auditStatus === 1 ? '待审核' : (scope.row.auditStatus === 2 ?  '审核通过' : '审核不通过') }}</span>

            </template>
          </el-table-column>
          <el-table-column fixed="right"
                           label="操作">
            <template slot-scope="scope">
              <el-button @click="getPublishDetail(scope.row.id)"
                         type="text"
                         size="small">查看</el-button>
              <el-button type="text"
                         size="small">编辑</el-button>
            </template>
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
          <el-input v-model="addData.reward"
                    placeholder="请输入赏金"></el-input>
        </el-form-item>
        <el-form-item label="上传图片"
                      prop="imageUrl">
          <el-upload action=""
                     :on-change="getImageFile"
                     :on-remove="handlePicRemove"
                     :on-preview="handlePicPreview"
                     :on-exceed="handleExceed"
                     :on-success="onSuccess"
                     :limit="5"
                     :file-list="fileList"
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

    <el-dialog title="详情"
               :visible.sync="detailVisable"
               width="60%">
      <div class="detail-content"
           v-loading="detailLoading">
        <div class="first">
          <div class="avatar">
            <el-avatar :size="60"
                       :src="detailData.profilePhoto"></el-avatar>
          </div>
          <div class="user">
            <div class="credit"> <span>{{ detailData.nickName}}</span><span>信誉度{{detailData.creditLevel }}</span></div>
            <div class="create"><span>{{ detailData.createTime}}</span></div>
          </div>
        </div>
        <div class="second">
          ￥{{detailData.reward}}元
        </div>
        <div class="thrid">{{ detailData.title }}</div>
        <div class="forth">
          {{detailData.description}}

        </div>
        <div class="fifth">
          <el-image v-for="item in detailData.imageUrl"
                    :key="item"
                    :src="item"></el-image>

        </div>
      </div>

    </el-dialog>
  </div>
</template>
<script>

import { publishListAPI, publishCreateAPI, publishDetailAPI } from '@/services/services'
import { Message } from 'element-ui'
import moment from 'moment'

export default {

  data () {
    var validateReward = (rule, value, callback) => {
      if (value) {
        let reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/
        if (!reg.test(value)) {
          callback(new Error('金额必须为正整数且最多包含两位小数'))
        } else {
          callback()
        }
      }
      callback()
    }

    return {
      addData: {
        title: '',
        description: '',
        reward: '',
        imageUrl: []
      },
      fileList: [],
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
          { validator: validateReward, trigger: 'blur' }
        ]
      },
      publishList: [],
      pageNum: 1,
      pageSize: 5,
      total: 0,
      tableLoading: false,
      detailData: {

      },
      detailVisable: false,
      detailLoading: false
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

    //获取发布详情
    getPublishDetail (id) {
      this.detailVisable = true
      this.detailLoading = true
      publishDetailAPI({ publishInfoId: id }).then((res) => {
        this.detailLoading = false
        if (res.description === 'success') {
          const level = {
            1: '较差',
            2: '中等',
            3: '良好',
            4: '优秀',
            5: '极好'
          }
          this.detailData = { ...res.data, createTime: moment(res.data.createTime).format('YYYY-MM-DD hh:mm:ss'), creditLevel: level[res.data.creditLevel] }

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
              Message.error({ message: `${res.description}！` })
            }
          })
        }
      });
    },
    // 获取图片信息
    getImageFile (file, fileList) {
      if (this.addData.imageUrl.length < 5) {
        this.getImageBase64(file.raw).then(async (res) => {
          const imgSrc = await this.compressImg(res, 1000, 1000)
          this.addData.imageUrl.push(imgSrc);
          // this.fileList.push({ name: file.name, url: imgSrc })
          // console.log(this.fileList.length)

        });
      }
    },
    onSuccess (res, file, fileList) {
      console.log(res)
      console.log(file)
      console.log(fileList)
      // // 成功实现的版本1
      // this.imgList.push(file);
      // // 成功实现的版本2
      // this.imgList = fileList;
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
      this.getImageBase64(file.raw).then((res) => {
        this.addData.imageUrl.filter((item) => item !== res);
        this.fileList.filter((item) => item.imgSrc !== res);
      });
    },
    //预览
    handlePicPreview (file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleExceed () {
      Message.error({
        message: '最多上传5张图片！'
      });
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
.wrap {
  background: #fff;
  padding: 20px;
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
.detail-content {
  width: 100%;
  height: 100%;
}
>>> .el-dialog__body {
  padding: 5px 20px 20px 20px !important;
  max-height: 500px;
  overflow-y: auto;
}
.detail-content .first {
  display: flex;
  align-items: center;
}
.detail-content .first .user {
  margin-left: 15px;
}
.detail-content .first .user .credit {
  padding-bottom: 7px;
}
.detail-content .first .user .credit span:nth-child(1) {
  color: #000;
  font-weight: bolder;
  padding-right: 5px;
  border-right: 1px solid #606266;
}
.detail-content .first .user .credit span:nth-child(2) {
  color: #409eff;
  padding-left: 5px;
  font-size: 13px;
}
.detail-content .first .user .create {
  font-size: 12px;
}
.detail-content .second {
  padding: 20px 0;
  color: red;
  font-size: 20px;
  font-weight: bold;
}
.detail-content .thrid {
  font-size: 16px;
  color: #000;
  line-height: 40px;
}
.detail-content .forth {
  font-size: 13px;
  padding-bottom: 15px;
}
</style>
