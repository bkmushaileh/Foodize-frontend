import instance from ".";
import BASE_URL from "./baseurl";

const getAllRecipes = async () => {
  const res = await instance.get(`${BASE_URL}/api/recipe`);
  console.log(res.data);
  return res.data;
};

export { getAllRecipes };
