import Controller from "../plugins/route/Controller";
import { Route } from "../plugins/route/decorators";

export default class extends Controller {
  @Route("table-get")
  async getTableList(request) {
    const { params } = request;
    await this.mysql.changeUser({ database: params.database });
    const list = await this.mysql.execute("show tables");
    return {
      message: "success",
      list: list[0].map((item: any) => ({
        name: item[`Tables_in_${params.database}`],
      })),
    };
  }
  @Route("table-getProps")
  async getTableProps(request) {
    const { params } = request;
    await this.mysql.changeUser({ database: params.database });
    const list = await this.mysql.execute(`desc ${params.table}`);
    return {
      message: "success",
      list,
    };
  }
  @Route("list-get")
  async queryList(request) {
    const { params } = request;
    await this.mysql.changeUser({ database: params.database });
    const list = await this.mysql.query(`select * from ${params.table}`);
    return {
      message: "success",
      list: list[0],
      totalCount: list[0].length,
    };
  }
  @Route("list-delete")
  async deleteList(request) {
    const { params } = request;
    await this.mysql.changeUser({ database: params.database });
    await this.mysql.execute(
      `delete from ${params.table} where id = ${params.id}`
    );
    return {
      message: "success",
    };
  }
}
