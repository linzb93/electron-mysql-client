<template>
  <el-dialog :model-value="visible" width="500px" title="创建表格">
    <el-form :model="form" :rules="rules" label-suffix="：">
      <el-form-item label="表格名称">
        <el-input v-model="form.tableName" />
      </el-form-item>
      <el-form-item
        label="字段"
        v-for="(formItem, index) in form.formList"
        :key="index"
      >
        <el-form-item label="名称">
          <el-input v-model="formItem.name" style="width: 75px" />
        </el-form-item>
        <el-form-item label="类型" class="ml10">
          <el-select
            v-model="formItem.type"
            placeholder="请选择"
            style="width: 115px"
          >
            <el-option
              v-for="option in typeList"
              :key="option"
              :value="option"
              :label="option"
            />
          </el-select>
          <el-input
            style="width: 95px"
            class="ml10"
            v-model="formItem.extraData"
            v-if="
              ['float', 'decimal', 'char', 'varchar'].includes(formItem.type)
            "
            placeholder="请填写数值"
          />
        </el-form-item>
      </el-form-item>
      <el-link type="primary" @click="addField">添加字段</el-link>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button @click="close">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from "vue";
import request from "@/plugins/request";
import errorDialog from "@/components/errorDialog";
import { ElMessage } from "element-plus";
const props = defineProps({
  visible: Boolean,
  source: Object,
  database: String,
});
const emit = defineEmits(["update:visible", "submit"]);

const form = ref({
  tableName: "",
  formList: [{ name: "", type: "", extraData: "" }],
});
const rules = {};
watch(props, ({ visible }) => {
  if (!visible) {
    return;
  }
});

const typeList = [
  "int",
  "bigint",
  "smallint",
  "tinyint",
  "float",
  "decimal",
  "char",
  "varchar",
  "text",
  "date",
  "timestamp",
];
const addField = () => {
  form.value.formList.push({ name: "", type: "", extraData: "" });
};
const submit = async () => {
  try {
    await request("table-create", {
      ...form.value,
    });
  } catch (error) {
    // errorDialog({
    //   message: "创建失败",
    //   detail: error.result.detail,
    // });
    return;
  }
  ElMessage.success("添加成功");
  close();
};
const close = () => {
  emit("update:visible", false);
};
const closed = () => {};
</script>
<style lang="scss" scoped></style>
