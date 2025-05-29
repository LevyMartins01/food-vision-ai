
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  preview: {
    allowedHosts: [
      'cloud-test-nodejs.r4loq5.easypanel.host',
      '609ae657-5817-4d7d-b96a-f7b4d521e748.lovableproject.com',
      'foodcamai.com',
      'www.foodcamai.com'
    ]
  }
}));
