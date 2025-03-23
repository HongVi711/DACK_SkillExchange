
import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:5008/api/connections/";


const connectionService = {
  sendRequest: async (receiverId) => {
    return await axios.post(
      `${API_URL}request`,
      { receiverId },
      { headers: authHeader() }
    );
  },

  
  acceptRequest: async (connectionId) => {
    return await axios.put(`${API_URL}${connectionId}/accept`, {}, {
      headers: authHeader(),
    });
    
  },

  rejectRequest: async (connectionId) => {
    return await axios.put(`${API_URL}${connectionId}/reject`, {}, {
      headers: authHeader(),
    });
  },

  cancelRequest: async (receiverId) => {
    return await axios.delete(`${API_URL}cancel/${receiverId}`, {
      headers: authHeader(),
    });
  },

  checkConnectionStatus: async (userId) => {
    return await axios.get(`${API_URL}status/${userId}`, {
      headers: authHeader(),
    });
  },
};

  
export default connectionService;