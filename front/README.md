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

## 補足

フロントからバックエンド API を呼ぶときは、Docker ネットワーク内では `http://back:3000`、
ブラウザからは通常 `http://localhost:3000` を意識することになります。
今後 API 呼び出しを実装するときは、この差を吸収する設定を追加していく予定です。
