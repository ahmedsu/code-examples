import { apiRequest } from "utils/helperFunctions";

export const getPromos = async () => {
  try {
    const res = await apiRequest({
      method: "get",
      url: "promos",
    });
    return res.data;
  } catch (e) {
    console.log("Error fetching promos");
    console.log(e);
    return null;
  }
};
