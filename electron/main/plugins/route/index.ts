import { ipcMain } from "electron";
import chalk from "chalk";
import LoginController from "../../api/login";
import DatabaseController from "../../api/database";
import TableController from "../../api/table";
import ListController from "../../api/list";
import { getApiList } from "./decorators";
import wrapResponse from "../../plugins/wrapResponse";
import { HTTP_STATUS } from "../../plugins/constant";

export default () => {
  new LoginController();
  new DatabaseController();
  new TableController();
  new ListController();

  ipcMain.handle("api", async (_, requestStr: string) => {
    const request = JSON.parse(requestStr) as any;
    const { path } = request;
    const apiList = getApiList();
    const match = apiList.find((item) => item.path === path);
    if (match) {
      const { Class, propertyKey } = match;
      try {
        const ctor = new Class();
        const ret = await ctor[propertyKey](request);
        return wrapResponse(ret);
      } catch (error) {
        console.log(`api ${chalk.green(match.path)} error`);
        console.log(error.message);
        return wrapResponse({
          code: HTTP_STATUS.INTERNAL_SERVER_ERROR,
          message: "服务器故障",
        });
      }
    }
  });
};
