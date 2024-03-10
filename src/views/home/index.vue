<template>
  <header class="flexalign-center flexpack-end">
    <el-dropdown @command="handleCommand">
      <el-avatar
        :size="30"
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
        <h1>{{ query.table }}</h1>
        <div class="flexalign-center">
          <div class="flexitem-1">
            <el-button type="primary" @click="showAdd">添加数据</el-button>
          </div>
          <div class="flexalingn-center">
            <el-switch v-model="showPropDesc" />
            <span class="ml10">显示字段属性</span>
          </div>
        </div>
        <el-table :data="list" border class="mt10">
          <el-table-column v-for="prop in tableProps" :key="prop.title">
            <template #header>
              {{ prop.title }}
              <el-popover
                v-if="showPropDesc"
                placement="top-start"
                trigger="hover"
              >
                <template #reference>
                  <el-icon><Warning /></el-icon>
                </template>
                <div v-html="getPropDesc(prop.title)"></div>
              </el-popover>
            </template>
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
  <create-dialog
    v-model:visible="visible.create"
    :source="tableProps"
    :database="query.database"
    :table="query.table"
    @submit="getList"
  />
</template>

<script setup>
import { ref, shallowRef, shallowReactive } from "vue";
import request from "@/plugins/request";
import omit from "lodash/omit";
import LeftPanel from "./components/LeftPanel.vue";
import { ElMessage, ElIcon } from "element-plus";
import { Warning } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import DeleteConfirm from "@/components/DeleteConfirm.vue";
import Pagination from "@/components/Pagination.vue";
import CreateDialog from "./components/CreateData.vue";
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
  tableProps.value = res.list.map((item) => ({
    ...omit(item, ["Field"]),
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

const showPropDesc = shallowRef(false);
const getPropDesc = (prop) => {
  if (!prop) {
    return "";
  }
  const match = tableProps.value.find((item) => item.title === prop);
  if (match) {
    return `类型：${match.Type}<br />允许非空：${
      match.Null === "NO" ? "是" : "否"
    }`;
  }
  return "";
};
const visible = shallowReactive({
  create: false,
});
const showAdd = () => {
  visible.create = true;
};
</script>
<style lang="scss" scoped>
header {
  height: 70px;
}
</style>
