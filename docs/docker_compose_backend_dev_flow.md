# Docker Compose 開発環境の読み込み順と実行フロー

このドキュメントは、バックエンド開発環境を `docker compose` で起動したときに、
「どのファイルが、どの順番で、何のために読み込まれるのか」を追いやすくするためのものです。

対象は、今回追加した以下のファイルです。

- [compose.yml](/Users/masafumi/study_runteq/卒業制作/life-simulator/compose.yml)
- [compose.env.example](/Users/masafumi/study_runteq/卒業制作/life-simulator/compose.env.example)
- [back/Dockerfile.dev](/Users/masafumi/study_runteq/卒業制作/life-simulator/back/Dockerfile.dev)
- [back/bin/docker-dev-entrypoint](/Users/masafumi/study_runteq/卒業制作/life-simulator/back/bin/docker-dev-entrypoint)
- [back/config/database.yml](/Users/masafumi/study_runteq/卒業制作/life-simulator/back/config/database.yml)

## 全体像

開発環境の起動は、ざっくり次の順番で進みます。

1. 開発者がルートで `docker compose up --build` を実行する
2. `compose.yml` が読まれ、`db` と `back` サービスの定義が解釈される
3. `back` サービスの build 設定に従って `back/Dockerfile.dev` が実行される
4. コンテナ起動時に `back/bin/docker-dev-entrypoint` が実行される
5. entrypoint から `./bin/rails server ...` が起動される
6. Rails 起動中に `back/config/database.yml` が読まれ、DB 接続先が決まる
7. `./back` を bind mount しているので、保存したコード変更がコンテナ内へ反映される

## 1. 起動の入口

まず、プロジェクトルートで次のコマンドを実行します。

```bash
docker compose up --build
```

この時点で最初に見られるのが `compose.yml` です。

- `docker compose` はルートの `compose.yml` を読む
- そこに書かれた `services`, `volumes`, `ports`, `environment` などを解釈する
- `back` サービスに `build` があるので、Rails イメージのビルドへ進む

## 2. compose.yml がやっていること

[compose.yml](/Users/masafumi/study_runteq/卒業制作/life-simulator/compose.yml:1) は、開発環境全体の設計図です。

このファイルでは主に次のことを定義しています。

- `db` サービスとして PostgreSQL コンテナを起動する
- `back` サービスとして Rails API コンテナを起動する
- `back` は `db` の healthcheck が通ってから起動する
- `./back:/rails` を mount して、ローカル保存内容をコンテナ側へ反映する
- `postgres_data` と `bundle_data` を named volume として保持する

### `db` サービスの流れ

- `image: postgres:16` により、PostgreSQL 公式イメージを使う
- `environment` で DB 名、ユーザー名、パスワードを渡す
- `healthcheck` で DB が接続可能になるまで状態確認する

### `back` サービスの流れ

- `build.context: ./back` により、`back` ディレクトリをビルド対象にする
- `dockerfile: Dockerfile.dev` により、開発用 Dockerfile を使う
- `depends_on` により、`db` が healthy になってから起動する
- `command` により、最終的に Rails サーバーを `0.0.0.0:3000` で起動する

## 3. 環境変数の考え方

[compose.env.example](/Users/masafumi/study_runteq/卒業制作/life-simulator/compose.env.example:1) は、環境変数のサンプルです。

このファイル自体は自動で読み込まれる設定ファイルではなく、次の目的で置いています。

- どんな環境変数を使っているかを一覧で把握する
- 必要に応じて、ルートに `.env` を作るときの見本にする

実際に `.env` を作った場合、`docker compose` はその値を参照して `compose.yml` 内の
`${POSTGRES_USER:-postgres}` のような式を展開します。

## 4. back/Dockerfile.dev の実行

`compose.yml` の `back.build` 設定に従い、
[back/Dockerfile.dev](/Users/masafumi/study_runteq/卒業制作/life-simulator/back/Dockerfile.dev:1) が実行されます。

Dockerfile の流れは次のとおりです。

1. `ruby:3.3.11-slim` をベースイメージとして使う
2. 作業ディレクトリを `/rails` にする
3. `build-essential`, `libpq-dev`, `postgresql-client` を入れる
4. `Gemfile`, `Gemfile.lock` をコピーする
5. `bundle install` で gem を入れる
6. `back/bin/docker-dev-entrypoint` をコンテナ内へ配置する
7. アプリ全体をコピーする
8. `ENTRYPOINT` と `CMD` を設定する

ここで大事なのは、Dockerfile は「イメージを作る段階」の設定だということです。

- まだ Rails サーバーは起動していない
- ここでは、Rails を動かすための土台を作っている
- 実際の起動処理は、次の entrypoint に渡される

## 5. コンテナ起動時に entrypoint が動く

イメージのビルドが終わって `back` コンテナが起動すると、
[back/bin/docker-dev-entrypoint](/Users/masafumi/study_runteq/卒業制作/life-simulator/back/bin/docker-dev-entrypoint:1) が最初に実行されます。

これは `ENTRYPOINT ["docker-dev-entrypoint"]` で指定しているためです。

entrypoint の処理順は次のとおりです。

1. `bundle check || bundle install`
2. `rm -f /rails/tmp/pids/server.pid`
3. `rails server` 起動時だけ `./bin/rails db:prepare`
4. 最後に `exec "$@"` で本来のコマンドを実行する

### それぞれの意味

- `bundle check || bundle install`
  ローカルで Gemfile が変わっていても、起動時に不足 gem を補えるようにするためです。

- `rm -f /rails/tmp/pids/server.pid`
  Rails は古い PID ファイルが残ると起動失敗することがあるため、毎回消しています。

- `./bin/rails db:prepare`
  DB 作成や migrate をまとめて面倒見てくれるため、初回起動が楽になります。

- `exec "$@"`
  `compose.yml` の `command` で渡された本来のコマンドへ処理を引き継ぎます。

## 6. command で Rails サーバーが起動する

`compose.yml` の `back.command` は次の内容です。

```yaml
command: ["./bin/rails", "server", "-b", "0.0.0.0", "-p", "3000"]
```

このコマンドは entrypoint の最後に `exec "$@"` で実行されます。

ここで初めて Rails アプリ本体の起動に入ります。

## 7. Rails 起動中に database.yml が参照される

Rails が起動し、`db:prepare` や `rails server` が DB 接続を必要としたタイミングで、
[back/config/database.yml](/Users/masafumi/study_runteq/卒業制作/life-simulator/back/config/database.yml:15) が参照されます。

今回の設定では、`development` 環境で次の値を環境変数から受け取ります。

- `DB_HOST`
- `DB_PORT`
- `DB_USERNAME`
- `DB_PASSWORD`
- `DB_NAME`

`compose.yml` ではこれらを次のように渡しています。

- `DB_HOST=db`
- `DB_PORT=5432`
- `DB_USERNAME=${POSTGRES_USER:-postgres}`
- `DB_PASSWORD=${POSTGRES_PASSWORD:-postgres}`
- `DB_NAME=${POSTGRES_DB:-life_simulator_development}`

このため、Rails コンテナは `db` というサービス名で PostgreSQL に接続します。

## 8. 保存時に変更が反映される理由

`compose.yml` のこの設定がポイントです。

```yaml
volumes:
  - ./back:/rails
```

これにより、ローカルの `back` ディレクトリがコンテナ内 `/rails` にそのまま mount されます。

その結果、ローカルでファイルを保存すると、コンテナ内のファイルも同時に更新されます。

Rails の development 環境ではコード再読み込みが有効なので、変更内容が次のリクエスト時に反映されやすくなります。

ただし、次のような変更は再起動が必要になることがあります。

- Gemfile の変更
- Dockerfile の変更
- compose.yml の変更
- 一部の初期化設定の変更

## 9. まとめると、実行順はこうなる

順番だけを短く並べると次のとおりです。

1. 開発者が `docker compose up --build` を実行する
2. `compose.yml` が読まれる
3. `back/Dockerfile.dev` で Rails 用イメージがビルドされる
4. `db` コンテナが起動する
5. `db` の healthcheck が通る
6. `back` コンテナが起動する
7. `back/bin/docker-dev-entrypoint` が実行される
8. `bundle check` と `db:prepare` が走る
9. `./bin/rails server -b 0.0.0.0 -p 3000` が起動する
10. Rails が `back/config/database.yml` を使って `db` へ接続する
11. ローカルの `back` 保存内容が bind mount によりコンテナへ反映される

## 補足

今後フロントエンドを `compose.yml` に追加する場合は、同じ流れの中に `front` サービスが増えるイメージです。

その場合は次のような構成になります。

- `db` が起動する
- `back` が起動する
- `front` が起動する
- ブラウザからは `front` にアクセスし、`front` から `back` API を呼ぶ

必要になれば次に、フロント追加後の全体フロー版も `docs` に追記できます。

## Rails をコンテナ内でデバッグする方法

`docker compose` で Rails を動かす場合、バックエンドの確認やデバッグは
`back` コンテナの中に入って行うのが基本です。

## 1. まずコンテナが起動しているか確認する

```bash
docker compose ps
```

ここで `back` と `db` が `Up` になっていれば、コンテナは起動しています。

## 2. Rails コンテナの中に入る

普段いちばん使いやすいのは次のコマンドです。

```bash
docker compose exec back bash
```

これで `back` コンテナの中に入り、コンテナ内でコマンドを実行できます。

もし `bash` が使えないイメージなら、次でも入れます。

```bash
docker compose exec back sh
```

## 3. コンテナに入ったあとによく使う確認

### Rails コンソールを開く

```bash
bin/rails console
```

モデルの確認、メソッドの挙動確認、DB の中身確認をするときに使います。

### ルーティングを確認する

```bash
bin/rails routes
```

API のエンドポイントや controller との対応確認に使います。

### DB の状態を確認する

```bash
bin/rails db:migrate:status
```

migration の適用状況を確認できます。

### テストを実行する

```bash
bin/rails test
```

特定ファイルだけ見たい場合は次のように実行します。

```bash
bin/rails test test/controllers/health_controller_test.rb
```

### ログを確認する

Rails の標準出力は、ホスト側から次で見るのが簡単です。

```bash
docker compose logs -f back
```

`-f` を付けるとログを追い続けられます。

## 4. コンテナに毎回入らずに 1 コマンドだけ実行する方法

「中に入るほどではないけど、Rails コマンドを 1 回だけ打ちたい」場合は
`exec` で直接実行すると便利です。

### Rails コンソール

```bash
docker compose exec back bin/rails console
```

### テスト実行

```bash
docker compose exec back bin/rails test
```

### 特定の rake task 実行

```bash
docker compose exec back bin/rails db:migrate
```

## 5. `debug` gem を使ったブレークポイント

このプロジェクトの `Gemfile` には development/test 用の `debug` gem が入っています。
そのため、コード内にブレークポイントを書いて止めることができます。

例えば service や controller の中で、次のように書きます。

```ruby
binding.break
```

または環境によっては次でも止められます。

```ruby
debugger
```

その状態で対象 API を叩くと、Rails プロセスが止まり、コンテナ側の標準入力で操作できるようになります。

### ブレークポイントを使うときのポイント

- `compose.yml` で `stdin_open: true` と `tty: true` を付けているので、対話的なデバッグがしやすい
- `docker compose up` を前面で起動しておくと、止まった場所の表示を見やすい
- 別ターミナルから `docker compose logs -f back` で様子を見るのも便利

## 6. サーバーを止めずにログだけ見たい場合

アプリの中に入らなくても、次で Rails の出力を追えます。

```bash
docker compose logs -f back
```

エラー内容、SQL、リクエストログを見たいだけならこれで十分なことが多いです。

## 7. DB コンテナ側を直接確認したい場合

PostgreSQL 自体を直接見たいときは、`db` コンテナに入る方法もあります。

```bash
docker compose exec db bash
```

そのあと `psql` を使って確認できます。

```bash
psql -U postgres -d life_simulator_development
```

もしユーザー名や DB 名を変えている場合は、`compose.yml` や `.env` に合わせて読み替えてください。

## 8. よく使うデバッグ手順のおすすめ順

迷ったら、次の順で確認すると進めやすいです。

1. `docker compose ps` でコンテナが起動しているか確認する
2. `docker compose logs -f back` でエラーを確認する
3. 必要なら `docker compose exec back bash` で中に入る
4. `bin/rails console` や `bin/rails test` で再現確認する
5. さらに細かく見たいときだけ `binding.break` や `debugger` を置く
