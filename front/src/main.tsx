import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import { enableMocking } from "@/mocks/enableMocking";

// フロントエンドのエントリーポイントです。
// ここでグローバル CSS と必要に応じた開発用モックを読み込み、
// アプリ本体を `#root` へ描画しています。
enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
