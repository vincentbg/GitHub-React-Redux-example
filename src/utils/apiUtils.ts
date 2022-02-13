import { token } from "./tokenUtil";

export const getConfig = () => {
  return {
    auth: { username: token()?.user ?? "", password: token()?.token ?? "" },
  };
};
