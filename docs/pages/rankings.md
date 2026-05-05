# Rankings Page

Route: `/rankings`  
View: `src/views/RankingsView.vue`  
Layout: `DefaultLayout`

## API Calls

| Query key | Endpoint | 說明 |
|-----------|----------|------|
| `['rankings', type]` | `GET /api/rankings?type={type}` | 指定類型排行榜 |

## Business Logic

- 三種排名類型（tab 切換）：
  - `combined` — 綜合排名（user + google 加權平均）
  - `user` — 純用戶評分排名
  - `google` — 純 Google 評分排名
- 排名演算法由後端 `RankingSettings` 決定（貝氏平均 + 評論數加權）
- 點擊店家名稱導向 `/shops/{guid}`

## Components

- `RankingTypeTabs` — combined / user / google 切換 tab
- `RankingTable` — 排名序號 + 店名 + 評分 + 評論數
