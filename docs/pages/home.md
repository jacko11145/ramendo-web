# Home Page

Route: `/`  
View: `src/views/HomeView.vue`  
Layout: `DefaultLayout`

## API Calls

| Query key | Endpoint | 說明 |
|-----------|----------|------|
| `['shops', { limit: 6, sort: 'combined' }]` | `GET /api/shops` | 精選推薦店家（前 6 名） |
| `['rankings', 'combined']` | `GET /api/rankings?type=combined` | 排行榜預覽（前 5） |

## Business Logic

- 精選店家取 `sort=combined`，顯示前 6 間
- 排行榜預覽僅顯示前 5 名，點擊導向 `/rankings`
- Hero banner 固定背景圖，CTA 按鈕導向 `/shops`

## Components

- `ShopCard` — 店家卡片（圖片 + 名稱 + 評分 + 城市）
- `RankingTable` (精簡版) — 僅顯示 rank/name/score

## Auth State

- 未登入：顯示「立即加入」CTA
- 已登入：顯示用戶等級與快捷入口
