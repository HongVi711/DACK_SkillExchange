import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import authService from "../../services/auth.service";
import socket, { setUserOnline } from "../../configs/socket/socket";
import Toast from "../../utils/Toast";
import Loading from "../Loading";

const AuthHandler = ({ setCurrentUser, children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      // Cho phép truy cập trang chủ mà không cần kiểm tra storedUser
      if (location.pathname === "/") {
        setIsLoading(false);
        return;
      }

      // Loại trừ trang reset-password (nếu cần)
      if (location.pathname.includes("/reset-password")) {
        setIsLoading(false);
        return;
      }

      const storedUser = JSON.parse(localStorage.getItem("user"));

      // Nếu không có storedUser và không phải trang chủ, điều hướng về "/"
      if (!storedUser) {
        Toast.fire({
          icon: "error",
          title: "Vui lòng đăng nhập để thực hiện chức năng này!"
        });
        navigate("/");
        setIsLoading(false);
        return;
      }

      // Logic xử lý khi có storedUser
      try {
        const userResponse = await authService.getCurrentUser();
        const user = userResponse?.data?.user || storedUser;

        setCurrentUser(user);
        setUserOnline(user.id || user._id);

        if (!Array.isArray(user.skills) || user.skills.length === 0) {
          navigate("/profile");
          Toast.fire({
            icon: "error",
            title: "Vui lòng cập nhật kĩ năng để bắt đầu sử dụng!"
          });
        }
      } catch (error) {
        console.error("Error verifying user:", error);
        localStorage.removeItem("user");
        setCurrentUser(null);
        navigate("/"); // Điều hướng về trang chủ nếu xác minh thất bại
      }
      setIsLoading(false); // Đánh dấu là đã load xong
    };

    socket.on("connect", () => {
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
  }, [navigate, setCurrentUser, location.pathname]); // Dependency array có location.pathname

  if (isLoading) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}
      >
        <Loading />
      </div>
    );
  }

  return children; // Render Routes khi đã load xong
};

export default AuthHandler;
