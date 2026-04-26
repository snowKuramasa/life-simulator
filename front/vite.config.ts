import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// Vite の開発・ビルド設定です。
// このプロジェクトでは React, Tailwind CSS, `@/` エイリアス、
// そして Docker 上でも安定して保存検知できる監視設定をまとめています。
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
  },
  resolve: {
    alias: {
      // `@/components/...` のように `src` からの絶対パスで import できるようにします。
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
