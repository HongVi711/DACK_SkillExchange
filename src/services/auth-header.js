// src/services/auth-header.js
export default function authHeader() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    return { Authorization: "Bearer " + user }; // for Spring Boot back-end
    // return { "x-access-token": user.token }; // for Node.js Express back-end
  } else {
    return {};
  }
}
