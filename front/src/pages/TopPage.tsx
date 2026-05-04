import { useEffect, useState } from "react";

import { buildApiUrl } from "@/lib/api";

type HealthResponse = {
  status: string;
  message: string;
  sample_calculation: {
    monthly_income: number;
    fixed_costs: number;
    disposable_income: number;
  };
  timestamp: string;
};

// 現在のトップページです。
// バックエンドとの接続確認も兼ねて、起動時に health API を呼んで結果を表示します。
export function TopPage() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadHealth() {
      try {
        const response = await fetch(buildApiUrl("/api/v1/health"), {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Backend request failed with ${response.status}`);
        }

        const payload = (await response.json()) as HealthResponse;
        setHealth(payload);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setErrorMessage("バックエンドに接続できませんでした。API の URL 設定を確認してください。");
      }
    }

    loadHealth();

    return () => controller.abort();
  }, []);

  return (
    <main className="page">
      <section className="status-card">
        <p className="status-card__eyebrow">Life Simulator</p>
        <h1 className="page__title">Top Page</h1>
        <p className="status-card__description">
          front から back の疎通確認を行い、prod / stg では `VITE_API_BASE_URL`、
          開発時は Vite proxy 経由で API を呼びます。
        </p>

        {health ? (
          <dl className="status-card__details">
            <div>
              <dt>Status</dt>
              <dd>{health.status}</dd>
            </div>
            <div>
              <dt>Message</dt>
              <dd>{health.message}</dd>
            </div>
            <div>
              <dt>Disposable Income</dt>
              <dd>{health.sample_calculation.disposable_income.toLocaleString()} yen</dd>
            </div>
            <div>
              <dt>Timestamp</dt>
              <dd>{health.timestamp}</dd>
            </div>
          </dl>
        ) : errorMessage ? (
          <p className="status-card__error">{errorMessage}</p>
        ) : (
          <p className="status-card__loading">バックエンドへ接続しています...</p>
        )}
      </section>
    </main>
  );
}
