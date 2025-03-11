import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:5008/api/connections/";
const auth_Header = authHeader();

const getFriends = async () => {
  const response = await axios.get(API_URL + "friends", {
        headers: authHeader(),
  });
  return response.data.data;
};

// Lấy danh sách yêu cầu mới (người khác gửi cho mình)
const getNewRequests = async (userId) => {
    const response = await axios.get(API_URL + "waiting", {
      headers: auth_Header,
    });
  
    return response.data.data.receivedRequests.filter(
      (req) => req.receiverId._id === userId
    );
};
  
// Lấy danh sách yêu cầu mình đã gửi đi (chờ phản hồi)
const getSentRequests = async () => {
    const response = await axios.get(API_URL + "sent", {
      headers: auth_Header,
    });
  
    return response.data.data.sentRequests;
};

const getAvatarUser = async (userId) => {
    const response = await axios.get(`http://localhost:5008/api/users/profile/image/${userId}`, {
      headers: auth_Header,
    });
    return response.data;
};

const connectionService = {
  getFriends,
  getAvatarUser,
  getNewRequests,
  getSentRequests 
};

export default connectionService;