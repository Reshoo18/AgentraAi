import api from "../utils/axios.js";

export const createOrder = async ({ plan }) => {
  try {
    const { data } = await api.post(
      "/api/billing/create",
      { plan }
    );

    console.log("CREATE ORDER:", data);

    return data;
  } catch (error) {
    console.log(
      "CREATE ORDER ERROR:",
      error.response?.data || error
    );

    throw error;
  }
};