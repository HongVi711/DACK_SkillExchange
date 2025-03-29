import { defineConfig } from "vite";
import fs from "fs";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync("key.pem"), // Đường dẫn đến key.pem
      cert: fs.readFileSync("cert.pem") // Đường dẫn đến cert.pem
    },
    host: "0.0.0.0", // Cho phép truy cập từ thiết bị khác
    port: 5173
  },
  plugins: [react()]
});
