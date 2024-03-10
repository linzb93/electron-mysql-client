import {omit} from "lodash-es";

export default (raw: any) => {
  return {
    code: raw.code || 200,
    message: raw.message,
    result: omit(raw, ["code", "message"]),
  };
};
