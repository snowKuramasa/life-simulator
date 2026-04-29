# Render デプロイ準備メモ

このファイルは、life-simulator を Render にデプロイするために
今回入れた設定と、Render 側で用意するものをまとめたメモです。

## 環境の分け方

このプロジェクトでは、Render 上で branch ごとに常設環境を分ける前提にしています。

- `main` ブランチ
  本番環境

- `development` ブランチ
  ステージング環境

そのため、Render の設定ファイルも 2 つに分けています。

- [render.yaml](/Users/masafumi/study_runteq/卒業制作/life-simulator/render.yaml)
  `main` 用の本番 Blueprint

- [render.staging.yaml](/Users/masafumi/study_runteq/卒業制作/life-simulator/render.staging.yaml)
  `development` 用のステージング Blueprint

## まず何からやるか

Render では次の順番で進めるのが分かりやすいです。

1. `main` 用 Blueprint で本番環境を作る
2. `development` 用 Blueprint でステージング環境を作る
3. それぞれの front が、同じ環境の back を見るように `VITE_API_BASE_URL` を設定する

フロントは最終的にバックエンドの本番 URL を参照するため、
先にバックエンドの公開 URL を確定させるのが進めやすいです。

## 今回追加したファイル

- [render.yaml](/Users/masafumi/study_runteq/卒業制作/life-simulator/render.yaml)
- [render.staging.yaml](/Users/masafumi/study_runteq/卒業制作/life-simulator/render.staging.yaml)
- [back/bin/render-build.sh](/Users/masafumi/study_runteq/卒業制作/life-simulator/back/bin/render-build.sh)

## 今回変更した本番設定

### 1. `back/config/database.yml`

production は Render Postgres が提供する `DATABASE_URL` をそのまま使うようにしました。
あわせて、`primary` / `cache` / `queue` / `cable` という接続名は
いったん同じ DB を向く alias にしています。

理由:

- Render では DB 接続 URL を環境変数で渡すのが基本
- 初回デプロイで複数 DB 接続を持ち込まないほうが安定する
- Rails 8 の `solid_*` 系 gem は接続名そのものを参照することがある

### 2. `back/config/environments/production.rb`

初回デプロイでは `Solid Cache` / `Solid Queue` を本番で使わず、
次のシンプルな設定にしています。

- cache: `:memory_store`
- Active Job: `:async`

理由:

- Rails 8 の `solid_*` を最初から本番で有効にすると DB 構成が少し複雑になる
- まずは Render 上で API を安定して公開することを優先したい

今後必要になったら、この部分は改めて Postgres ベースの構成へ戻せます。

### 3. `back/config/cable.yml`

初回デプロイでは `Solid Cable` も本番で使わず、
production の adapter を `async` にしています。

理由:

- `solid_cable` は `cable` 用の別 DB 設定を参照する
- 今回は Render 上でまず単一 DB 構成で確実に起動することを優先したい

## `render.yaml` / `render.staging.yaml` でやっていること

2 つの Blueprint で、branch ごとに別環境を定義しています。

### 本番用 `render.yaml`

対象 branch:

- `main`

定義しているリソース:

1. `life-simulator-db-prod`
   本番用 Render Postgres データベース

2. `life-simulator-back-prod`
   本番用 Rails API Web Service

3. `life-simulator-front-prod`
   本番用 React Static Site

### ステージング用 `render.staging.yaml`

対象 branch:

- `development`

定義しているリソース:

1. `life-simulator-db-stg`
   ステージング用 Render Postgres データベース

2. `life-simulator-back-stg`
   ステージング用 Rails API Web Service

3. `life-simulator-front-stg`
   ステージング用 React Static Site

### バックエンド設定の要点

- `branch: main` / `branch: development`
  それぞれのサービスを対象 branch へひも付ける

- `rootDir: back`
  monorepo の `back` ディレクトリをサービスのルートとして使う

- `buildCommand: ./bin/render-build.sh`
  gem install や bootsnap precompile、migration をまとめて実行する

- `startCommand: bundle exec puma -C config/puma.rb`
  本番サーバーとして Puma を起動する

- `healthCheckPath: /up`
  Render のヘルスチェック先を Rails の `/up` に合わせる

### フロント設定の要点

- `branch: main` / `branch: development`
  front も対象 branch に合わせて自動デプロイする

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
  同じ環境のバックエンド Render URL を設定する

本番の例:

```text
https://life-simulator-back-prod.onrender.com
```

ステージングの例:

```text
https://life-simulator-back-stg.onrender.com
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

また、branch ごとに環境を分ける場合は、次のように対応関係を固定します。

- `front-prod` → `back-prod`
- `front-stg` → `back-stg`

`development` のフロントが本番 API を見ないように注意します。

## Render Dashboard での作成イメージ

### 1. 本番 Blueprint

- branch: `main`
- Blueprint file path: `render.yaml`

### 2. ステージング Blueprint

- branch: `development`
- Blueprint file path: `render.staging.yaml`

Render では Blueprint のカスタムファイルパスも指定できるため、
この構成で branch ごとに分けて管理できます。

## 次にやること

1. Render に本番用 Blueprint として `render.yaml` を読み込ませる
2. `RAILS_MASTER_KEY` と本番用 `VITE_API_BASE_URL` を設定する
3. 本番 back / front / db のデプロイ成功を確認する
4. Render にステージング用 Blueprint として `render.staging.yaml` を読み込ませる
5. `RAILS_MASTER_KEY` とステージング用 `VITE_API_BASE_URL` を設定する
6. ステージング back / front / db のデプロイ成功を確認する
