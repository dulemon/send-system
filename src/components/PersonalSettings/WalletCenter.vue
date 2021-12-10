<template>
  <div class="wallet-centers">
    <div class="first">
      <span>我的零钱：￥{{ balance }}元</span>
      <div>
        <el-button type="primary"
                   @click="showCoupons">充值</el-button>
        <el-button type="default"
                   @click="withdrawal">提现</el-button>
      </div>
    </div>
    <div class="wallets"
         :style="!show? 'display:none' :'display:flex' ">
      <div class="wallet-item"
           v-for="item in rechargeVouchers"
           :key="item.id">
        <div class="left"> <span>￥{{item.money}}元</span></div>
        <div class="right">
          <span class="text">{{item.cardId}}</span>
          <span class="text"
                v-if="item.btnName === '立即充值'">卡密：{{item.cardPassword}}</span>
          <span @click="coupon(item)">{{item.btnName}}</span>
        </div>
      </div>
    </div>
    <el-dialog title="充值"
               :visible.sync="couponModalVisible"
               :before-close="handleClose"
               :destroy-on-close="true"
               @close="resetForms('couponData')"
               width="500px">
      <el-form :model="couponData"
               ref="couponData"
               :rules="{password:[
      { required: true, message: '请输入卡密'}
    ]}"
               label-width="60px">
        <el-form-item label="卡密"
                      prop="password">
          <el-input v-model="couponData.password"
                    autocomplete="off"
                    placeholder="请输入卡密"></el-input>
        </el-form-item>
      </el-form>
      <div class="submit">
        <el-button @click="couponModalVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="submit('coupon')"
                   :loading="couponLoading">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="提现"
               :visible.sync="withdrawalModalVisible"
               :before-close="handleClose"
               :destroy-on-close="true"
               @close="resetForms('withdrawalData')"
               width="500px">
      <el-form :model="withdrawalData"
               ref="withdrawalData"
               :rules="rules"
               label-width="60px">
        <el-form-item label="金额"
                      prop="money">
          <el-input v-model="withdrawalData.money"
                    autocomplete="off"
                    placeholder="请输入提现金额"></el-input>
        </el-form-item>
      </el-form>
      <div class="submit">
        <el-button @click="withdrawalModalVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="submit('withdrawal')"
                   :loading="withdrawalLoading">确 定</el-button>
      </div>

    </el-dialog>
  </div>
</template>
<script>

import { Message } from 'element-ui'
import { walletInfoAPI, couponAPI, withdrawAPI } from '@/services/services'

export default {
  components: {

  },
  data () {

    var validateMoney = (rule, value, callback) => {
      if (value) {
        let reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/
        if (!reg.test(value)) {
          callback(new Error('提现金额必须为正整数且最多包含两位小数'))
        } else {
          callback()
        }
      }
      callback()
    }
    return {
      show: false,
      couponModalVisible: false,
      withdrawalModalVisible: false,
      balance: 0,
      rechargeVouchers: [],
      couponData: {
        password: ''
      },
      withdrawalData: {
        money: '',
      },
      couponLoading: false,
      withdrawalLoading: false,
      rules: {
        money: [
          { required: true, message: '请输入提现金额', trigger: 'blur' },
          { validator: validateMoney, trigger: 'blur' }
        ]
      },
      currentItem: '',
    }
  },
  mounted () {
    this.getWalletData()
  },

  methods: {

    resetForms (form) {
      this.$refs[form].resetFields();
    },

    getWalletData () {
      walletInfoAPI().then(res => {
        if (res.description === 'success') {
          this.balance = res.data.balance
          this.rechargeVouchers = res.data.vouchersList.map((item) => { return { ...item, btnName: '立即使用' } })
        }
      })
    },
    showCoupons () {
      this.show = true

    },
    //  提现
    withdrawal () {
      this.withdrawalModalVisible = true
    },

    //充值
    coupon (item) {
      if (item.btnName === '立即充值') {
        this.couponModalVisible = true
        this.currentItem = item
      } else {
        this.rechargeVouchers.map(i => {
          if (i.cardId === item.cardId) {
            item.btnName = '立即充值'
          }
        })

      }

    },

    // 确定
    submit (type) {
      if (type === "withdrawal") {
        this.$refs.withdrawalData.validate((valid) => {
          if (valid) {
            this.withdrawalLoading = true
            withdrawAPI(this.withdrawalData).then((res) => {
              this.withdrawalLoading = false
              if (res.description === 'success') {
                Message.success({ message: '提现成功！' })
                this.withdrawalModalVisible = false
                this.withdrawalData = {}
                this.getWalletData()
              } else {
                Message.error({ message: `${res.description}！` })
              }
            })
          }
        });

      }
      if (type === "coupon") {
        this.$refs.couponData.validate((valid) => {
          if (valid) {
            this.couponLoading = true
            couponAPI({ cardId: this.currentItem.cardId, cardPassword: this.couponData.password }).then((res) => {
              this.couponLoading = false
              if (res.description === 'success') {
                Message.success({ message: '充值成功' })
                this.couponModalVisible = false
                this.getWalletData()
                this.couponData = {}
                this.currentItem = {}
              } else {
                Message.error({ message: `${res.description}！` })
              }
            })
          }
        });

      }
    },
    handleClose () {
      this.couponModalVisible = false
      this.withdrawalModalVisible = false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >
.wallet-center {
  width: 100%;
  height: 100%;
  overflow: auto;
}
.first {
  padding: 20px 0;
}
.first span {
  padding-bottom: 15px;
  display: inline-block;
}
.wallets {
  display: flex;
  flex-wrap: wrap;
  padding-top: 20px;
}
.wallet-item {
  border-radius: 10px;
  width: calc(50% - 20px);
  display: flex;
  box-shadow: 0 0 8px 4px hsl(210deg 1% 67% / 20%);
  margin-bottom: 20px;
  height: 80px;
}
.wallet-item:nth-of-type(n) {
  margin-right: 20px;
}
.wallet-item .left {
  background: linear-gradient(to right, #e7930e, #e7930e69);
  width: 80px;
  color: #fff;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
}
.wallet-item .right {
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 14px;
  width: calc(100% - 80px);
  padding: 5px 10px;
  position: relative;
  padding-bottom: 20px;
}
.wallet-item .right span.text {
  display: block;
  text-align: center;
}
.wallet-item .right span:nth-last-child(1) {
  cursor: pointer;
  color: #0080ff;
  display: block;
  text-align: right;
  position: absolute;
  right: 10px;
  bottom: 10px;
  font-size: 12px;
}
.submit {
  display: flex;
  justify-content: center;
}
</style>
