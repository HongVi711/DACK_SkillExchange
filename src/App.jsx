import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound"; // Trang 404 (Tùy chọn)
import Layout from "./components/Layout"; // Layout chứa header, footer
import Register from "./pages/Register";
import Profile from "./pages/Profile";

function App() {
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
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} /> {/* Route cho trang 404 */}
      </Routes>
    </Router>
  );
}

export default App;
