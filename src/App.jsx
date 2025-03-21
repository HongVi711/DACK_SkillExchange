import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
import { useState } from "react";
import AuthHandler from "./components/AuthHandler";
import AdminDashboard from "./pages/admin";
import ProtectedRoute from "./components/ProtectRouter";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <Router>
      <AuthHandler setCurrentUser={setCurrentUser}>
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
          <Route
            path="/admin"
            element={
              <ProtectedRoute currentUser={currentUser}>
                <Layout>
                  <AdminDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthHandler>
    </Router>
  );
}

export default App;
