// vite.config.js
import { defineConfig } from "file:///D:/Dropbox/LAB%20-%20FORMATION/SIMULATION/skyflyer-aviation-website/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/Dropbox/LAB%20-%20FORMATION/SIMULATION/skyflyer-aviation-website/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { fileURLToPath, URL } from "node:url";
var __vite_injected_original_import_meta_url = "file:///D:/Dropbox/LAB%20-%20FORMATION/SIMULATION/skyflyer-aviation-website/vite.config.js";
var vite_config_default = defineConfig({
  root: ".",
  base: process.env.GITHUB_ACTIONS ? "/skyflyer-aviation-website/" : "/",
  publicDir: "public",
  plugins: [vue()],
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        api: "modern-compiler"
      }
    }
  },
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    // Deux points d'entrée = deux applications Vue indépendantes dans le
    // même build : chacune obtient son propre JS/CSS. Le site public
    // (index.html) ne charge jamais le code de l'admin (admin.html), et
    // inversement — pas besoin de vue-router pour séparer les deux, c'est
    // Vite qui fait la séparation au niveau du build.
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL("./index.html", __vite_injected_original_import_meta_url)),
        admin: fileURLToPath(new URL("./admin.html", __vite_injected_original_import_meta_url))
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxEcm9wYm94XFxcXExBQiAtIEZPUk1BVElPTlxcXFxTSU1VTEFUSU9OXFxcXHNreWZseWVyLWF2aWF0aW9uLXdlYnNpdGVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXERyb3Bib3hcXFxcTEFCIC0gRk9STUFUSU9OXFxcXFNJTVVMQVRJT05cXFxcc2t5Zmx5ZXItYXZpYXRpb24td2Vic2l0ZVxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovRHJvcGJveC9MQUIlMjAtJTIwRk9STUFUSU9OL1NJTVVMQVRJT04vc2t5Zmx5ZXItYXZpYXRpb24td2Vic2l0ZS92aXRlLmNvbmZpZy5qc1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGgsIFVSTCB9IGZyb20gJ25vZGU6dXJsJ1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICByb290OiAnLicsXG4gIGJhc2U6IHByb2Nlc3MuZW52LkdJVEhVQl9BQ1RJT05TID8gJy9za3lmbHllci1hdmlhdGlvbi13ZWJzaXRlLycgOiAnLycsXG4gIHB1YmxpY0RpcjogJ3B1YmxpYycsXG4gIHBsdWdpbnM6IFt2dWUoKV0sXG4gIGNzczoge1xuICAgIGRldlNvdXJjZW1hcDogdHJ1ZSxcbiAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG4gICAgICBzY3NzOiB7XG4gICAgICAgIGFwaTogJ21vZGVybi1jb21waWxlcidcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIHBvcnQ6IDUxNzMsXG4gICAgb3BlbjogdHJ1ZVxuICB9LFxuICBidWlsZDoge1xuICAgIG91dERpcjogJ2Rpc3QnLFxuICAgIGFzc2V0c0RpcjogJ2Fzc2V0cycsXG4gICAgLy8gRGV1eCBwb2ludHMgZCdlbnRyXHUwMEU5ZSA9IGRldXggYXBwbGljYXRpb25zIFZ1ZSBpbmRcdTAwRTlwZW5kYW50ZXMgZGFucyBsZVxuICAgIC8vIG1cdTAwRUFtZSBidWlsZCA6IGNoYWN1bmUgb2J0aWVudCBzb24gcHJvcHJlIEpTL0NTUy4gTGUgc2l0ZSBwdWJsaWNcbiAgICAvLyAoaW5kZXguaHRtbCkgbmUgY2hhcmdlIGphbWFpcyBsZSBjb2RlIGRlIGwnYWRtaW4gKGFkbWluLmh0bWwpLCBldFxuICAgIC8vIGludmVyc2VtZW50IFx1MjAxNCBwYXMgYmVzb2luIGRlIHZ1ZS1yb3V0ZXIgcG91ciBzXHUwMEU5cGFyZXIgbGVzIGRldXgsIGMnZXN0XG4gICAgLy8gVml0ZSBxdWkgZmFpdCBsYSBzXHUwMEU5cGFyYXRpb24gYXUgbml2ZWF1IGR1IGJ1aWxkLlxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIGlucHV0OiB7XG4gICAgICAgIG1haW46IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9pbmRleC5odG1sJywgaW1wb3J0Lm1ldGEudXJsKSksXG4gICAgICAgIGFkbWluOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vYWRtaW4uaHRtbCcsIGltcG9ydC5tZXRhLnVybCkpXG4gICAgICB9XG4gICAgfVxuICB9XG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE2WCxTQUFTLG9CQUFvQjtBQUMxWixPQUFPLFNBQVM7QUFDaEIsU0FBUyxlQUFlLFdBQVc7QUFGNE0sSUFBTSwyQ0FBMkM7QUFJaFMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsTUFBTTtBQUFBLEVBQ04sTUFBTSxRQUFRLElBQUksaUJBQWlCLGdDQUFnQztBQUFBLEVBQ25FLFdBQVc7QUFBQSxFQUNYLFNBQVMsQ0FBQyxJQUFJLENBQUM7QUFBQSxFQUNmLEtBQUs7QUFBQSxJQUNILGNBQWM7QUFBQSxJQUNkLHFCQUFxQjtBQUFBLE1BQ25CLE1BQU07QUFBQSxRQUNKLEtBQUs7QUFBQSxNQUNQO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDUixXQUFXO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBTVgsZUFBZTtBQUFBLE1BQ2IsT0FBTztBQUFBLFFBQ0wsTUFBTSxjQUFjLElBQUksSUFBSSxnQkFBZ0Isd0NBQWUsQ0FBQztBQUFBLFFBQzVELE9BQU8sY0FBYyxJQUFJLElBQUksZ0JBQWdCLHdDQUFlLENBQUM7QUFBQSxNQUMvRDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
