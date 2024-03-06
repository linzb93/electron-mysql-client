import validate from "./plugins/validate";
import mysql from "mysql2/promise";

interface Request {
    params: any;
}
interface Api {
    path: string;
    actions: (request: Request) => Promise<any>
}

let connection = null;
export default [
    {
        path: 'login',
        actions: async (request) => {
            const result = validate(request.params);
            if (!result.success) {
              return result.message;
            }
            const { params } = request;
            connection = await mysql.createConnection({
              host: params.host || "localhost",
              port: params.port || 3306,
              user: params.username,
              password: params.password,
            });
          }
    }
] as Api[]