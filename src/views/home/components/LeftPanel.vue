<template>
  <div class="left-panel">
    <h2>选择表格</h2>
    <el-tree :props="props" lazy :load="loadNode" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import request from "../../../plugins/request";

const props = {};
const loadNode = (node, resolve) => {
  request("table-get", {
    id: node.id,
  }).then((list) => {
    resolve(list);
  });
};
const tree = ref([]);
onMounted(async () => {
  const ret = await request("database-get");
  tree.value = ret;
});
</script>
<style lang="scss" scoped></style>
