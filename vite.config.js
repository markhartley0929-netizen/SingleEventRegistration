import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      // Redirects all /api calls to your local Azure Functions
      "/api": {
        target: "http://localhost:7071",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});