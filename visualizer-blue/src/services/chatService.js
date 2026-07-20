import axios from "axios";

const API_URL = "http://localhost:3000";

export const sendMessage = async (message) => {
  const response = await axios.post(`${API_URL}/chat`, {
    message,
  });

  return response.data.reply;
};
