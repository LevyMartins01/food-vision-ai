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
  // --- MODIFIQUE A SEÇÃO 'preview' AQUI ---
  preview: {
    allowedHosts: [
      'cloud-test-nodejs.r4loq5.easypanel.host', // Mantenha o host anterior do EasyPanel
      'foodcamai.com',                          // <<< ADICIONE SEU DOMÍNIO AQUI
      'www.foodcamai.com'                       // <<< ADICIONE O WWW TAMBÉM (BOA PRÁTICA)
    ]
    // Não precisa definir host/port aqui, pois o Procfile já faz isso.
    // Apenas allowedHosts é crucial para corrigir o erro.
  }
  // --- FIM DA SEÇÃO MODIFICADA ---
}));
