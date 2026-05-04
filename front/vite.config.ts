import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// Vite の開発・ビルド設定です。
// このプロジェクトでは React, Tailwind CSS, `@/` エイリアス、
// そして Docker 上でも安定して保存検知できる監視設定をまとめています。
const frontendDevProxyTarget = process.env.FRONTEND_DEV_PROXY_TARGET || "http://localhost:3000";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Docker bind mount 上ではネイティブ監視が拾いにくいことがあるため、
    // polling を有効にして HMR の取りこぼしを防ぎます。
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true,
    },
    // 開発中はブラウザから相対パスで API を呼び、
    // Vite サーバーが Rails へ中継することで CORS や接続先差分を吸収します。
    proxy: {
      "/api": frontendDevProxyTarget,
      "/up": frontendDevProxyTarget,
    },
  },
  resolve: {
    alias: {
      // `@/components/...` のように `src` からの絶対パスで import できるようにします。
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
