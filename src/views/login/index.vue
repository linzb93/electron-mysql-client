<template>
  <div class="full-height flex-center">
    <div>
      <h1 class="logo">
        <img />
      </h1>
      <h2>Mysql Lite</h2>
      <el-form
        :model="form"
        label-width="80px"
        label-suffix="："
        ref="formRef"
        :rules="rules"
      >
        <el-form-item label="地址" prop="host">
          <el-input v-model="form.host" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="端口号" prop="port">
          <el-input
            v-model.number="form.port"
            placeholder="请输入端口号，默认3306"
          />
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="primary" @click="register">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import dayjs from "dayjs";
import { ref, shallowRef } from "vue";
import request from "../../plugins/request";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import errorDialog from "../../components/errorDialog/index.js";
const router = useRouter();

const rules = {
  username: {
    required: true,
    message: "请输入用户名",
  },
  password: {
    required: true,
    message: "请输入密码",
  },
};
const form = ref({
  host: "",
  port: 0,
  username: "",
  password: "",
});
const formRef = ref(null);
const login = async () => {
  const isValid = await formRef.value.validate();
  if (!isValid) {
    return;
  }
  try {
    await request("login", form.value);
  } catch (error) {
    console.log(error);
    const errorRes = error.response;
    // errorDialog({
    //   message: "登录失败",
    //   detail: errorRes.message,
    // });
    return;
  }
  localStorage.setItem("lastExpireDate", dayjs().format("YYYY-MM-DD"));
  ElMessage({
    type: "success",
    message: "登录成功",
    onClose() {
      router.push("/home");
    },
  });
};
const register = async () => {
  const isValid = await formRef.value.validate();
  if (!isValid) {
    return;
  }
  try {
    await request("login-request", form.value);
  } catch (error) {
    return;
  }
  localStorage.setItem("lastExpireDate", dayjs().format("YYYY-MM-DD"));
  ElMessage({
    type: "success",
    message: "注册成功",
    onClose() {
      router.push("/home");
    },
  });
};
</script>
<style lang="scss" scoped>
h2 {
  text-align: center;
  font-size: 20px;
}
.el-form {
  margin-top: 10px;
}
</style>
