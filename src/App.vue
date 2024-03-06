<script setup lang="ts">
import dayjs from "dayjs";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
const router = useRouter();

const lastExpireDate = localStorage.getItem("lastExpireDate");
if (!lastExpireDate) {
  router.push("/login");
} else if (dayjs().isAfter(dayjs(lastExpireDate).add(7, "d"), "d")) {
  ElMessage.error("登录授权到期，请重新登录");
  router.push("/login");
}
</script>

<template>
  <div class="full-height">
    <router-view />
  </div>
</template>
