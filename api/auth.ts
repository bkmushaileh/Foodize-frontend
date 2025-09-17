import { SignInUserInfo } from "@/data/userInfo";
import instance from ".";
import { getToken, storeToken } from "./storage";

const signUp = async (userInfo: FormData) => {
  console.log(userInfo);
  const res = await instance.post("/auth/signup", userInfo);
  await storeToken(res.data.token);
  console.log(res.data);

  return res;
};

const signIn = async (userInfo: SignInUserInfo) => {
  const res = await instance.post("/auth/signin", userInfo);
  console.log(res.data.token);
  await storeToken(res.data.token);
  return res;
};

const getCategories = async () => {
  const res = await instance.get("/category");
  return res.data;
};

const createCategory = async (name: string) => {
  const res = await instance.post("/category", { name });
  return res.data;
};

const getAllRecipes = async () => {
  const res = await instance.get("/recipes");
  return res.data;
};
const createIngredient = async (name: string) => {
  const res = await instance.post("/ingredient", { name });
  return res.data;
};
const getAllIngredient = async () => {
  const res = await instance.get("/ingredient");
  return res.data;
};

const getProfile = async () => {
  try {
    const token = await getToken();
    if (!token) {
      return console.log("No Token Found!");
    }
    const res = await instance.get(`/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(res.data);
    return res.data;
  } catch (error) {}
};

export {
  createCategory,
  createIngredient,
  getAllIngredient,
  getAllRecipes,
  getCategories,
  getProfile,
  signIn,
  signUp,
};
