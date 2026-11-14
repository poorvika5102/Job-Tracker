import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Requests to /api go to the Django server, so the browser sees one origin and CORS is not needed.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: { "/api": "http://127.0.0.1:8000" },
  },
});
