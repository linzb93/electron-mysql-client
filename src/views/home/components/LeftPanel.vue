<template>
  <div class="left-panel">
    <h2>选择表格</h2>
    <el-tree
      :props="props"
      lazy
      :load="loadNode"
      :data="tree"
      @node-click="select"
    >
      <template #default="{ node }">
        <div class="full-width flexalign-center">
          <p class="flexitem-1">{{ node.label }}</p>
          <el-dropdown @command="(command) => handleTreeNode(node, command)">
            <div class="more">...</div>
            <template #dropdown>
              <el-dropdown-menu>
                <template v-if="node.level === 1">
                  <el-dropdown-item command="create">创建表格</el-dropdown-item>
                </template>
                <template v-else>
                  <el-dropdown-item command="edit">编辑表格</el-dropdown-item>
                  <el-dropdown-item command="delete">删除表格</el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </template>
    </el-tree>
  </div>
  <create-table v-model:visible="visible.create" :database="database" />
</template>

<script setup>
import { ref, onMounted, shallowReactive, shallowRef } from "vue";
import request from "@/plugins/request";
import CreateTable from "./CreateTable.vue";
import { ElMessageBox } from "element-plus";
const props = {
  label: "name",
  isLeaf: "leaf",
};
const emit = defineEmits(["select"]);
const loadNode = (node, resolve) => {
  if (!node.label) {
    return;
  }
  request(
    "table-get",
    {
      database: node.label,
    },
    {
      delay: 500,
    }
  ).then((res) => {
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

const visible = shallowReactive({
  create: false,
});
const database = shallowRef("");
const handleTreeNode = (node, command) => {
  if (command === "create") {
    visible.create = true;
    database.value = node.label;
  } else if (command === "edit") {
    visible.create = true;
  } else if (command === "delete") {
    ElMessageBox.confirm("确认删除？", "温馨提醒", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
    })
      .then(() => {})
      .catch(() => {
        //
      });
  }
};
</script>
<style lang="scss" scoped>
.left-panel {
  width: 200px;
  overflow-x: auto;
  margin-right: 20px;
  h2 {
    font-size: 20px;
    color: #000;
    font-weight: bold;
    margin-bottom: 10px;
  }
}
.more {
  line-height: 21px;
  margin-right: 5px;
}
</style>
