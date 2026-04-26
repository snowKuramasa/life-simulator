import { Route, Routes } from "react-router";

import { TopPage } from "@/pages/TopPage";

// アプリ全体のルーティング定義です。
// ページが増えたら、この `Routes` に画面ごとのルートを追加していきます。
function App() {
  return (
    <Routes>
      <Route path="/" element={<TopPage />} />
    </Routes>
  );
}

export default App;
