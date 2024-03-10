<template>
  <el-dialog
    :model-value="visible"
    width="400px"
    title="添加数据"
    label-suffix="："
  >
    <el-form>
      <el-form-item
        v-for="entity in form"
        :key="entity.key"
        :label="entity.key"
      >
        <el-input v-model="entity.value" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button @click="close">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, shallowRef, reactive, shallowReactive, watch } from "vue";
import request from "@/plugins/request";
import errorDialog from "@/components/errorDialog";
import { ElMessage } from "element-plus";
const props = defineProps({
  visible: Boolean,
  source: Object,
  database: String,
  table: String,
});
const emit = defineEmits(["update:visible", "submit"]);

const form = ref({});
watch(props, ({ visible }) => {
  if (!visible) {
    return;
  }
  // const keys = Object.keys(props.source);
  const keys = props.source.map((item) => item.title);
  form.value = keys.map((key) => ({
    key,
    // value: props.source[key],
  }));
});

const getDifferentObj = (prevObj, nextObj) => {
  console.log(prevObj);
  console.log(nextObj);
  const ret = {};
  for (const key of nextObj) {
    if (nextObj[key] !== prevObj[key]) {
      ret[key] = nextObj[key];
    }
  }
  return ret;
};
const submit = async () => {
  // const submitForm = getDifferentObj(props.source, form.value);
  const submitForm = form.value;
  try {
    await request("list-create", {
      database: props.database,
      table: props.table,
      data: submitForm,
    });
  } catch (error) {
    errorDialog({
      message: "添加失败",
      detail: error.result.detail,
    });
    return;
  }
  ElMessage.success("添加成功");
  emit("submit");
  close();
};
const close = () => {
  emit("update:visible", false);
};
</script>
<style lang="scss" scoped></style>
