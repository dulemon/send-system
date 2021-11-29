<template>
  <div class="add-publish">
    <el-dialog title="提示"
               :visible.sync="addVisable"
               width="30%"
               :before-close="addVisable = false">
      <span>这是一段信息</span>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="addVisable = false">取 消</el-button>
        <el-button type="primary"
                   @click="handleAdd">确 定</el-button>
      </span>

    </el-dialog>

  </div>
</template>
<script>

export default {
  props: [
    'addVisable'
  ],

  data () {
    return {
      addVisable: this.addVisable

    }
  },
  mounted () {
    // console.log(this.addVisable)

  },
  watch: {
    addVisable: (value) => {
      this.addVisable = value

      console.log(this.addVisable)

    }

  },


  methods: {
    handleAdd () {

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
</style>
