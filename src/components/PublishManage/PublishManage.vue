<template>
  <div class="publish-manage">
    <div class="publish-manage-options">
      <div class="publish-manage-options-line">
        <div class="publish-manage-options-item">
          <span class="label">标题：</span>
          <el-input v-model="title"
                    style="width:calc( 100% - 80px )"
                    placeholder="请输入标题"
                    @change="(value) => changeOption(value, 'title')"
                    clearable></el-input>
        </div>
        <div class="publish-manage-options-item">
          <span class="label">发布时间：</span>
          <el-date-picker v-model="time"
                          type="datetimerange"
                          range-separator="至"
                          @change="(value) =>  changeOption(value, 'time')"
                          clearable>
          </el-date-picker>
        </div>
        <div class="publish-manage-options-item">
          <span class="label"> 信誉等级：</span>
          <el-select v-model="creditLevel"
                     placeholder="请选择"
                     @change="(value) =>  changeOption(value, 'creditLevel')"
                     :clearable="true">
            <el-option v-for="item in options"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="publish-manage-options-line">
        <div class="publish-manage-options-item">
          <span class="label">价格区间：</span>
          <div style="display: flex;align-items:center">
            <el-input v-model="minReward"
                      style="width:100px"
                      clearable
                      @change="(value) =>  changeOption(value, 'minReward')"
                      placeholder=""></el-input> <span style="margin:0 10px">-</span>
            <el-input v-model="maxReward"
                      clearable
                      @change="(value) =>  changeOption(value, 'maxReward')"
                      style="width:100px"
                      placeholder=""></el-input>
          </div>
        </div>
        <div class="publish-manage-options-item">
          <el-button type="primary"
                     @click="getPublishList()">查询</el-button>
        </div>
      </div>
    </div>

    <div class="publish-manage-wrap"
         v-loading="loading">
      <el-empty v-if="publishList.length === 0"
                :image-size="200"></el-empty>
      <div v-else
           class="publish-manage-content">
        <el-card class="publish-manage-content-item"
                 :body-style="{ padding: '0px' }"
                 :key="item.id"
                 v-for="item in publishList">
          <el-image class="image"
                    :src="item.imageUrl[0]"
                    fit="cover">
          </el-image>
          <div class="title">
            <span>{{item.title}}</span>
            <span>￥{{item.reward}}元</span>
          </div>
          <div class="operate">
            <time class="time">{{moment(item.publishTime).format('YYYY-MM-DD hh:mm:ss')}}</time>
            <div>
              <el-button type="text"
                         class="button"
                         @click="getPublishDetail(item.id)">详情</el-button>
              <el-popconfirm title="确定下单吗？"
                             @confirm="orderCreate(item.id)">
                <el-button type="text"
                           class="button"
                           slot="reference">下单</el-button>
              </el-popconfirm>
            </div>

          </div>
        </el-card>

      </div>
      <div class="publish-manage-footer"
           v-if="total > 0">
        <el-pagination background
                       layout="prev, pager, next"
                       :current-page="pageNum"
                       :total="total"
                       :page-size="pageSize"
                       @current-change="handleCurrentChange">
        </el-pagination>
      </div>

    </div>

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

  </div>
</template>
<script>
import { publishCenterAPI, publishDetailAPI, orderCreateAPI } from '@/services/services'
import moment from 'moment'
import { Message } from 'element-ui'

export default {

  data () {
    return {
      title: '',
      time: [],
      creditLevel: null,
      options: [{
        value: 4,
        label: '优秀'
      }, {
        value: 3,
        label: '良好'
      }, {
        value: 2,
        label: '中等'
      },
      {
        value: 1,
        label: '较差'
      },
      ],
      minReward: null,
      maxReward: null,
      loading: false,
      publishList: [],
      pageNum: 1,
      pageSize: 15,
      total: 0,
      detailData: {

      },
      detailVisable: false,
      detailLoading: false,



    }
  },
  mounted () {
    this.getPublishList()

  },
  methods: {
    moment,
    //获取发布信息列表
    getPublishList () {
      this.loading = true
      const { title, creditLevel, time, pageNum, pageSize, minReward, maxReward } = this
      let params = {
        title,
        creditLevel,
        pageNum,
        pageSize,
        saleStatus: 1,
      }
      if (time.length === 2) {
        params.beginTime = time[0].format('YYYY-MM-DD hh:mm:ss')
        params.endTime = time[0].format('YYYY-MM-DD hh:mm:ss')
      }
      if (Number(minReward) >= 0 && Number(maxReward) > 0) {
        params.minReward = minReward
        params.maxReward = maxReward
      }
      publishCenterAPI(params).then(res => {
        if (res.description === 'success') {
          this.publishList = res.data.list.filter((item) => item.auditStatus === 2)
          this.total = res.data.total
          this.loading = false
        }
      })
      console.log(this.total)
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
    //分页
    handleCurrentChange (page) {
      this.pageNum = page
      this.getPublishList()
    },
    changeOption (value, type) {
      this.pageNum = 1
      switch (type) {
        case 'title': this.title = value; break;
        case 'time': this.time = value; break;
        case 'creditLevel': this.creditLevel = value; break;
        case 'minReward': this.minReward = value.replace(/[^0-9.]/g, "").trim(); break;
        case 'maxReward': this.maxReward = value.replace(/[^0-9.]/g, "").trim(); break;
        default:
      }
    },
    orderCreate (id) {
      orderCreateAPI({ publishInfoId: id }).then(res => {
        if (res.description === 'success') {
          this.pageNum = 1
          Message.success({ message: '下单成功！' })
          this.getPublishList()
        } else {
          Message.error({ message: res.description })
        }
      })

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >
.publish-manage {
  width: calc(100% - 30px);
  height: calc(100% - 30px);
  background: #fff;
  padding: 15px;
  overflow-y: auto;
}
.publish-manage-wrap {
  /* background: #fff; */
  padding: 10px;
  height: calc(100% - 90px);
}
.publish-manage-content {
  display: flex;
  flex-wrap: wrap;
}

.publish-manage-content-item {
  width: calc(25% - 22px);
  margin-right: 20px;
  margin-bottom: 20px;
}
.publish-manage-content-item:nth-of-type(4n) {
  margin-right: 0;
}
.publish-manage-content-item .image {
  object-fit: cover;
  height: 150px;
  width: 100%;
}
.publish-manage-content-item .title {
  font-size: 14px;
  padding: 5px 10px 0 10px;
  display: flex;
  justify-content: space-between;
}
.publish-manage-content-item .operate {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding: 0 10px;
}
.el-button + .el-button {
  margin-left: 5px;
}
.publish-manage-options-line {
  display: flex;
  padding-bottom: 15px;
}
.publish-manage-options-item {
  display: flex;
  align-items: center;
  margin-right: 20px;
}
.label {
  width: 80px;
  display: inline-block;
  font-size: 14px;
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
.publish-manage-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
