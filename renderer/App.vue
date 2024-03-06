<template>
  <router-view />
</template>

<script setup>
import dayjs from "dayjs";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import store from "electron-store";
const router = useRouter();

const lastExpireDate = store.get("lastExpireDate");
if (dayjs().isAfter(dayjs(lastExpireDate).add(7, "d"), "d")) {
  ElMessage.error("登录授权到期，请重新登录");
  router.push("/login");
}
</script>
<style lang="scss" scoped></style>
