<template>
  <div class="flexalign-start">
    <left-panel @select="selectTable" />
    <div class="main flexitem-1">
      <el-table :data="list">
        <el-table-column v-for="prop in tableProps" :key="prop.title">
          <template slot-scope="scope">
            {{ scope.row[prop] }}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <delete-confirm @confirm="del(scope.row)" />
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, shallowRef, reactive, shallowReactive } from "vue";
import request from "../../plugins/request";
import LeftPanel from "./components/LeftPanel.vue";
import { ElMessage } from "element-plus";
const query = shallowReactive({
  pageSize: 10,
  pageIndex: 1,
  id: "",
});
const list = ref([]);
const totalCount = shallowRef(0);
const getList = async () => {
  const res = await request("list-get", query);
  list.value = res.list;
  totalCount.value = res.totalCount;
};

const resetList = () => {
  query.pageIndex = 1;
  getList();
};

const tableProps = shallowRef([]);
const getProps = async () => {
  const res = await request("table-getProps", {
    id: query.id,
  });
  tableProps.value = res;
};
const selectTable = (id) => {
  query.id = id;
  resetList();
  getProps();
};

const del = async (row) => {
  await request("list-delete", {
    id: row.id,
  });
  ElMessage.success("删除成功");
  getList();
};
</script>
<style lang="scss" scoped></style>
