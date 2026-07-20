import axios from "axios";

const API_URL = "http://localhost:3000";

export const sendMessage = async (message, documentContext) => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const response = await axios.post(`${API_URL}/chat`, {
    message,
    userId: user?.id,
    documentContext: documentContext ? JSON.stringify(documentContext) : null,
  });

  return response.data.reply;
};
