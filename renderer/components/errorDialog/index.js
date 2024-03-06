// modal.js
import { createApp } from "vue";
import ModalComponent from "./Main.vue";

export function openModal() {
  const modalInstance = createApp(ModalComponent);
  const modalElement = document.createElement("div");
  document.body.appendChild(modalElement);

  modalInstance.mount(modalElement);

  modalInstance.componentProxy.$on("close", () => {
    modalInstance.unmount();
    modalElement.remove();
  });
}
