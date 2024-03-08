<template>
  <header class="flexpack-end">
    <el-dropdown @command="handleCommand">
      <el-avatar
        :size="20"
        src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
      />
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </header>
  <div class="flexalign-start">
    <left-panel @select="selectTable" />
    <div class="main flexitem-1">
      <template v-if="loaded">
        <el-table :data="list" border>
          <el-table-column
            v-for="prop in tableProps"
            :key="prop.title"
            :label="prop.title"
          >
            <template #default="scope">
              <p>{{ scope.row[prop.title] }}</p>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right">
            <template #default="scope">
              <delete-confirm @confirm="del(scope.row)" />
            </template>
          </el-table-column>
        </el-table>
        <pagination
          :total="totalCount"
          v-model:page="query.pageIndex"
          v-model:limit="query.pageSize"
          @pagination="getList"
        />
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, shallowRef, shallowReactive, onMounted } from "vue";
import request from "@/plugins/request";
import request2 from "@/plugins/request2";
import LeftPanel from "./components/LeftPanel.vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import DeleteConfirm from "@/components/DeleteConfirm.vue";
import Pagination from "@/components/Pagination.vue";

const router = useRouter();

// 头部
const handleCommand = async (command) => {
  if (command === "logout") {
    await request("logout");
    ElMessage.success("退出成功");
    localStorage.removeItem("token");
    router.back();
  }
};
// 列表
const query = shallowReactive({
  pageSize: 10,
  pageIndex: 1,
  database: "",
  table: "",
});
const loaded = shallowRef(false);
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
    database: query.database,
    table: query.table,
  });
  tableProps.value = res.list[0].map((item) => ({
    title: item.Field,
  }));
};
const selectTable = (obj) => {
  query.database = obj.database;
  query.table = obj.name;
  Promise.all([resetList(), getProps()]).then(() => {
    loaded.value = true;
  });
};

const del = async (row) => {
  await request("list-delete", {
    id: row.id,
  });
  ElMessage.success("删除成功");
  getList();
};

onMounted(async () => {
  const data = await request2("login", {
    id: 3,
  });
  console.log(data);
});
</script>
<style lang="scss" scoped></style>
