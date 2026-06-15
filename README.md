<div align="center">
  <img src="./front/src/assets/mitooshi-logo.svg" alt="mitooshi" width="240">

  <p><strong>住まいとお金から、暮らしを考える</strong></p>
</div>

## mitooshiについて

`mitooshi` は、勤務先と住居の候補を組み合わせ、毎月のお金と通勤時間を比較できる生活シミュレーションサービスです。

就職・転職や引っ越しでは、給与、家賃、勤務地、通勤時間など、いくつもの条件を同時に考える必要があります。しかし、求人サイトや不動産サイト、地図アプリに情報が分かれているため、「この組み合わせを選ぶと、実際の暮らしはどうなるのか」をイメージするのは簡単ではありません。

mitooshiでは、登録した勤務先と住居からすべての組み合わせを作り、月の収支や通勤時間を一覧で表示します。条件を一つずつ眺めるのではなく、暮らし全体のバランスを見ながら、納得できる選択肢を探せることを目指しています。

## 開発の背景

転職活動をした際、応募先ごとに勤務地、給与、リモート勤務の有無などが異なり、住む場所も含めて比較する必要がありました。

給与が高くても通勤時間が長い、通勤しやすい場所では家賃が高い、といったように、一つの条件だけでは暮らしやすさを判断できません。実際に生活を始めてからミスマッチに気づくのではなく、選ぶ前にもう少し具体的な見通しを持てるようにしたいと考えたことが、開発のきっかけです。

## 主な機能

- 名前を入力して始められるゲストログイン
- 勤務先の登録・編集・削除
- 住居候補の登録・編集・削除
- 勤務先と住居の組み合わせの自動生成
- 手取り月収、家賃、標準生活費から算出した月の収支表示
- 組み合わせごとの片道・往復通勤時間の登録
- 月の収支、通勤時間による並び替え
- 「余裕あり」「ぎりぎり」「生活費不足」の状態表示

## 基本的な使い方

1. ゲスト名を入力してログインします。
2. 手取り月収や勤務地を含む勤務先情報を登録します。
3. 家賃や所在地を含む住居情報を登録します。
4. 自動生成された組み合わせを、月の収支や通勤時間で比較します。

月の収支は、次の計算式で算出しています。

```text
手取り月収 - 家賃 - 標準生活費（14万円）
```

標準生活費は、家賃を除いた単身世帯の生活費を想定したMVP用の固定値です。表示される結果は、将来の生活を考えるための目安であり、特定の選択を勧めるものではありません。

## 技術構成

| 分類 | 使用技術 |
| --- | --- |
| フロントエンド | React 19 / TypeScript / Vite / React Router / TanStack Query |
| UI・バリデーション | shadcn/ui / CSS Modules / Zod / React Icons |
| バックエンド | Ruby 3.3 / Ruby on Rails 8（APIモード） |
| データベース | PostgreSQL 16 / Neon |
| テスト・品質管理 | Vitest / Testing Library / Storybook / Minitest / RuboCop / Brakeman |
| 開発・運用 | Docker Compose / Render / GitHub Actions |

## システム構成

開発環境では、ブラウザからのAPIリクエストをViteがRailsへ中継します。

```text
Browser
  └─ front（React / Vite）
       └─ back（Rails API）
            └─ db（PostgreSQL）
```

本番・ステージング環境では、Render Static Siteの`/api/*` rewriteを通して、同じ環境のRails APIへ接続します。

```text
Browser
  └─ Render Static Site
       └─ /api/* rewrite
            └─ Render Web Service
                 └─ Neon
```

## ローカル環境の起動

Dockerが利用できる環境で、次のコマンドを実行します。

```bash
git clone git@github.com:snowKuramasa/life-simulator.git
cd life-simulator
cp compose.env.example .env
docker compose up --build
```

起動後、ブラウザで以下のURLを開きます。

- フロントエンド: http://localhost:5173
- Rails API: http://localhost:3000

初回起動時は、依存関係のインストールとデータベースの準備が自動で行われます。

### 主な確認コマンド

```bash
# フロントエンド
docker compose exec front npm run lint
docker compose exec front npm run test
docker compose exec front npm run build

# バックエンド
docker compose exec back bin/rubocop
docker compose exec back bin/rails test
docker compose exec back bin/brakeman --no-pager
```

## デプロイ環境

- `main`: 本番環境
- `development`: ステージング環境
- フロントエンド・バックエンド: Render
- データベース: Neon

Renderでは、フロントエンドから`/api/...`の相対パスでリクエストし、Static Siteのrewriteを使ってRails APIへ中継しています。環境ごとの設定やデプロイ手順は、[Renderデプロイ準備メモ](./docs/render_deploy_setup.md)にまとめています。

## 関連資料

- [画面遷移図（Figma）](https://www.figma.com/design/XBz0X5VVKhR3G558yZKvfX/RUNTEQ%E5%8D%92%E6%A5%AD%E5%88%B6%E4%BD%9C_%E3%82%B5%E3%83%A1_76aw?node-id=0-1&t=CKG4rfK4hr273v4f-1)
- [画面一覧](./docs/画面一覧.md)
- [ER図](./docs/ER図.md)
- [フロントエンドとバックエンドの接続フロー](./docs/front_backend_connection_flow.md)
- [開発環境の読み込み順と実行フロー](./docs/開発環境の読み込み順と実行フロー.md)

## 今後追加したい機能

- Googleログイン
- 世帯人数に応じた生活費の計算
- 光熱費やサブスクリプションなど、固定費のカスタム入力
- シミュレーション結果の保存・比較
- 外部APIを利用した通勤時間の取得

mitooshiは「正解を決めるサービス」ではなく、条件を変えながら比較し、自分なりに納得できる選択をするためのサービスを目指しています。
