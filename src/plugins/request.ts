export default async (path: string, params: any) => {
  const res = await window.ipcRenderer.invoke("api", JSON.stringify({
    path,
    params,
  }));
  return res;
};
