import mysql from "../mysql";

const uid = () => {
  return parseInt((Math.random() * 100).toString());
};

abstract class Controller {
  protected mysql: typeof mysql;
  protected uid: number;
  constructor() {
    this.mysql = mysql;
    this.uid = uid();
  }
}
export default Controller;
