# Shop Detail Page

Route: `/shops/:guid`  
View: `src/views/ShopDetailView.vue`  
Layout: `DefaultLayout`

## API Calls

| Query key | Endpoint | 說明 |
|-----------|----------|------|
| `['shop', guid]` | `GET /api/shops/{guid}` | 店家基本資訊 + businessHours + newsItems |
| `['shop-reviews', guid, page]` | `GET /api/shops/{guid}/reviews` | 評論列表（分頁） |

## Business Logic

- **營業狀態**：`useShopStatus(shop.businessHours)` composable，Taiwan UTC+8
  - `isOpen` 計算當下是否在營業時間內
  - `todayHours` 顯示今日營業時段
- **公告**：`newsItems` 只顯示 `startDate <= now <= endDate` 的項目
- **菜單**：menuItems 按 `position ASC` 排序，`isHighlight = true` 優先顯示標記
- **收藏**：呼叫 `POST/DELETE /api/user/favorites/{guid}`，需登入
- **評論權限**：由 permission settings 的最低等級決定，未達等級顯示提示

## Components

- `ShopHero` — 封面圖 + 店名 + 收藏按鈕
- `ShopBasicInfo` — 類型、地址、電話、Google 評分
- `ShopBusinessHours` — 營業時間表 + 開/關狀態 badge
- `ShopNewsSection` — 最新公告（僅有效期內）
- `ShopMenuSection` — 菜單分組 + highlight 標記
- `ShopReviewSection` — 評論列表 + 新增評論表單
