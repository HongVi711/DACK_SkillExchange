import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:5008/api/chats/";

const chatService = {
  getChatRoom: async (chatRoomId) => {
    try {
      const response = await axios.get(`${API_URL}${chatRoomId}`, {
        headers: authHeader()
      });
      return response.data; // Trả về trực tiếp dữ liệu
    } catch (error) {
      console.error("Lỗi khi lấy chatroomid:", error);
      throw error; // Re-throw lỗi để component xử lý
    }
  },

  getMessages: async (chatRoomId) => {
    try {
      const response = await axios.get(`${API_URL}${chatRoomId}/messages`, {
        headers: authHeader()
      });
      return response?.data; // Trả về trực tiếp dữ liệu
    } catch (error) {
      console.error("Lỗi khi lấy tin nhắn:", error);
      throw error; // Re-throw lỗi để component xử lý
    }
  },

  sendMessage: async (formData) => {
    try {
      const response = await axios.post(`${API_URL}send`, formData, {
        headers: {
          ...authHeader(), // Giữ lại header xác thực
          "Content-Type": "multipart/form-data" // Quan trọng: Báo cho server biết đang gửi FormData
        }
      });
      return response?.data; // Trả về trực tiếp dữ liệu
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
      throw error; // Re-throw lỗi để component xử lý
    }
  },

  // Hàm base để xử lý request (ví dụ)
  _request: async (method, url, data = null) => {
    try {
      const config = {
        headers: authHeader()
      };
      const response = await axios({
        method,
        url: `${API_URL}${url}`,
        data,
        ...config
      });
      return response.data;
    } catch (error) {
      console.error(`Lỗi request ${method} ${url}:`, error);
      throw error;
    }
  }
};

export default chatService;
