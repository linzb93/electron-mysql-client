import Controller from "../plugins/route/Controller";
import { Route } from "../plugins/route/decorators";

export default class extends Controller {
  @Route("database-get")
  async get() {
    const list = await this.mysql.execute("show databases");
    return {
      message: "success",
      list: list[0].map((item: any) => ({ name: item.Database })),
    };
  }
}
