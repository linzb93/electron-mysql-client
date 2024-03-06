import { ipcRenderer as ipc } from "electron-better-ipc";

export default async (path, params) => {
  const res = await ipc.callMain("api", {
    path,
    params,
  });
  return res;
};
