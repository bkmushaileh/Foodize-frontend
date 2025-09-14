import { SignInUserInfo } from "@/data/userInfo";
import instance from ".";
import { storeToken } from "./storage";

const signUp = async (userInfo: FormData) => {
  console.log(userInfo);
  const res = await instance.post("auth/signup", userInfo);
  await storeToken(res.data.token);
  console.log(res.data);

  return res;
};

const signIn = async (userInfo: SignInUserInfo) => {
  const res = await instance.post("/auth/login", userInfo);
  console.log(res.data.token);
  await storeToken(res.data.token);
  return res;
};

const getCategories = async () => {
  const res = await instance.get("/catagory");
  return res.data;
};

export { getCategories, signIn, signUp };
