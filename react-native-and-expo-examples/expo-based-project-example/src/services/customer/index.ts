import { apiRequest } from "utils/helperFunctions";
import { UpdateAccountBody } from "./types";

export const getAllResults = async () => {
  try {
    const res = await apiRequest({
      method: "get",
      url: "results",
    });
    return res.data;
  } catch (e) {
    console.log("Error fetching all results");
    console.log(e);
    return null;
  }
};

export const getAllOrders = async () => {
  try {
    const res = await apiRequest({
      method: "get",
      url: "orders",
    });
    return res.data;
  } catch (e) {
    console.log("Error fetching all orders");
    console.log(e);
    return null;
  }
};

export const getResultPDF = async (id: number) => {
  try {
    const res = await apiRequest({
      method: "get",
      url: `results-pdf/${id}`,
    });
    return res.data;
  } catch (e) {
    console.log("Error fetching result pdf");
    console.log(e);
    return null;
  }
};

export const updateAccount = async (body: UpdateAccountBody) => {
  try {
    const res = await apiRequest({
      method: "post",
      url: "account/update",
      data: body,
    });
    console.log(res.data);
    return res.data;
  } catch (e) {
    console.log("Error updating account");
    console.log(e);
    return null;
  }
};
