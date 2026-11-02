import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite"; // Importez tailwindcss

export default defineConfig(({ command }) => ({
  plugins: [
    tailwindcss(), // Ajoutez le plugin tailwindcss ici
    react(),
  ],
  base: command === "build" ? "/weeb_sylvain_zanini/" : "/",
}));
