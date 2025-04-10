import { defineConfig } from "vite";
import fs from "fs";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => {
  const isDev = command === "serve"; // "serve" là khi chạy `npm run dev`

  return {
    plugins: [react()],
    server: isDev
      ? {
          https: {
            key: fs.readFileSync("key.pem"),
            cert: fs.readFileSync("cert.pem")
          },
          host: "0.0.0.0",
          port: 5173
        }
      : undefined // bỏ server config khi build/deploy
  };
});
