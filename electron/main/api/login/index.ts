import validate from "../../plugins/validate";
import mysql from "mysql2/promise";
export default async (ctx, request) => {
  const result = validate(request.params);
  if (!result.success) {
    return result.message;
  }
  const { params } = request;
  ctx.connection = await mysql.createConnection({
    host: params.host || "localhost",
    port: params.port || 3306,
    user: params.user,
    password: params.password,
  });
};
