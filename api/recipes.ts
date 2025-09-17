import instance from ".";

const getAllRecipes = async () => {
  const res = await instance.get("/recipe");
  console.log(res.data);
  return res.data;
};

const createRecipe = async (recipeInfo: FormData) => {
  console.log(recipeInfo);
  const res = await instance.post("/recipe", recipeInfo);
  console.log(res.data);

  return res;
};
export { createRecipe, getAllRecipes };
