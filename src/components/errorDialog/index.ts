// modal.js
import { h } from "vue";
import { ElMessageBox } from "element-plus";
import DialogCon from "./Cont.vue";
export default function openModal({
  message,
  detail,
}: {
  message: string;
  detail: string;
}) {
  ElMessageBox({
    title: "错误提醒",
    message: () =>
      h(DialogCon, {
        message,
        detail,
      }),
  }).catch(() => {
    //
  });
}
