import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // base: '/ticket/',
  plugins: [
    react(), 
    tailwindcss(),
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        // target: 'http://ticketingbackend.go.ug/', // Adjust this to your backend server URL
        // target: 'https://admin.khosaleague.com/', // Adjust this to your backend server URL
        // target: 'http://localhost/ticketingbackend/',
        //  // Adjust this to your backend server URL
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''), // Optional: rewrite the path if needed
      },
    },

  }
})
