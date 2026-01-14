import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // Importez tailwindcss

export default defineConfig({
  plugins: [
    tailwindcss(), // Ajoutez le plugin tailwindcss ici
    react()
],
})