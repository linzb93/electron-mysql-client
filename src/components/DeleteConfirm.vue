<template>
  <el-popover
    v-model="visible"
    :placement="placement"
    class="confirm-pop"
    :offset="offset"
  >
    <div class="confirm">
      <h3 class="title">{{ title }}</h3>
      <div class="content"><slot /></div>
      <div class="confirm-btns dz-flexpack-end">
        <el-button @click="onCancel" size="mini">取消</el-button>
        <el-button type="primary" size="mini" @click="onConfirm">{{
          confirmButtonText
        }}</el-button>
      </div>
    </div>
    <span slot="reference">
      <el-button size="small" type="danger">删除</el-button>
    </span>
  </el-popover>
</template>

<script>
export default {
  components: {},
  props: {
    title: String,
    confirmButtonText: {
      type: String,
      default: "确定",
    },
  },
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    onCancel() {
      this.visible = false;
    },
    onConfirm() {
      this.visible = false;
      this.$emit("confirm");
    },
  },
};
</script>
<style lang="scss" scoped>
.confirm {
  padding: 12px 8px 8px 15px;
  h3 {
    font-size: 14px;
    color: #333;
  }
  .content {
    font-size: 14px;
    margin-top: 10px;
    color: #666;
    ::v-deep span {
      color: #ff3e40;
    }
  }
  .confirm-btns {
    margin-top: 18px;
    .el-button {
      font-size: 12px;
    }
  }
}
</style>
