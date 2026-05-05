# Submit Shop Page

Route: `/submit-shop`  
View: `src/views/user/SubmitShopView.vue`  
Layout: `DefaultLayout`  
Guard: `requiresAuth` — 未登入時重導向 `/login?redirect=/submit-shop`

## API Calls

| 操作 | Endpoint | 說明 |
|------|----------|------|
| 提案 | `POST /api/submissions` | 提交新店家提案 |

## Business Logic

- 表單欄位：shopName / city / district / address / phone / types[] / description
- `types` 多選 checkbox（拉麵類型）
- 提案成功後顯示成功訊息並重置表單
- 提案狀態可在 `/dashboard` 查看

## Permission

- 所有登入用戶均可提案（無等級限制）
- 管理員在後台 `/admin/submissions` 審核

## Components

- `AppInput` / `AppButton` — 基礎表單元件
- 多選 checkbox 群組（ramen types）
