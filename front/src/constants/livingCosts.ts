// MVPでは生活費を入力項目に含めないため、統計を参考にした固定の標準生活費を使います。
// 家賃は別入力なので、住居費を除いた毎月の生活費として扱います。
// NOTE: 参考データ
// - 総務省統計局「家計調査」
//   https://www.stat.go.jp/data/kakei/index.html
// - 2024年の単身世帯の消費支出は約17万円という整理を参考にしつつ、
//   本アプリでは家賃を別入力するため、住居費相当を除いたMVP用の固定値として設定しています。
//   https://www.jili.or.jp/lifeplan/houseeconomy/845.html
export const STANDARD_MONTHLY_LIVING_COST = 140_000;
