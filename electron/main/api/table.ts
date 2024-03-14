import Controller from "../plugins/route/Controller";
import { Route } from "../plugins/route/decorators";
import { Request, TableItem } from "../types/api";

export default class extends Controller {
  @Route("table-get")
  async getTableList(request: Request<TableItem>) {
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
  async getTableProps(request: Request<TableItem>) {
    const { params } = request;
    await this.mysql.changeUser({ database: params.database });
    const [list] = await this.mysql.execute(`desc ${params.table}`);
    return {
      message: "success",
      list,
    };
  }
  @Route("table-create")
  async createTable(
    request: Request<{
      database: string;
      tableName: string;
      formList: {
        type: string;
        name: string;
        extraData?: string;
      }[];
    }>
  ) {
    const { params } = request;
    await this.mysql.changeUser({ database: params.database });
    await this.mysql.execute(
      `create table ${params.tableName} (${params.formList
        .map((formItem) => {
          const type = ["float", "decimal", "char", "varchar"].includes(
            formItem.type
          )
            ? `${formItem.type}(${formItem.extraData})`
            : formItem.type;
          return `${formItem.name} ${type}`;
        })
        .join(",")})`
    );
    return {
      message: "success",
    };
  }
}
