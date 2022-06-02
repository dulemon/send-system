<template>
  <div class="user-manage">
    <div class="options">
      <el-button type="primary"
                 @click="handleAddVisable(true)">创建管理员</el-button>

    </div>
    <div class="wrap"
         v-loading="tableLoading">
      <div class="table">
        <el-table :data="userList"
                  style="width: 100%"
                  :row-class-name="tableRowClassName">
          <el-table-column prop="index"
                           label="序号"
                           type="index">
          </el-table-column>

          <el-table-column prop="nickName"
                           label="昵称">
          </el-table-column>
          <el-table-column prop="telPhone"
                           label="手机号">
          </el-table-column>
          <el-table-column prop="emailAddress"
                           label="邮箱">
          </el-table-column>
          <el-table-column prop="creditLevel"
                           label="信誉等级">
            <template slot-scope="scope">

              <span>{{getCreditLevel(scope.row.creditLevel)}}</span>
            </template>

          </el-table-column>

          <!-- <el-table-column prop="auditStatus"
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
          </el-table-column> -->
          <el-table-column fixed="right"
                           label="操作">
            <template slot-scope="scope">
              <el-popconfirm title="确定将此账号的密码重置为*****吗？"
                             @confirm="resetPassword(scope.row.id)">
                <el-button type="text"
                           slot="reference"
                           size="small">重置密码</el-button>
              </el-popconfirm>
              <el-popconfirm title="确定将此账号解冻吗？"
                             @confirm="freezeAccount(scope.row.id,0)"
                             v-if="scope.row.isDelete === 1">
                <el-button type="text"
                           slot="reference"
                           size="small">解冻</el-button>
              </el-popconfirm>
              <el-popconfirm title="确定将此账号冻结吗？"
                             @confirm="freezeAccount(scope.row.id,1)"
                             v-else>
                <el-button type="text"
                           slot="reference"
                           size="small">冻结</el-button>
              </el-popconfirm>

            </template>
          </el-table-column>
        </el-table>

      </div>
      <div style="text-align: right; padding: 10px 0 10px 10px">
        <el-pagination style="padding: 0"
                       background
                       layout="prev, pager, next"
                       :current-page="queryData.pageNum"
                       :total="total"
                       :page-size="queryData.pageSize"
                       @current-change="handleCurrentChange">
        </el-pagination>
      </div>

    </div>
    <el-dialog title="创建管理员"
               :visible.sync="addVisible"
               :destroy-on-close="true"
               @close='resetForms'>
      <el-form ref="addData"
               :model="addData"
               :rules="rules"
               label-width="80px">
        <el-form-item label="手机号："
                      prop="telPhone">
          <el-input v-model="addData.telPhone"
                    prefix-icon="el-icon-mobile"
                    placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="邮箱："
                      prop="emailAddress">
          <el-input v-model="addData.emailAddress"
                    prefix-icon="el-icon-message"
                    placeholder="请输入邮箱"></el-input>

        </el-form-item>
        <el-form-item label="密码："
                      prop="password">
          <el-input v-model="addData.password"
                    prefix-icon="el-icon-unlock"
                    placeholder="请输入密码"
                    show-password></el-input>
        </el-form-item>

      </el-form>

      <span slot="footer"
            class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary"
                   :loading="addLoading"
                   @click="handleAdd">确 定</el-button>
      </span>
    </el-dialog>

  </div>

</template>
<script>
// import { publishCenterAPI, publishDetailAPI, orderCreateAPI } from '@/services/services'
import moment from 'moment'
import { registerAPI, userListAPI, freezeUserAPI } from '@/services/services'
import { Message } from 'element-ui'

export default {


  data () {
    var validateTelphone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号'))
      } else {
        let reg = /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/
        if (!reg.test(value)) {
          callback(new Error('手机号格式不正确'))
        } else {
          callback()
        }
      }
    }
    var validateEmail = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入邮箱'))
      } else {
        let reg = /^[A-Za-z0-9-._]+@[A-Za-z0-9-]+(.[A-Za-z0-9]+)*(.[A-Za-z]{2,6})$/
        if (!reg.test(value)) {
          callback(new Error('邮箱格式不正确'))
        } else {
          callback()
        }
      }
    }
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
    return {
      addVisible: false,
      addData: {
        telPhone: '',
        password: '',
        emailAddress: ''
      },
      rules: {
        telPhone: [
          { validator: validateTelphone, trigger: 'blur' }
        ],
        emailAddress: [
          { validator: validateEmail, trigger: 'blur' }
        ],
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ],
      },
      userList: [],
      addLoading: false,
      queryData: {
        pageNum: 1,
        pagesize: 10,
      },
      total: 0,
      tableLoading: false,
    }
  },
  mounted () {
    this.getUserList()


  },
  methods: {
    resetForms () {
      this.$refs.addData.resetFields();
    },
    moment,
    handleAddVisable (visible) {
      this.addVisible = visible

    },
    handleAdd () {
      this.$refs.addData.validate((valid) => {
        if (valid) {
          this.addLoading = true
          registerAPI({ ...this.addData, nickName: this.addData.emailAddress, role: 2 }).then((res) => {
            this.addLoading = false
            if (res.description === 'success') {
              Message.success({ message: '创建成功！' })
              this.handleAddVisable(false)
              this.queryData.pageNum = 1
              this.getUserList()

            } else {
              Message.error({ message: `创建失败,${res.description}！` })
            }
          })

        }
      });
    },
    getUserList () {
      this.tableLoading = true
      userListAPI(this.queryData).then((res) => {
        this.tableLoading = false
        if (res.description === 'success') {
          this.userList = res.data.list
          this.total = res.data.total
        }
      })
    },
    tableRowClassName ({ rowIndex }) {
      if (rowIndex % 2 === 0) {
        return 'warning-row'
      } else {
        return 'success-row'
      }
    },
    //分页
    handleCurrentChange (page) {
      this.queryData.pageNum = page
      this.getUserList()
    },
    getCreditLevel (creditLevel) {
      if (creditLevel < 60) {
        return '较差'
      }
      if (creditLevel >= 60 && creditLevel < 70) {
        return '中等'
      }
      if (creditLevel >= 70 && creditLevel < 80) {
        return '良好'
      }
      if (creditLevel >= 80 && creditLevel < 90) {
        return '优秀'
      }
      if (creditLevel >= 90 && creditLevel < 100) {
        return '极好'
      }
    },
    resetPassword (id) {

    },
    freezeAccount (id, type) {
      freezeUserAPI({ userId: id, isDelete: type }).then((res) => {
        if (res.description === 'success') {
          Message.success({ message: '操作成功！' })
          this.queryData.pageNum = 1
          this.getUserList()

        } else {
          Message.error({ message: `操作失败,${res.description}！` })
        }
      })

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >
.user-manage {
  width: calc(100% - 30px);
  height: calc(100% - 30px);
  background: #fff;
  padding: 15px;
  overflow-y: auto;
}
.wrap {
  padding: 15px 0;
}
>>> .el-dialog {
  width: 500px;
}
>>> .el-dialog__body {
  padding: 30px 50px 20px;
}
/* >>> .el-table .warning-row {
  background: oldlace;
}
>>> .el-table .success-row {
  background: #f0f9eb;
} */
</style>
