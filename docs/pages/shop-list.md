# Shop List Page

Route: `/shops`  
View: `src/views/ShopListView.vue`  
Layout: `DefaultLayout`

## API Calls

| Query key | Endpoint | 說明 |
|-----------|----------|------|
| `['shops', filters]` | `GET /api/shops` | 分頁列表，帶 filter 參數 |

Query params: `city`, `district`, `types[]`, `sort`, `page`, `limit=12`

## State Management

- `shop-filters.store.ts` — 管理 city / district / types / sort
- Filter 變更時自動 reset `page = 1`
- TanStack Query: `placeholderData: keepPreviousData`（翻頁不閃爍）

## Business Logic

- `sort` 選項：`combined` / `user` / `google`（對應三種排名演算法）
- `types` 為多選，送出時為陣列：`types[]=濃厚系&types[]=清湯系`
- 城市/區域二級聯動：切換城市時清空 district

## Components

- `ShopFilterSidebar` — 左側篩選器
- `ShopListGrid` — 卡片格線（響應式 1/2/3 欄）
- `ShopCard` — 單張卡片
- `AppPagination` — 分頁控制
