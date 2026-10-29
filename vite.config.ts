import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import tailwindcss from "@tailwindcss/vite";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import Icons from "unplugin-icons/vite";
import svgLoader from "vite-svg-loader";
import { vitePluginFakeServer } from "vite-plugin-fake-server";

const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig(({ command, mode, isPreview }) => {
  const env = loadEnv(mode, root, "");
  return {
    root,
    base: env.VITE_PUBLIC_PATH || "/",
    resolve: {
      alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) }
    },
    plugins: [
      tailwindcss(),
      vue(),
      vueJsx(),
      VueI18nPlugin({
        include: [fileURLToPath(new URL("./locales/**", import.meta.url))]
      }),
      svgLoader(),
      Icons({ compiler: "vue3", scale: 1 }),
      command === "serve" && !isPreview && env.VITE_USE_MOCK === "true"
        ? vitePluginFakeServer({
            logger: false,
            include: "mock",
            infixName: false,
            enableProd: false
          })
        : null
    ],
    server: {
      host: "127.0.0.1",
      proxy: env.API_PROXY_TARGET
        ? { "/api": { target: env.API_PROXY_TARGET, changeOrigin: true } }
        : undefined
    },
    build: {
      rolldownOptions: {
        output: {
          entryFileNames: "assets/[name]-[hash].js",
          chunkFileNames: "assets/[name]-[hash].js",
          assetFileNames: "assets/[name]-[hash][extname]"
        }
      }
    }
  };
});
