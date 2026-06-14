# Front / Back 接続の流れ

このドキュメントは、フロントエンドがバックエンド API にどう接続しているかを
「開発環境」と「Render 本番 / stg 環境」に分けて把握しやすくするためのメモです。

## 全体像

フロントからバックエンド API を呼ぶときの考え方は次の 2 パターンです。

- 開発環境
  ブラウザは相対パスで Vite にアクセスし、Vite が Rails に proxy する

- 本番 / stg 環境
  ブラウザは相対パスで front の Render Static Site にアクセスし、Render の rewrite が Rails に proxy する

---

## 1. 開発環境の流れ

```text
ブラウザ
  ↓  http://localhost:5173
front (Vite dev server)
  ↓  /api/v1/health を proxy
back (Rails API)
  ↓
db (PostgreSQL)
```

### もう少し具体的な流れ

```text
1. ブラウザで http://localhost:5173 を開く
2. TopPage が /api/v1/health を fetch する
3. fetch 先は相対パスなので、まず Vite サーバーに届く
4. Vite の proxy 設定が /api を http://back:3000 に転送する
5. Rails がレスポンスを返す
6. Vite 経由でブラウザに JSON が返る
```

### 図

```text
┌────────────┐
│  Browser   │
│ localhost  │
│   :5173    │
└─────┬──────┘
      │ GET /api/v1/health
      ▼
┌────────────┐
│   Vite     │
│ front dev  │
│   server   │
└─────┬──────┘
      │ proxy (/api, /up)
      │ FRONTEND_DEV_PROXY_TARGET=http://back:3000
      ▼
┌────────────┐
│   Rails    │
│    back    │
│   :3000    │
└─────┬──────┘
      │ DB access
      ▼
┌────────────┐
│ PostgreSQL │
│     db     │
└────────────┘
```

### このとき効いているファイル

- [compose.yml](/Users/masafumi/study_runteq/卒業制作/life-simulator/compose.yml)
  `front` に `FRONTEND_DEV_PROXY_TARGET=http://back:3000` を渡す

- [front/vite.config.ts](/Users/masafumi/study_runteq/卒業制作/life-simulator/front/vite.config.ts)
  `/api` と `/up` を Rails へ proxy する

- [front/src/lib/api.ts](/Users/masafumi/study_runteq/卒業制作/life-simulator/front/src/lib/api.ts)
  `VITE_API_BASE_URL` が無いときは相対パスを返す

- [front/src/pages/TopPage.tsx](/Users/masafumi/study_runteq/卒業制作/life-simulator/front/src/pages/TopPage.tsx)
  実際に `/api/v1/health` を呼ぶ

### なぜ proxy が必要か

開発環境では、ブラウザは `http://back:3000` という Docker 内サービス名を解決できません。
そのため、ブラウザは `localhost:5173` の Vite にだけ話しかけて、
Vite が内部的に Rails へ中継する形にしています。

---

## 2. Render 本番 / stg 環境の流れ

```text
ブラウザ
  ↓  front の Render URL
front (Static Site)
  ↓  /api/v1/health を rewrite
back (Render Web Service)
  ↓
Neon
```

### もう少し具体的な流れ

```text
1. ブラウザで front の Render URL を開く
2. TopPage が /api/v1/health を呼びたい
3. buildApiUrl は VITE_API_BASE_URL が無いため /api/v1/health の相対パスを返す
4. ブラウザは front の Render URL に対して /api/v1/health を送る
5. front Static Site の /api/* rewrite が back Render URL へ中継する
6. Rails が Neon に接続してレスポンスを返す
```

### 図

```text
┌────────────┐
│  Browser   │
└─────┬──────┘
      │ open front URL
      ▼
┌─────────────────────────────┐
│ Render Static Site          │
│ front-prod / front-stg      │
└─────┬───────────────────────┘
      │ rewrite /api/*
      ▼
┌─────────────────────────────┐
│ Render Web Service          │
│ back-prod / back-stg        │
└─────┬───────────────────────┘
      │ DATABASE_URL
      ▼
┌────────────┐
│   Neon     │
│ production │
│ development│
└────────────┘
```

### 環境ごとの対応

```text
prod
  front-prod  ->  back-prod  ->  Neon production branch

stg
  front-stg   ->  back-stg   ->  Neon development branch
```

### このとき効いているファイル

- [render.yaml](/Users/masafumi/study_runteq/卒業制作/life-simulator/render.yaml)
  `main` 用の front / back 設定

- [render.staging.yaml](/Users/masafumi/study_runteq/卒業制作/life-simulator/render.staging.yaml)
  `development` 用の front / back 設定

- [front/src/lib/api.ts](/Users/masafumi/study_runteq/卒業制作/life-simulator/front/src/lib/api.ts)
  `VITE_API_BASE_URL` が無いと相対パスを返す

---

## 3. `buildApiUrl` の役割

フロントでは API URL を [front/src/lib/api.ts](/Users/masafumi/study_runteq/卒業制作/life-simulator/front/src/lib/api.ts) にまとめています。

考え方はこうです。

```text
VITE_API_BASE_URL がある
  -> 例外的に API の絶対 URL を直接使う
  -> https://.../api/v1/health のような完全 URL を作る

VITE_API_BASE_URL がない
  -> 開発環境 / Render 本番 / stg
  -> /api/v1/health のような相対パスを返す
```

### 図

```text
                buildApiUrl("/api/v1/health")
                           │
         ┌─────────────────┴─────────────────┐
         │                                   │
         ▼                                   ▼
VITE_API_BASE_URL あり                VITE_API_BASE_URL なし
         │                                   │
         ▼                                   ▼
https://back-xxx.onrender.com/...          /api/v1/health
         │                                   │
         ▼                                   ▼
      API を直接呼ぶ              Vite proxy / Render rewrite が中継
```

---

## 4. 今の設定で確認するときの見方

### 開発環境で確認したいとき

- `http://localhost:5173` を開く
- TopPage に health 情報が表示されるか見る
- `docker compose logs -f front`
- `docker compose logs -f back`

### Render 本番で確認したいとき

- `front-prod` の URL を開く
- Network タブで API 呼び出し先が `front-prod` の `/api/...` になっているか見る
- Cookie が `front-prod` 側に保存され、保存 API にも送られているか見る
- `back-prod` の `/api/v1/health` を直接叩く

### Render stg で確認したいとき

- `front-stg` の URL を開く
- Network タブで API 呼び出し先が `front-stg` の `/api/...` になっているか見る
- Cookie が `front-stg` 側に保存され、保存 API にも送られているか見る
- `back-stg` の `/api/v1/health` を直接叩く

---

## 5. まとめ

短く言うと、今の接続は次のルールです。

```text
開発環境:
  Browser -> Vite -> Rails -> DB

本番 / stg:
  Browser -> Front Static Site (/api/* rewrite) -> Back Render Service -> Neon
```

この形にしている理由は、

- 開発環境では Docker 内の `back` という名前をブラウザが使えない
- 本番 / stg では API も front と同じ origin の `/api/...` に見せることで、session cookie が third-party 扱いされにくくなる

という違いがあるためです。
