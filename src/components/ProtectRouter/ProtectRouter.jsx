import { Navigate } from "react-router-dom";
import Toast from "../../utils/Toast";

const ProtectedRoute = ({ children, currentUser }) => {
  const isAdmin = currentUser && currentUser.role === "admin";
  if (!isAdmin) {
    currentUser
      ? Toast.fire({
          icon: "error",
          title: "Tài khoản của bạn không đủ quyền truy cập vào đây!"
        })
      : Toast.fire({
          icon: "error",
          title: "Vui lòng đăng nhập để thực hiện chức năng này!"
        });
  }
  return isAdmin ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
