import lodash from "lodash";
const { omit } = lodash;

export default (raw: any) => {
  return {
    code: raw.code || 200,
    message: raw.message,
    result: omit(raw, ["code", "message"]),
  };
};
