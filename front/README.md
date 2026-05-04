# Frontend Overview

このディレクトリは、生活シミュレーターのフロントエンドです。
React + TypeScript + Vite を使い、開発中は `docker compose` から
Vite 開発サーバーとして起動する想定です。

## 役割

- ブラウザから表示される UI を担当する
- 今後は Rails API からデータを取得し、画面へ反映する
- 開発中は HMR により、保存した変更を素早くブラウザへ反映する

## 主なファイル

- `src/main.tsx`
  React アプリのエントリーポイントです。Router を有効にして描画を始めます。

- `src/App.tsx`
  画面ルーティングの定義です。ページが増えたらここにルートを追加します。

- `src/pages/TopPage.tsx`
  現在のトップページです。今後の UI 実装の起点になります。

- `src/index.css`
  Tailwind / shadcn のテーマや全体スタイルをまとめています。

- `vite.config.ts`
  Vite の開発設定です。Docker 上で保存検知しやすいように polling も有効化しています。

- `Dockerfile.dev`
  `docker compose` からフロントを起動するための開発用 Dockerfile です。

## 開発時の起動

ルートディレクトリで次を実行します。

```bash
docker compose up --build
```

起動後、フロントは次で確認できます。

```text
http://localhost:5173
```

## 保存時反映について

このフロントエンドでは、追加の「監視専用のビルドコマンド」を別で用意する必要はありません。

理由は、`docker compose up --build` で起動される
`npm run dev` が、Vite の開発サーバーとして次の役割をまとめて担当するためです。

- ファイル変更の監視
- 開発中の再ビルド
- HMR によるブラウザへの即時反映

つまり、普段の開発では `npm run dev` がそのまま「watch 相当」の役割も持っています。
そのため、保存した内容を反映したいだけなら、追加の watch コマンドは不要です。修正して保存したものがそのまま反映されます。

## API 接続先について

フロントは環境ごとに次の考え方でバックエンドへ接続します。

- 開発環境
  `VITE_API_BASE_URL` を使わず、相対パスの `/api/...` を Vite proxy が Rails へ中継します。

- 本番環境
  Render の `life-simulator-front-prod` に設定した `VITE_API_BASE_URL` を使います。

- ステージング環境
  Render の `life-simulator-front-stg` に設定した `VITE_API_BASE_URL` を使います。

開発環境ではブラウザが `http://back:3000` を直接解決できないため、
docker compose では front コンテナ側の Vite サーバーが `back` へ中継する形にしています。

## 補足

フロントからバックエンド API を呼ぶ実装は
[src/lib/api.ts](/Users/masafumi/study_runteq/卒業制作/life-simulator/front/src/lib/api.ts:1)
にまとめています。
