import { Lock, Trash, UserCheck } from "lucide-react";
import Swal from "sweetalert2";
import adminService from "../../services/admin.service";

const UserManagement = ({ users }) => {
  // Add state to manage users

  // Handler for suspending/locking a user
  const handleLockUser = (userId) => {};

  // Handler for deleting a user
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
            swalWithBootstrapButtons.fire({
              title: response.message,
              text: "User đã được xoá khỏi hệ thống.",
              icon: "success"
            });
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

  // Handler for verifying a user
  const handleVerifyUser = (userId) => {};

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
            <p className="text-gray-600">Violations: {user.violations}</p>
            <p className="text-gray-600">Role: {user.role}</p>
            {user.isLocked && <p className="text-red-600">Account Locked</p>}
            {user.isVerified && <p className="text-green-600">Verified</p>}
          </div>
          <div>
            <button
              className={`px-3 py-2 ${
                user.isLocked ? "bg-green-500" : "bg-yellow-500"
              } text-white rounded mr-2`}
              onClick={() => handleLockUser(user._id)}
              title={user.isLocked ? "Unlock User" : "Lock User"}
            >
              <Lock size={16} />
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
                user.isVerified ? "bg-gray-500" : "bg-blue-500"
              } text-white rounded mr-2`}
              onClick={() => handleVerifyUser(user._id)}
              title={user.isVerified ? "Remove Verification" : "Verify User"}
            >
              <UserCheck size={16} />
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

export default UserManagement;
