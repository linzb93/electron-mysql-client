import Controller from "../plugins/route/Controller";
import { Route } from "../plugins/route/decorators";

interface DatabaseItem {
  Database: string;
}

export default class extends Controller {
  @Route("database-get")
  async get() {
    const list = (await this.mysql.execute(
      "show databases"
    )) as DatabaseItem[][];
    return {
      message: "success",
      list: list[0].map((item: any) => ({ name: item.Database })),
    };
  }
}
