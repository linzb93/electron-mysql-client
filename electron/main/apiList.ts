import validate from "./plugins/validate";
import mysql from "mysql2/promise";
import jwt from "jsonwebtoken";
import { HTTP_STATUS } from "./plugins/constant";
interface Request {
  params: any;
}
interface Api {
  path: string;
  actions: (request: Request) => Promise<any>;
}

const jwtVerify = (token: string) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, "shhhhh", (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });

let connection = null;
export default [
  {
    path: "login",
    actions: async (request) => {
      const result = validate(request.params);
      if (!result.success) {
        return result.message;
      }
      const { params } = request;
      try {
        connection = await mysql.createConnection({
          host: params.host || "localhost",
          port: params.port || 3306,
          user: params.username,
          password: params.password,
        });
      } catch (error) {
        return {
          code: HTTP_STATUS.BAD_REQUEST,
          message: "连接失败",
          detail: error.message,
        };
      }
      const token = jwt.sign(params, "shhhhh", {
        expiresIn: "7d",
      });
      return {
        message: "登录成功",
        token,
      };
    },
  },
  {
    path: "token-validate",
    actions: async (request) => {
      const { token } = request.params;
      let decoded = {} as any;
      try {
        decoded = await jwtVerify(token);
      } catch (error) {
        return {
          code: HTTP_STATUS.NOTLOGIN,
          message: "token失效",
        };
      }
      connection = await mysql.createConnection({
        host: decoded.host || "localhost",
        port: decoded.port || 3306,
        user: decoded.username,
        password: decoded.password,
      });
      return {
        message: "token有效",
      };
    },
  },
  {
    path: "database-get",
    actions: async () => {
      const list = await connection.execute("show databases");
      return {
        message: "success",
        list: list[0].map((item: any) => ({ name: item.Database })),
      };
    },
  },
  {
    path: "table-get",
    actions: async (request) => {
      const { params } = request;
      await connection.changeUser({ database: params.database });
      const list = await connection.execute("show tables");
      return {
        message: "success",
        list: list[0].map((item: any) => ({
          name: item[`Tables_in_${params.database}`],
        })),
      };
    },
  },
  {
    path: "table-getProps",
    actions: async (request) => {
      const { params } = request;
      await connection.changeUser({ database: params.database });
      const list = await connection.execute(`desc ${params.table}`);
      return {
        message: "success",
        list,
      };
    },
  },
  {
    path: "list-get",
    actions: async (request) => {
      const { params } = request;
      await connection.changeUser({ database: params.database });
      const list = await connection.query(`select * from ${params.table}`);
      return {
        message: "success",
        list: list[0],
        totalCount: list[0].length,
      };
    },
  },
  {
    path: "list-delete",
    actions: async (request) => {
      const { params } = request;
      await connection.changeUser({ database: params.database });
      await connection.execute(
        `delete from ${params.table} where id = ${params.id}`
      );
      return {
        message: "success",
      };
    },
  },
] as Api[];
