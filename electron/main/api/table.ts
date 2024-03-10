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
    const [list] = await this.mysql.execute(`desc ${params.table}`);
    return {
      message: "success",
      list,
    };
  }
  @Route('table-create')
  async createTable(request) {
    const {params} = request;
    await this.mysql.changeUser({ database: params.database });
    await this.mysql.execute(`create table ${params.tableName} (${params.formList.map(formItem => {
      const type = ['float', 'decimal', 'char', 'varchar'].includes(formItem.type) ? `${formItem.type}(${formItem.extraData})` : formItem.type;
      return `${formItem.name} ${type}`
    }).join(',')})`);
    return {
      message: 'success',
    }
  }
}
