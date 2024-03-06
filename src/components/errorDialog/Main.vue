<template>
  <el-dialog
    title="错误提醒"
    width="400px"
    v-model:visible="visible"
    @closed="handleClose"
  >
    <p class="message">{{ message }}</p>
    <p
      class="show-detail"
      :class="{ on: showDetail }"
      @click="showDetail = !showDetail"
    >
      <i class="tri"></i>点击查看详情
    </p>
    <div class="detail" v-if="showDetail">
      {{ detail }}
    </div>
  </el-dialog>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      visible: false,
      message: "",
      detail: "",
      showDetail: false,
    };
  },
  created() {
    this.visible = true;
  },
  methods: {
    handleClose() {
      this.$emit("close");
    },
  },
};
</script>
<style lang="scss" scoped></style>
