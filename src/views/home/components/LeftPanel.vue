<template>
  <div class="left-panel">
    <h2>选择表格</h2>
    <el-tree
      :props="props"
      lazy
      :load="loadNode"
      :data="tree"
      @node-click="select"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import request from "@/plugins/request";

const props = {
  label: "name",
  isLeaf: "leaf",
};
const emit = defineEmits(["select"]);
const loadNode = (node, resolve) => {
  if (!node.label) {
    return;
  }
  request("table-get", {
    database: node.label,
  }).then((res) => {
    resolve(
      res.list.map((item) => ({
        ...item,
        database: node.label,
        leaf: true,
      }))
    );
  });
};
const tree = ref([]);
onMounted(async () => {
  const ret = await request("database-get");
  tree.value = ret.list;
});

const select = (obj) => {
  if (!obj.leaf) {
    return;
  }
  emit("select", {
    database: obj.database,
    name: obj.name,
  });
};
</script>
<style lang="scss" scoped></style>
