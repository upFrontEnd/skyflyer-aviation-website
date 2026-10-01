import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  root: '.',
  publicDir: 'public',
  plugins: [vue()],
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler'
      }
    }
  },
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Deux points d'entrée = deux applications Vue indépendantes dans le
    // même build : chacune obtient son propre JS/CSS. Le site public
    // (index.html) ne charge jamais le code de l'admin (admin.html), et
    // inversement — pas besoin de vue-router pour séparer les deux, c'est
    // Vite qui fait la séparation au niveau du build.
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        admin: fileURLToPath(new URL('./admin.html', import.meta.url))
      }
    }
  }
})
