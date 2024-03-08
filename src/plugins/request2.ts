export default async (path: string, params: any) => {
  const res = await window.ipcRenderer.invoke(
    "api2",
    JSON.stringify({
      path,
      params,
    })
  );
  const len = 10;
  console.log(`%c┌${`─`.repeat(len)}`, "color:red");
  console.log("%c|%c# api log", "color:red", "font-size:16px;font-weight:bold");
  console.log(
    `%c|%c发送请求：%c${path}%c，参数：`,
    "color:red",
    "",
    "color:green",
    ""
  );
  console.log(params);
  console.log("%c|%c收到请求结果：", "color:red", "");
  console.log(res);
  console.log(`%c└${`─`.repeat(len)}`, "color:red");
  if (res.code !== 200) {
    return Promise.reject(res);
  }
  return res.result;
};
