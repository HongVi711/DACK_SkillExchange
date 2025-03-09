import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css"; //Dùng cài font chữ
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
