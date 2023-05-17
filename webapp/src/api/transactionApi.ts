/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "../api/axios";

const TRANSACTIONS_URL = "/transaction";

export const getTransactions = async () => {
  try {
    const response = await axios.get(TRANSACTIONS_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
};

export const uploadTransactions = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    await axios.post("transaction/upload", formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (err: any) {
    if (err.response && err.response.data && err.response.data.message) {
      throw new Error(err.response.data.message);
    } else {
      throw new Error("Error occurred during upload");
    }
  }
};
