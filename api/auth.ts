import instance from ".";
import { storeToken } from "./storage";

const signUp = async (userInfo: FormData) => {
  const res = await instance.post("/auth/signup", userInfo);
  await storeToken(res.data.token);
  return res;
};

export default signUp;
