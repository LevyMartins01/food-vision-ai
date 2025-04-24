
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc"; // Mantém o plugin que você usa
import path from "path";
import { componentTagger } from "lovable-tagger"; // Mantém o tagger do Lovable

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: { // Sua configuração 'server' existente
    host: "::",
    port: 8080,
  },
  plugins: [ // Sua configuração 'plugins' existente
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: { // Sua configuração 'resolve' existente
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // --- MODIFICANDO A SEÇÃO 'preview' ---
  preview: {
    allowedHosts: [
      'cloud-test-nodejs.r4loq5.easypanel.host', // Mantenha o host anterior do EasyPanel
      '609ae657-5817-4d7d-b96a-f7b4d521e748.lovableproject.com', // Adicionando o host bloqueado
      'foodcamai.com',                          // Mantendo seu domínio
      'www.foodcamai.com'                       // Mantendo o www
    ]
    // Não precisa definir host/port aqui, pois o Procfile já faz isso
  }
  // --- FIM DA SEÇÃO MODIFICADA ---
}));
