<template>
  <div class="audit-manage">
    <div class="audit-manage-options">
      <span>发布状态： </span>
      <el-select v-model="auditStatus"
                 placeholder="请选择"
                 clearable
                 @change="selectChange">
        <el-option v-for="item in auditStatusOptions"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value">
        </el-option>
      </el-select>
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
              <el-tooltip class="item"
                          effect="dark"
                          :content="scope.row.auditRemark"
                          placement="top-start"
                          v-if="scope.row.auditStatus === 3">
                <span>审核不通过</span>
              </el-tooltip>
              <span v-else>{{scope.row.auditStatus === 1 ? '待审核':(scope.row.auditStatus === 2 ?  '审核通过' : '')}}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right"
                           label="操作">
            <template slot-scope="scope"
                      v-if="scope.row.auditStatus === 1">
              <el-button @click="getPublishDetail(scope.row.id)"
                         type="text"
                         size="small">审核</el-button>

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

    <el-dialog title="审核"
               :visible.sync="detailVisable"
               width="60%"
               class="detail-dialog"
               :destroy-on-close="true">
      <div class="detail-content"
           v-loading="detailLoading">
        <div class="first">
          <div class="avatar">
            <el-avatar :size="60"
                       :src="detailData.profilePhoto"></el-avatar>
          </div>
          <div class="user">
            <div class="credit"> <span>{{ detailData.nickName}}</span><span>信誉等级{{detailData.creditLevel }}</span></div>
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
      <div class="detail-footer">
        <el-button type="primary"
                   :loading="auditPassLoading"
                   @click="audit(2,detailData.id)">通过</el-button>
        <el-button type="danger"
                   @click="audit(3,detailData.id)">不通过</el-button>
      </div>
      <el-dialog width="40%"
                 title="审核不通过"
                 :visible.sync="auditFailedVisible"
                 append-to-body>
        <el-form :model="form"
                 :rules="rules"
                 ref="form"
                 label-width="60px"
                 class="demo-ruleForm">
          <el-form-item label="备注"
                        prop="auditRemark">
            <el-input v-model="form.auditRemark"
                      type="textarea"
                      :rows="4"></el-input>
          </el-form-item>
          <div class="audit-footer">
            <el-button type="primary"
                       @click="auditFiled"
                       :loading="auditFailedLoading"> 确定</el-button>
            <el-button type="default"
                       @click="auditFailedVisible = false"> 取消</el-button>
          </div>
        </el-form>
      </el-dialog>

    </el-dialog>

  </div>
</template>
<script>

import { publishCenterAPI, auditAPI, publishDetailAPI } from '@/services/services'
import moment from 'moment'
import { Message } from 'element-ui'


export default {
  data () {
    return {
      tableLoading: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      publishList: [],
      detailData: {

      },
      detailVisable: false,
      detailLoading: false,
      auditPassLoading: false,
      auditFailedLoading: false,
      auditFailedVisible: false,
      form: {
        auditRemark: ''

      },
      rules: {
        auditRemark: [{ required: true, message: '请输入备注', trigger: 'blur' }]
      },
      currentPublishId: {},
      auditStatusOptions: [
        {
          label: '待审核',
          value: 1
        },
        {
          label: '审核通过',
          value: 2
        },
        {
          label: '审核不通过',
          value: 3
        }
      ]
      ,
      auditStatus: 1,



    }
  },
  mounted () {
    this.getPublishList()

  },

  methods: {
    moment,
    selectChange (value) {
      this.auditStatus = value
      this.getPublishList()
    },
    getPublishList () {
      this.tableLoading = true
      const { pageNum, pageSize, auditStatus } = this
      let params = {
        pageNum,
        pageSize,
        auditStatus,
      }
      publishCenterAPI(params).then(res => {
        this.tableLoading = false
        if (res.description === 'success') {
          this.publishList = res.data.list
          this.total = res.data.total

        }
      })
    },
    //分页
    handleCurrentChange (page) {
      this.pageNum = page
      this.getPublishList()
    },
    // 获取发布详情
    getPublishDetail (id) {
      this.detailVisable = true
      this.detailLoading = true
      publishDetailAPI({ publishInfoId: id }).then((res) => {
        this.detailLoading = false
        if (res.description === 'success') {
          this.detailData = { ...res.data, createTime: moment(res.data.createTime).format('YYYY-MM-DD hh:mm:ss') }

          if (res.data.creditLevel < 60) {
            this.detailData.creditLevel = '较差'
          }
          if (res.data.creditLevel >= 60 && res.data.creditLevel < 70) {
            this.detailData.creditLevel = '中等'
          }
          if (res.data.creditLevel >= 70 && res.data.creditLevel < 80) {
            this.detailData.creditLevel = '良好'
          }
          if (res.data.creditLevel >= 80 && res.data.creditLevel < 90) {
            this.detailData.creditLevel = '优秀'
          }
          if (res.data.creditLevel >= 90 && res.data.creditLevel < 100) {
            this.detailData.creditLevel = '极好'
          }
        }
      })
    },
    // 审核
    audit (auditStatus, publishInfoId) {
      if (auditStatus === 2) { //审核通过
        this.auditPassLoading = true
        auditAPI({ publishInfoId, auditStatus }).then(res => {
          this.auditPassLoading = false
          if (res.description === 'success') {
            Message.success({ message: '操作成功' })
            this.getPublishList()
            this.detailVisable = false
          } else {
            Message.error({ message: res.description })
          }

        })

      } else {
        this.auditFailedVisible = true
        this.currentPublishId = publishInfoId
      }
    },
    auditFiled () {
      this.auditFailedLoading = true
      this.$refs.form.validate((valid) => {
        auditAPI({ publishInfoId: this.currentPublishId, auditStatus: 3, auditRemark: this.form.auditRemark }).then(res => {
          this.auditFailedLoading = false
          if (res.description === 'success') {
            this.auditFailedVisible = false
            this.detailVisable = false
            Message.success({ message: '操作成功！' })
            this.getPublishList()
          } else {
            Message.error({ message: res.description })
          }

        })
      })
    },
    tableRowClassName ({ rowIndex }) {
      if (rowIndex % 2 === 0) {
        return 'warning-row'
      } else {
        return 'success-row'
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >
.audit-manage {
  width: calc(100% - 30px);
  height: calc(100% - 30px);
  background: #fff;
  padding: 15px;
}
.audit-manage-options {
  padding-bottom: 15px;
}
.audit-manage-options span {
  margin-right: 5px;
}
.detail-dialog .el-dialog__body {
  padding: 5px 20px 20px 20px !important;
  height: 500px;
}
.detail-content {
  height: calc(100% - 60px);
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
.detail-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 20px;
}
.audit-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
