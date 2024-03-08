import mysql, { ConnectionOptions } from "mysql2/promise";
let connection;
let currentDatabase: string;
export default {
  async createConnection(params: ConnectionOptions) {
    connection = await mysql.createConnection({
      host: params.host || "localhost",
      port: params.port || 3306,
      user: params.user,
      password: params.password,
    });
  },
  async changeUser(params: any) {
    if (params.database === currentDatabase) {
      return;
    }
    await connection.changeUser(params);
    currentDatabase = params.database;
  },
  async query(params: string) {
    return await connection.query(params);
  },
  async execute(params: string) {
    return await connection.execute(params);
  },
  async end() {
    if (connection) {
      await connection.end();
    }
  },
};
