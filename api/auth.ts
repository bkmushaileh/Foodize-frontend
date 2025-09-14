import instance from ".";
import { storeToken } from "./storage";

const signUp = async (userInfo: FormData) => {
  console.log(userInfo);
  const res = await instance.post("auth/signup", userInfo);
  await storeToken(res.data.token);
  console.log(res.data);

  return res;
};

export default signUp;
