<template>
  <div class="order-manage">
    <el-tabs type="border-card"
             v-model="orderType"
             @tab-click="handleClick">
      <el-tab-pane name="1">
        <span slot="label"><i class="el-icon-date"></i> 我的发布</span>
        <div class="order-wrap"
             v-loading="loading">
          <div class="order-content"
               v-if="orderList.length > 0">
            <div class="order-content-item"
                 :key="item.id"
                 v-for="item in orderList">
              <div class="order-content-item-first">
                <div class="order-content-item-first-left">
                  <span>{{moment(item.creatTime).format('YYYY-MM-DD hh:mm:ss')}}</span>
                  <span>在线支付</span>
                </div>
                <div class="order-content-item-first-right">
                  <span>应付金额：</span>
                  <span>{{item.reward}}</span>
                  <span>元</span>
                </div>
              </div>
              <div class="order-content-item-second">
                <div class="order-content-item-second-left">
                  <el-image style="width: 100px; height: 100px"
                            :src="item.imageUrl[0]"
                            fit="cover"></el-image>
                  <div class="text">
                    <span @click="getPublishDetail(item.publishInfoId)">{{item.title}}</span>
                    <span>{{item.description}}</span>
                  </div>
                </div>
                <div class="order-content-item-second-right">
                  <div style="text-align:right">
                    <span v-if="item.orderStatus === 1">处理中</span>
                    <span v-else-if="item.orderStatus === 2">接单人已提交</span>
                    <span v-else-if="item.orderStatus === 3">交易已完成</span>
                    <span v-else>交易已取消</span>
                  </div>
                  <div style="text-align:right">
                    <el-button size="mini"
                               type="primary"
                               v-if="item.orderStatus === 2"
                               :loading="updateLoading && currentOrderId === item.orderId"
                               @click="updateStatus(item.orderId,3)">确认收货</el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="order-footer"
               v-if="total > 0">
            <el-pagination background
                           layout="prev, pager, next"
                           :current-page="pageNum"
                           :total="total"
                           :page-size="pageSize"
                           @current-change="handleCurrentChange">
            </el-pagination>
          </div>
          <div v-if="!loading && orderList.length === 0">
            <el-empty :image-size="200"></el-empty>
          </div>
        </div>

      </el-tab-pane>
      <el-tab-pane label="我已接单"
                   name="2">
        <span slot="label"><i class=" el-icon-reading"></i> 我已接单</span>
        <div class="order-wrap"
             v-loading="loading">
          <div class="order-content"
               v-if="orderList.length > 0">
            <div class="order-content-item"
                 :key="item.id"
                 v-for="item in orderList">
              <div class="order-content-item-first">
                <div class="order-content-item-first-left">
                  <span>{{moment(item.creatTime).format('YYYY-MM-DD hh:mm:ss')}}</span>
                  <span>在线支付</span>
                </div>
                <div class="order-content-item-first-right">
                  <span>应付金额：</span>
                  <span>{{item.reward}}</span>
                  <span>元</span>
                </div>
              </div>
              <div class="order-content-item-second">
                <div class="order-content-item-second-left">
                  <el-image style="width: 100px; height: 100px"
                            :src="item.imageUrl[0]"
                            fit="cover"></el-image>
                  <div class="text">
                    <span>{{item.title}}</span>
                    <span>{{item.description}}</span>
                  </div>
                </div>
                <div class="order-content-item-second-right">
                  <div style="text-align:right">
                    <span v-if="item.orderStatus === 1">处理中</span>
                    <span v-else-if="item.orderStatus === 2">已提交</span>
                    <span v-else-if="item.orderStatus === 3 && item.complaintStatus === 1">交易已完成</span>
                    <span v-else-if="item.orderStatus === 3 && item.complaintStatus === 2">已投诉,待审核</span>
                    <span v-else-if="item.orderStatus === 3 && item.complaintStatus === 3">投诉通过</span>
                    <span v-else-if="item.orderStatus === 3 && item.complaintStatus === 4">投诉未通过</span>
                    <span v-else-if="item.orderStatus === 4">交易已取消</span>

                  </div>

                  <div v-if="item.orderStatus === 1"
                       style="text-align:right">
                    <el-button size="mini"
                               type="primary"
                               :loading="updateLoading && currentOrderId === item.orderId "
                               @click="updateStatus(item.orderId, 2)">已完成</el-button>
                    <el-button size="mini"
                               type="primary"
                               :loading="cancelLoading && currentOrderId === item.orderId"
                               @click="updateStatus(item.orderId, 4)">取消订单</el-button>
                  </div>
                  <div v-else-if="item.orderStatus === 3 && item.complaintStatus === 1"
                       style="text-align:right">
                    <el-button size="mini"
                               type="primary"
                               @click="complaintOrder(item.orderId)">投诉</el-button>
                  </div>

                </div>
              </div>
            </div>
          </div>
          <div class="order-footer"
               v-if="total > 0">
            <el-pagination background
                           layout="prev, pager, next"
                           :current-page="pageNum"
                           :total="total"
                           :page-size="pageSize"
                           @current-change="handleCurrentChange">
            </el-pagination>
          </div>
          <div v-if="!loading && orderList.length === 0">
            <el-empty :image-size="200"></el-empty>
          </div>
        </div>

      </el-tab-pane>
    </el-tabs>
    <el-dialog title="详情"
               :visible.sync="detailVisable"
               width="60%"
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

    </el-dialog>
    <el-dialog width="40%"
               title="投诉"
               :visible.sync="complaintVisible"
               append-to-body>
      <el-form :model="complaint"
               :rules="rules"
               ref="complaint"
               label-width="60px"
               class="demo-ruleForm">
        <el-form-item label="备注"
                      prop="complaintRemark">
          <el-input v-model="complaint.complaintRemark"
                    type="textarea"
                    :rows="4"></el-input>
        </el-form-item>
        <div class="order-footer">
          <el-button type="primary"
                     @click="complaintConfirm"
                     :loading="complaintLoading"> 确定</el-button>
          <el-button type="default"
                     @click="complaintVisible = false"> 取消</el-button>
        </div>
      </el-form>
    </el-dialog>

  </div>
</template>
<script>

import { orderListAPI, publishDetailAPI, updateOrderStatus, complaintAPI } from '@/services/services'
import moment from 'moment'
import { Message } from 'element-ui'

export default {
  data () {
    return {
      orderType: '1',
      pageNum: 1,
      pageSize: 10,
      total: 0,
      loading: false,
      orderList: [],
      detailData: {

      },
      detailVisable: false,
      detailLoading: false,
      updateLoading: false,
      cancelLoading: false,
      currentOrderId: null,
      complaint: {
        complaintRemark: ''
      },
      rules: {
        complaintRemark: [{ required: true, message: '请输入备注', trigger: 'blur' }]
      },
      complaintVisible: false,
      complaintLoading: false


    }
  },
  mounted () {
    this.getOrderList()
  },

  methods: {
    moment,

    getOrderList () {
      const { orderType, pageNum, pageSize, } = this
      let params = { orderType: Number(orderType), pageNum, pageSize, }
      this.loading = true
      orderListAPI(params).then(res => {
        if (res.description === 'success') {
          this.orderList = res.data.list
          this.total = res.data.total
          this.loading = false
        }
      })
    },
    handleClick () {
      this.pageNum = 1
      this.total = 0
      this.orderList = []
      this.getOrderList()
    },
    handleCurrentChange (page) {
      this.pageNum = page;
      this.getOrderList()
    },
    //获取发布详情
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
    updateStatus (orderId, orderStatus) {
      if (orderStatus === 4) {
        this.cancelLoading = true
      } else {
        this.updateLoading = true
      }
      this.currentOrderId = orderId
      updateOrderStatus({ orderId, orderStatus }).then((res) => {
        this.updateLoading = false
        this.cancelLoading = false
        if (res.description === 'success') {
          Message.success({ message: '操作成功！' })
          this.pageNum = 1
          this.getOrderList()
        } else {
          Message.error({ message: `${res.description}！` })
        }

      })

    },
    // 投诉
    complaintOrder (orderId) {
      this.complaintVisible = true
      this.currentOrderId = orderId
    },
    complaintConfirm () {
      this.$refs.complaint.validate((valid) => {
        this.complaintLoading = true
        complaintAPI({ orderId: this.currentOrderId, complaintRemark: this.complaint.complaintRemark }).then(res => {
          this.complaintLoading = false
          if (res.description === 'success') {
            this.complaintVisible = false
            this.pageNum = 1
            Message.success({ message: '操作成功！' })
            this.getOrderList()
          } else {
            Message.error({ message: res.description })
          }
        })
      })

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >
.order-manage {
  width: 100%;
  height: 100%;
}
.order-wrap {
  min-height: 500px;
}
.order-content-item {
  border: 1px solid #e4e7ed;
  padding: 20px;
  margin-bottom: 10px;
}
.order-content-item-first {
  display: flex;
  justify-content: space-between;
  padding-bottom: 20px;
  font-size: 14px;
}
.order-content-item-first-right span:nth-child(2) {
  font-weight: bolder;
  font-size: 18px;
}
.order-content-item-first-left span:nth-child(1) {
  border-right: 2px solid #e4e7ed;
  margin-right: 8px;
  padding-right: 12px;
}
.order-content-item-second {
  display: flex;
  justify-content: space-between;
  /* align-items: center; */
}
.order-content-item-second-left {
  display: flex;
}
.order-content-item-second-left .text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 20px;
}
.order-content-item-second-left .text span:nth-child(1) {
  margin-bottom: 10px;
  font-size: 16px;
  color: #409eff;
  cursor: pointer;
}
.order-content-item-second-left .text span:nth-child(2) {
  margin-bottom: 10px;
  font-size: 14px;
}
.order-content-item-second-right {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #ff6e3d;
}
.order-footer {
  display: flex;
  justify-content: flex-end;
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
