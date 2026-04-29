# Render デプロイ準備メモ

このファイルは、life-simulator を Render にデプロイするために
今回入れた設定と、Render 側で用意するものをまとめたメモです。

## まず何からやるか

Render では次の順番で進めるのが分かりやすいです。

1. Render Postgres を作る
2. Rails バックエンドを Web Service としてデプロイする
3. React フロントを Static Site としてデプロイする

フロントは最終的にバックエンドの本番 URL を参照するため、
先にバックエンドの公開 URL を確定させるのが進めやすいです。

## 今回追加したファイル

- [render.yaml](/Users/masafumi/study_runteq/卒業制作/life-simulator/render.yaml)
- [back/bin/render-build.sh](/Users/masafumi/study_runteq/卒業制作/life-simulator/back/bin/render-build.sh)

## 今回変更した本番設定

### 1. `back/config/database.yml`

production は Render Postgres が提供する `DATABASE_URL` をそのまま使うようにしました。

理由:

- Render では DB 接続 URL を環境変数で渡すのが基本
- 初回デプロイで複数 DB 接続を持ち込まないほうが安定する

### 2. `back/config/environments/production.rb`

初回デプロイでは `Solid Cache` / `Solid Queue` を本番で使わず、
次のシンプルな設定にしています。

- cache: `:memory_store`
- Active Job: `:async`

理由:

- Rails 8 の `solid_*` を最初から本番で有効にすると DB 構成が少し複雑になる
- まずは Render 上で API を安定して公開することを優先したい

今後必要になったら、この部分は改めて Postgres ベースの構成へ戻せます。

## `render.yaml` でやっていること

`render.yaml` では、次の 3 つをまとめて定義しています。

1. `life-simulator-db`
   Render Postgres データベース

2. `life-simulator-back`
   Rails API 用の Ruby Web Service

3. `life-simulator-front`
   React + Vite 用の Static Site

### バックエンド設定の要点

- `rootDir: back`
  monorepo の `back` ディレクトリをサービスのルートとして使う

- `buildCommand: ./bin/render-build.sh`
  gem install や bootsnap precompile、migration をまとめて実行する

- `startCommand: bundle exec puma -C config/puma.rb`
  本番サーバーとして Puma を起動する

- `healthCheckPath: /up`
  Render のヘルスチェック先を Rails の `/up` に合わせる

### フロント設定の要点

- `rootDir: front`
  monorepo の `front` ディレクトリをサービスのルートとして使う

- `buildCommand: npm install && npm run build`
  本番配信用の静的ファイルを `dist` に生成する

- `staticPublishPath: dist`
  Render が公開する静的ファイルの場所

- `routes`
  `react-router` のようなクライアントルーティングでも画面遷移できるよう、
  `/*` を `/index.html` に rewrite している

## Render 側で設定する環境変数

### バックエンド

- `RAILS_ENV`
  `production`

- `DATABASE_URL`
  Render Postgres から自動注入

- `RAILS_MASTER_KEY`
  `back/config/master.key` の中身を Render Dashboard で手動入力

- `WEB_CONCURRENCY`
  `2`

- `RAILS_LOG_LEVEL`
  `info`

### フロント

- `VITE_API_BASE_URL`
  バックエンドの Render URL を設定する

例:

```text
https://life-simulator-back.onrender.com
```

## デプロイ時の注意

### 1. Free プランでは migration の置き場所に注意

Render の docs では、Free プランでは `pre-deploy command` が使えないため、
migration を build 時に行う形でもよいと案内されています。

そのため、今回は `back/bin/render-build.sh` の中で `bundle exec rails db:migrate`
を実行しています。

### 2. `RAILS_MASTER_KEY` は必須

Rails credentials を使っているため、これを入れないと production 起動できません。

### 3. フロントの API 接続先は本番 URL にする

ローカル開発時の `http://localhost:3000` のままだと、
Render に上げたフロントから本番 API を呼べません。

そのため、フロント側で API 呼び出しを実装するときは
`import.meta.env.VITE_API_BASE_URL` を参照する形に寄せるのが基本です。

## 次にやること

1. Render に Blueprint として `render.yaml` を読み込ませる
2. `RAILS_MASTER_KEY` を設定する
3. バックエンドのデプロイ成功を確認する
4. バックエンドの公開 URL を確認する
5. フロントの `VITE_API_BASE_URL` にその URL を設定する
6. フロントをデプロイする
