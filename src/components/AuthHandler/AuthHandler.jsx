import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/auth.service";
import socket, { setUserOnline } from "../../configs/socket/socket";
import Toast from "../../utils/Toast";

const AuthHandler = ({ setCurrentUser }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const initializeUser = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (storedUser) {
        try {
          const userResponse = await authService.getCurrentUser();
          const user = userResponse?.data?.user || storedUser;
          setCurrentUser(user);
          setUserOnline(user.id || user._id);
          if (!Array.isArray(user.skills) || user.skills.length === 0) {
            navigate("/profile"); // Điều hướng hợp lý hơn đến trang đăng nhập
            Toast.fire({
              icon: "error",
              title: "Vui lòng cập nhật kĩ năng để bắt đầu sử dụng!"
            });
          }
        } catch (error) {
          console.error("Error verifying user:", error);
          localStorage.removeItem("user");
        }
      } else {
        navigate("/"); // Điều hướng hợp lý hơn đến trang đăng nhập
      }
    };

    socket.on("connect", () => {
      console.log("App connected to socket");
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        setUserOnline(storedUser.id || storedUser._id);
      }
    });

    socket.on("receive-notify-book-appointment", (data) => {
      Toast.fire({
        icon: "info",
        title: data.message || "Bạn có 1 cuộc hẹn mới!"
      });
    });

    initializeUser();

    return () => {
      socket.off("connect");
      socket.off("receive-notify-book-appointment");
    };
  }, [navigate]);

  return null; // Vì component này không render UI
};

export default AuthHandler;
