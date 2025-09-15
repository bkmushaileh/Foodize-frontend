import instance from ".";

const getUsers = async () => {
  const res = await instance.get("/user");

  return res.data;
};

export { getUsers };
