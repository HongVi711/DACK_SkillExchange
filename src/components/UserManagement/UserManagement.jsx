import { Lock, Unlock, Trash } from "lucide-react";
import Swal from "sweetalert2";
import adminService from "../../services/admin.service";
import { useState } from "react";
import { TbUserDown, TbUserUp } from "react-icons/tb";

const UserManagement = ({ users: initialUsers, onActionSuccess }) => {
  const [users, setUsers] = useState(initialUsers);

  const handleLockUser = async (userId, currentLockStatus) => {
    try {
      const newLockStatus = !currentLockStatus;
      const response = await adminService.lockUser(userId, newLockStatus);

      if (response.status) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, lock: newLockStatus } : user
          )
        );
        Swal.fire({
          title: "Success",
          text: `User account has been ${
            newLockStatus ? "locked" : "unlocked"
          }`,
          icon: "success"
        });
        if (onActionSuccess) onActionSuccess(); // Chỉ fetch lại users
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to update user lock status",
        icon: "error"
      });
    }
  };

  const handleDeleteUser = (userId) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success ml-5",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons
      .fire({
        title: "Bạn có chắc?",
        text: "Một khi đã xoá sẽ không thể khôi phục được!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const response = await adminService.deleteUser(userId);
          if (response.status) {
            setUsers((prevUsers) =>
              prevUsers.filter((user) => user._id !== userId)
            );
            swalWithBootstrapButtons.fire({
              title: response.message,
              text: "User đã được xoá khỏi hệ thống.",
              icon: "success"
            });
            if (onActionSuccess) onActionSuccess(); // Chỉ fetch lại users
          } else {
            swalWithBootstrapButtons.fire({
              title: "Lỗi!",
              text: "Có lỗi xảy ra trong quá trình xử lý!",
              icon: "error"
            });
          }
        }
      });
  };

  const handleVerifyUser = async (userId, currentRole) => {
    try {
      const newRole = currentRole === "admin" ? "user" : "admin";
      const response = await adminService.changeRole(userId, newRole);

      if (response.status) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, role: newRole } : user
          )
        );
        Swal.fire({
          title: "Success",
          text: response.message,
          icon: "success"
        });
        if (onActionSuccess) onActionSuccess(); // Chỉ fetch lại users
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to update role",
        icon: "error"
      });
    }
  };

  return (
    <>
      {users.map((user) => (
        <div
          key={user._id}
          className="p-4 bg-white rounded shadow flex justify-between items-center"
        >
          <div>
            <p className="text-lg font-semibold">{user.name}</p>
            <p className="text-gray-600">email: {user.email}</p>
            <p className="text-gray-600">Violations: {user?.reportCount}</p>
            <p className="text-gray-600">Role: {user.role}</p>
            {user.lock && <p className="text-red-600">Account Locked</p>}
          </div>
          <div>
            <button
              className={`px-3 py-2 ${
                user?.lock ? "bg-green-500" : "bg-yellow-500"
              } text-white rounded mr-2`}
              onClick={() => handleLockUser(user._id, user.lock)}
              title={user?.lock ? "Unlock User" : "Lock User"}
            >
              {user?.lock ? <Unlock size={16} /> : <Lock size={16} />}
            </button>
            <button
              className="px-3 py-2 bg-red-500 text-white rounded mr-2"
              onClick={() => handleDeleteUser(user._id)}
              title="Delete User"
            >
              <Trash size={16} />
            </button>
            <button
              className={`px-3 py-2 ${
                user.role === "admin" ? "bg-gray-500" : "bg-blue-500"
              } text-white rounded mr-2`}
              onClick={() => handleVerifyUser(user._id, user.role)}
              title={user.role === "admin" ? "Demote" : "Promote"}
            >
              {user.role === "admin" ? (
                <TbUserDown size={16} />
              ) : (
                <TbUserUp size={16} />
              )}
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

export default UserManagement;
