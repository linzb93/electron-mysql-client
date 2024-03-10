import mysql from "../mysql";

abstract class Controller {
  protected mysql: typeof mysql;
  constructor() {
    this.mysql = mysql;
  }
}
export default Controller;
