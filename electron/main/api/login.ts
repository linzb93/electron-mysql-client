import Controller from "../plugins/route/Controller";
import { Route } from "../plugins/route/decorators";
import jwt from "jsonwebtoken";
import { pick } from "lodash-es";
import { HTTP_STATUS } from "../plugins/constant";
import { Request } from "../types/api";

interface LoginForm {
  host: string;
  port: number;
  username: string;
  password: string;
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

class LoginController extends Controller {
  constructor() {
    super();
  }
  @Route("login")
  async login(request: Request<LoginForm>) {
    const { params } = request;
    try {
      await this.mysql.createConnection({
        ...pick(params, ["host", "port", "password"]),
        user: params.username,
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
  }
  @Route("logout")
  async logout() {
    await this.mysql.end();
  }
  @Route("token-validate")
  async tokenValidate(request: Request<{ token: string }>) {
    const { token } = request.params;
    let decoded: LoginForm;
    try {
      decoded = (await jwtVerify(token)) as LoginForm;
    } catch (error) {
      return {
        code: HTTP_STATUS.NOTLOGIN,
        message: "token失效",
      };
    }
    await this.mysql.createConnection({
      ...pick(decoded, ["host", "port", "password"]),
      user: decoded.username,
    });
    return {
      message: "token有效",
    };
  }
  @Route("register")
  register(params: Request<LoginForm>) {
    // 注册功能以后再写
  }
}
export default LoginController;
