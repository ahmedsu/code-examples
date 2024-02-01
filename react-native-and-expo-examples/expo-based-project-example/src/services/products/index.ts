import { apiRequest } from "utils/helperFunctions";

export const getAllProducts = async () => {
  try {
    const res = await apiRequest({
      method: "get",
      url: "products",
    });
    return res.data;
  } catch (e) {
    console.log("Error fetching all products");
    console.log(e);
    return null;
  }
};
