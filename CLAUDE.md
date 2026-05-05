# ramendo-web — CLAUDE.md

## 專案簡介

拉麵道前台 (ramendo-web)，Vue 3 + Vite + TypeScript + Tailwind CSS。
呼叫 `ramendo-api`（ASP.NET Core 10），展示店家探索、排行榜、登入/註冊、個人儀表板。

---

## 本地執行

```bash
cd ramendo-web
cp .env.example .env.development   # 第一次
npm run dev                         # http://localhost:3000
npm run build                       # 正式建置
```

### 前置需求

- Node.js 20+
- `ramendo-api` 在 `http://localhost:5000` 運行（或修改 `.env.development`）

---

## 環境變數

```
VITE_API_BASE_URL=http://localhost:5000
```

---

## Solution 結構

```
ramendo-web/
├── src/
│   ├── api/              ← Axios API 模組（client + auth/shops/reviews/rankings/favorites/submissions）
│   ├── types/            ← TypeScript 型別（對應 API 回應）
│   ├── stores/           ← Pinia stores（auth / ui / shop-filters）
│   ├── router/           ← Vue Router + auth guard
│   ├── composables/      ← useAuth / useShopStatus / useLevel / usePagination
│   ├── layouts/          ← DefaultLayout（Navbar+Footer）/ AuthLayout
│   ├── views/            ← 8 個頁面元件
│   │   ├── HomeView.vue
│   │   ├── ShopListView.vue
│   │   ├── ShopDetailView.vue
│   │   ├── RankingsView.vue
│   │   ├── auth/LoginView.vue
│   │   ├── auth/RegisterView.vue
│   │   ├── user/DashboardView.vue
│   │   └── user/SubmitShopView.vue
│   └── components/
│       ├── common/       ← AppToast / AppPagination / AppSpinner / AppModal
│       ├── layout/       ← AppNavbar / AppFooter
│       └── shops/        ← ShopCard / ShopFilterSidebar
├── _redirects            ← Cloudflare Pages SPA 路由
├── tailwind.config.js
├── vite.config.ts
└── CLAUDE.md
```

---

## 設計規範

### 色彩

| Token | 值 |
|-------|-----|
| `--ink` | `#0C0C0C` (背景) |
| `--red` | `#C8201A` (主色/CTA) |
| `--red-dark` | `#8B1410` |
| `--cream` | `#F0E9D6` (主文字) |
| `--cream-dark` | `#DDD3B8` (次要文字) |
| `--white` | `#FAFAF7` |
| `--gray` | `#3A3A3A` (邊框/卡片背景) |

### 字型

| 用途 | 字體 |
|------|------|
| 標題/大文字 | Bebas Neue (`font-bebas`) |
| 裝飾 | Permanent Marker (`font-marker`) |
| 內文 | Noto Sans TC (`font-body`) |
| 等寬 | Share Tech Mono (`font-mono`) |

### 元件慣例

```vue
<!-- 按鈕 -->
<button class="btn-primary">主要動作</button>
<button class="btn-outline">次要動作</button>
<button class="btn-ghost">輔助動作</button>

<!-- 卡片 -->
<div class="card p-4">...</div>

<!-- 標題 -->
<h2 class="section-title">區塊標題</h2>

<!-- 輸入框 -->
<input class="input-field" />

<!-- 標籤 -->
<span class="tag">豚骨</span>
```

---

## API 串接規則

- 所有 API 呼叫走 `src/api/client.ts`（Axios instance，自動加 Bearer token）
- 401 時自動 refresh，失敗則觸發 `auth:expired` 事件導向登入頁
- TanStack Query key 慣例：
  - `['shops', params]` — 列表（含 filters）
  - `['shop', guid]` — 單一店家詳情
  - `['shop-reviews', guid, page]` — 店家評論
  - `['rankings', type]` — 排行榜
  - `['user-favorites']` — 使用者收藏
  - `['user-submissions']` — 使用者提案

---

## 新增頁面步驟

1. `src/views/` 新增 `XXXView.vue`
2. `src/router/index.ts` 加路由（lazy import）
3. `src/api/` 加 API 模組（若需要）
4. `src/types/index.ts` 加型別

---

## 實作進度 Checklist

### 基礎建設 ✅
- [x] Vite + Vue 3 + TypeScript 初始化
- [x] Tailwind CSS 3 + 設計 token
- [x] `vite.config.ts` (`@` alias)
- [x] `index.html` (Google Fonts, lang=zh-TW)
- [x] `src/style.css` (全域樣式 + ink texture)

### Types ✅
- [x] `src/types/index.ts` (ApiResponse, PagedResult, UserSession, ShopListItem, ShopDetail, Review, RankingItem, FavoriteShop, ShopSubmission 等)

### API ✅
- [x] `src/api/client.ts` (Axios + JWT auto-refresh interceptor)
- [x] `src/api/auth.ts`
- [x] `src/api/shops.ts`
- [x] `src/api/reviews.ts`
- [x] `src/api/rankings.ts`
- [x] `src/api/favorites.ts`
- [x] `src/api/submissions.ts`

### Stores ✅
- [x] `src/stores/auth.store.ts` (Pinia: session/user/tokens)
- [x] `src/stores/ui.store.ts` (loading/toast)
- [x] `src/stores/shop-filters.store.ts`

### Router ✅
- [x] `src/router/index.ts` (all routes + auth guard)

### Composables ✅
- [x] `src/composables/useShopStatus.ts` (Taiwan UTC+8 open/closed)
- [x] `src/composables/useLevel.ts` (level = Math.floor(exp/100)+1)
- [x] `src/composables/useAuth.ts`
- [x] `src/composables/usePagination.ts`

### Layouts ✅
- [x] `src/layouts/DefaultLayout.vue` (Navbar + Footer)
- [x] `src/layouts/AuthLayout.vue`

### Components ✅
- [x] `src/components/common/AppToast.vue`
- [x] `src/components/common/AppPagination.vue`
- [x] `src/components/common/AppSpinner.vue`
- [x] `src/components/common/AppModal.vue`
- [x] `src/components/layout/AppNavbar.vue`
- [x] `src/components/layout/AppFooter.vue`
- [x] `src/components/shops/ShopCard.vue`
- [x] `src/components/shops/ShopFilterSidebar.vue`

### Views ✅
- [x] `src/views/HomeView.vue`
- [x] `src/views/ShopListView.vue`
- [x] `src/views/ShopDetailView.vue`
- [x] `src/views/RankingsView.vue`
- [x] `src/views/auth/LoginView.vue`
- [x] `src/views/auth/RegisterView.vue`
- [x] `src/views/user/DashboardView.vue`
- [x] `src/views/user/SubmitShopView.vue`

### Docs ✅
- [x] `docs/pages/home.md`
- [x] `docs/pages/shop-list.md`
- [x] `docs/pages/shop-detail.md`
- [x] `docs/pages/rankings.md`
- [x] `docs/pages/login.md`
- [x] `docs/pages/register.md`
- [x] `docs/pages/dashboard.md`
- [x] `docs/pages/submit-shop.md`

### 部署 ✅
- [x] `.env.example`
- [x] `_redirects` (Cloudflare Pages SPA)
- [x] `.github/workflows/ci.yml`
- [x] `.github/workflows/deploy.yml`

---

## CI/CD

### ci.yml
```yaml
jobs:
  lint-typecheck:
    steps: npm ci → tsc → eslint

  fortify-sast:
    needs: lint-typecheck
```

### deploy.yml
```yaml
jobs:
  deploy:
    needs: fortify-sast (on main push)
    steps: npm ci → npm run build → cloudflare/pages-action@v1
```

---

## 部署

- **平台**: Cloudflare Pages
- **Build command**: `npm run build`
- **Output directory**: `dist`
- **環境變數**: `VITE_API_BASE_URL=https://ramendo-api.onrender.com`
