<template>
  <p>{{ message }}</p>
  <div class="flexalign-center" @click="isShow = !isShow">
    <el-icon>
      <caret-right />
    </el-icon>
    <span>点击展开详情</span>
  </div>
  <div class="dialog-detail" v-if="isShow">{{ detail }}</div>
</template>

<script setup>
import { shallowRef } from "vue";
import { ElIcon } from "element-plus";
import { CaretRight } from "@element-plus/icons-vue";
const props = defineProps({
  message: String,
  detail: String,
});
const isShow = shallowRef(false);
</script>
<style lang="scss" scoped>
.dialog-detail {
  background: #eee;
  padding: 10px;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
  margin-top: 10px;
}
</style>
