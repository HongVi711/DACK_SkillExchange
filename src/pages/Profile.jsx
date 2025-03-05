import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import authService from "../services/auth.service";
import Toast from "../utils/Toast";
import Loading from "../components/Loading";
import userService from "../services/user.service";

function Profile() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const initialUser = state?.user;
  const [userData, setUserData] = useState(initialUser);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    skills: [],
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const requests = [authService.getAvatar()];
        if (!initialUser) {
          requests.push(authService.getCurrentUser());
        }

        const responses = await Promise.all(requests);
        const avatarResponse = responses[0];
        const userResponse = responses[1];

        if (avatarResponse?.data?.image) {
          setAvatar(avatarResponse.data.image);
        }
        const user = userResponse?.data?.user || initialUser;
        if (user) {
          setUserData(user);
          setFormData({
            name: user.name || "",
            phone: user.phone || "",
            address: user.address || "",
            skills: user.skills || [],
          });
        } else {
          navigate(`/`);
          throw new Error(
            "Không thể lấy thông tin người dùng. Vui lòng đăng nhập."
          );
        }
      } catch (error) {
        console.log("Lỗi khi lấy dữ liệu:", error);
        setError(error.message || "Đã xảy ra lỗi khi tải dữ liệu.");
        if (
          error.response?.status === 401 ||
          error.message.includes("đăng nhập")
        ) {
          navigate("/");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [initialUser, navigate]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setLoading(true);
        const reader = new FileReader();
        reader.onload = (e) => setAvatar(e.target.result);
        reader.readAsDataURL(file);

        const formData = new FormData();
        formData.append("photo", file);
        const response = await authService.uploadAvatar(formData);

        if (response?.data?.image) {
          setAvatar(response.data.image);
          Toast.fire({
            icon: "success",
            title: "Cập nhật ảnh đại diện thành công!",
          });
        }
      } catch (error) {
        console.error("Lỗi khi upload avatar:", error);
        Toast.fire({
          icon: "error",
          title: "Cập nhật ảnh thất bại!",
        });
        setAvatar(userData.avatar || null);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (["name", "phone", "address"].includes(name)) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSkillChange = (index, value) => {
    const newSkills = [...formData.skills];
    newSkills[index] = value;
    setFormData((prev) => ({ ...prev, skills: newSkills }));
  };

  const handleAddSkill = () => {
    const newSkills = [...formData.skills, ""];
    setFormData((prev) => ({ ...prev, skills: newSkills }));
  };

  const handleRemoveSkill = (index) => {
    const newSkills = formData.skills.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, skills: newSkills }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const userInfo = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      };
      const skills = formData.skills;

      const [userResponse, skillsResponse] = await Promise.all([
        userService.updateUser(userInfo),
        userService.updateUserSkills({ skills }),
      ]);

      if (userResponse?.data?.data.user && skillsResponse?.data?.data.user) {
        const updatedUser = {
          ...userResponse.data.data.user,
          skills: skillsResponse.data.data.user.skills,
        };
        setUserData(updatedUser);
        setFormData({
          name: updatedUser.name || "",
          phone: updatedUser.phone || "",
          address: updatedUser.address || "",
          skills: updatedUser.skills,
        });
        setIsEditing(false);
        Toast.fire({
          icon: "success",
          title: "Cập nhật thông tin thành công!",
        });
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error:", error);
      Toast.fire({
        icon: "error",
        title: "Cập nhật thông tin thất bại!",
      });
    } finally {
      setLoading(false);
    }
  };

  // Trong component (inline CSS)
  if (loading) {
    return (
      <div
        style={{
          position: "fixed",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 9999,
        }}
      >
        <div>
          <Loading />
        </div>
      </div>
    );
  }
  if (error) return Toast.fire({ icon: "error", title: error });

  return (
    <div className="p-8 flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg">
        <div className="profile-card bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="relative w-36 h-36 mx-auto mb-5">
            <img
              src={
                avatar ||
                "https://i.pinimg.com/736x/b1/b5/6b/b1b56b9e9b21ad32cff1028882cb8245.jpg"
              }
              alt="Ảnh đại diện"
              className="profile-pic w-36 h-36 rounded-full object-cover"
            />
            <div
              className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
              onClick={() => fileInputRef.current.click()}
            ></div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          {isEditing ? (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="text-2xl font-semibold text-gray-800 mb-2 border rounded p-1"
            />
          ) : (
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">
              {userData.name ?? "No Name"}
            </h1>
          )}

          <hr />
          <div className="info mb-5 text-left">
            <h2 className="text-xl font-medium text-gray-800 mb-2">
              Thông tin cá nhân
            </h2>
            <p className="text-gray-700">
              <strong>Email:</strong> {userData.email ?? "NoEmail@gmail.com"}
            </p>
            {isEditing ? (
              <>
                <p className="text-gray-700 mb-2">
                  <strong>Số điện thoại:</strong>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="border rounded p-1 ml-2 w-3/4"
                  />
                </p>
                <p className="text-gray-700">
                  <strong>Địa chỉ:</strong>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="border rounded p-1 ml-2 w-3/4"
                  />
                </p>
              </>
            ) : (
              <>
                <p className="text-gray-700">
                  <strong>Số điện thoại:</strong>{" "}
                  {userData.phone ?? "0123 456 789"}
                </p>
                <p className="text-gray-700">
                  <strong>Địa chỉ:</strong>{" "}
                  {userData.address ?? "Hà Nội, Việt Nam"}
                </p>
              </>
            )}
          </div>

          <hr />
          <div className="skills mb-5 text-left">
            <h2 className="text-xl font-medium text-gray-800 mb-2">Kỹ năng</h2>
            {isEditing ? (
              <>
                <ul className="space-y-2">
                  {formData.skills.map((skill, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={skill.name}
                        onChange={(e) =>
                          handleSkillChange(index, e.target.value)
                        }
                        className="bg-gray-200 p-2 rounded-md flex-grow"
                      />
                      <button
                        onClick={() => handleRemoveSkill(index)}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Xóa
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleAddSkill}
                  className="mt-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Thêm kỹ năng
                </button>
              </>
            ) : (
              <ul className="space-y-2">
                {userData?.skills?.map((skill, index) => (
                  <li key={index} className="bg-gray-200 p-2 rounded-md">
                    {skill.name}
                  </li>
                )) || <li>Không có kỹ năng nào</li>}
              </ul>
            )}
          </div>

          <div className="contact text-left">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="inline-block px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors mr-2"
                >
                  Lưu
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: userData.name || "",
                      phone: userData.phone || "",
                      address: userData.address || "",
                      skills: userData.skills || [],
                    });
                  }}
                  className="inline-block px-5 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Hủy
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-block px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Chỉnh sửa thông tin
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
