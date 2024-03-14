import Controller from "../plugins/route/Controller";
import { Route } from "../plugins/route/decorators";
import { Request, TableItem } from "../types/api";

export default class extends Controller {
  @Route("list-get")
  async queryList(
    request: Request<TableItem & { pageSize: number; pageIndex: number }>
  ) {
    const { params } = request;
    await this.mysql.changeUser({ database: params.database });
    const { pageSize, pageIndex } = params;
    const [list, totalRes] = await Promise.all([
      this.mysql.query(
        `select * from ${params.table} limit ${
          (pageIndex - 1) * pageSize
        }, ${pageSize}`
      ),
      this.mysql.query(`select count(*) from ${params.table}`),
    ]);
    return {
      message: "success",
      list: list[0],
      totalCount: Object.values(totalRes[0][0])[0],
    };
  }
  @Route("list-create")
  async createList(
    request: Request<TableItem & { data: { key: string; value: string }[] }>
  ) {
    const { params } = request;
    await this.mysql.changeUser({ database: params.database });
    const keys = params.data.map((item) => item.key).join(",");
    const values = params.data
      .map((item) => {
        if (["char", "varchar"].includes(item.key)) {
          return `\'${item.value}\'`;
        }
        return item.value;
      })
      .join(",");
    await this.mysql.execute(
      `insert into ${params.table} (${keys}) values ${values}`
    );
    return {
      message: "success",
    };
  }
  @Route("list-delete")
  async deleteList(request: Request & { id: number }) {
    const { params } = request;
    // await this.mysql.changeUser({ database: params.database });
    // await this.mysql.execute(
    //   `delete from ${params.table} where id = ${params.id}`
    // );
    console.log(`delete from ${params.table} where id = ${params.id}`);
    return {
      message: "success",
    };
  }
}
