import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";

// フロントエンドのエントリーポイントです。
// ここでグローバル CSS を読み込み、Router を有効にした上で
// アプリ本体を `#root` へ描画しています。
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
