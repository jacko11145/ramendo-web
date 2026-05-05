# User Dashboard Page

Route: `/dashboard`  
View: `src/views/user/DashboardView.vue`  
Layout: `DefaultLayout`  
Guard: `requiresAuth` — 未登入時重導向 `/login?redirect=/dashboard`

## API Calls

| Query key | Endpoint | 說明 |
|-----------|----------|------|
| `['me']` | `GET /api/auth/me` | 用戶資料（含 exp + vip） |
| `['user-favorites']` | `GET /api/user/favorites` | 收藏店家列表 |
| `['user-reviews']` | `GET /api/user/reviews` | 自己的評論 |
| `['user-submissions']` | `GET /api/user/submissions` | 自己的店家提案 |

## Business Logic

- **等級顯示**：`useLevel(exp)` composable — `level = Math.floor(exp / 100) + 1`
- **VIP 狀態**：顯示到期日（`MembershipExpiry`），過期顯示灰色
- **收藏**：點擊愛心可直接取消收藏（呼叫 toggle API）
- **提案狀態**：`Pending` / `Approved` / `Rejected` 各自顯示不同 badge 顏色

## Stores

- `auth.store.ts` — `user` ref（顯示 displayName / role / exp / vip）

## Components

- `UserLevelDisplay` — 等級圓圈 + 進度條（exp % 100）
- `UserFavoritesList` — 收藏店家卡片列表
- `AppModal` — 通用 Modal（確認取消收藏）
