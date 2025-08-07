import axios from "axios";

const API_BASE_URL = "http://localhost:8000"; // FastAPI server

export const subscribeUser = async (data) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/subscribe`, data);
    return res.data;
  } catch (err) {
    console.error("Subscription failed:", err);
    throw err;
  }
};
