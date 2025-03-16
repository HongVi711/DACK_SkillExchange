import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import authService from "./services/auth.service";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import LoginPage from "./pages/Login";
import Home from "./pages/Home";
import SearchPage from "./pages/Search";
import ChatPage from "./pages/Chat";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/ChangePassword";
import Network from "./pages/Network";
import SchedulePage from "./pages/Schedule";
import socket, { setUserOnline } from "./configs/socket/socket";
import { useEffect, useState } from "react";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    const initializeUser = async () => {
      // Check localStorage first
      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (storedUser) {
        try {
          // Verify with server if needed
          const userResponse = await authService.getCurrentUser();
          const user = userResponse?.data?.user || storedUser;
          setCurrentUser(user);
          setUserOnline(user.id || user._id); // Set online only if user exists
        } catch (error) {
          console.error("Error verifying user:", error);
          localStorage.removeItem("user"); // Clear invalid stored user
        }
      }
    };

    socket.on("connect", () => {
      console.log("App connected to socket");
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        setUserOnline(storedUser.id || storedUser._id);
      }
    });

    initializeUser();

    return () => {
      socket.off("connect");
    };
  }, []);
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/profile"
          element={
            <Layout>
              <Profile />
            </Layout>
          }
        />
        <Route
          path="/search"
          element={
            <Layout>
              <SearchPage />
            </Layout>
          }
        />
        <Route
          path="/network"
          element={
            <Layout>
              <Network />
            </Layout>
          }
        />
        <Route
          path="/calendar"
          element={
            <Layout>
              <SchedulePage />
            </Layout>
          }
        />
        <Route
          path="/chat/:chatRoomId/:userid/:name"
          element={
            <Layout>
              <ChatPage />
            </Layout>
          }
        />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFound />} /> {/* Route cho trang 404 */}
      </Routes>
    </Router>
  );
}

export default App;
