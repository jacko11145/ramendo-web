# 拉麵道前台 — ramendo-web

台灣拉麵資訊平台前台，Vue 3 + Vite + TypeScript + Tailwind CSS。

---

## 技術棧

| 類別 | 技術 |
|------|------|
| 框架 | Vue 3 (Composition API) + Vite |
| 語言 | TypeScript |
| 樣式 | Tailwind CSS 3（自訂設計 Token） |
| 狀態管理 | Pinia |
| 伺服器狀態 | TanStack Query (Vue Query) |
| 路由 | Vue Router 4 |
| HTTP | Axios（自動 JWT refresh） |
| 部署 | Cloudflare Pages |

---

## 功能

- 店家探索 — 篩選城市、湯底類型、排序；卡片顯示營業狀態、評分、類型標籤
- 店家詳情 — 菜單、評論（含發表）、營業時間、聯絡資訊
- 排行榜 — 用戶評分 / Google 評分 / 綜合排名
- 用戶認證 — Email 登入/註冊（邀請碼選填）、Google OAuth
- 個人儀表板 — 收藏清單、提案紀錄、等級與經驗值
- 提案店家 — 填寫店家資訊送審
- 收藏功能 — 從店家卡片或詳情頁一鍵加入/移除

---

## 本地執行

```bash
cp .env.example .env.development   # 第一次
npm install
npm run dev                         # http://localhost:3000
npm run build                       # 正式建置
```

### 前置需求

- Node.js 20+
- `ramendo-api` 在 `http://localhost:5000` 運行

---

## 環境變數

```
VITE_API_BASE_URL=http://localhost:5000
```

---

## 專案結構

```
src/
  api/              ← Axios API 模組（auth/shops/reviews/rankings/favorites/submissions）
  types/            ← TypeScript 型別（對應 API 回應）
  stores/           ← Pinia stores（auth / ui / shop-filters）
  router/           ← Vue Router + auth guard
  composables/      ← useShopStatus / useLevel / useAuth / usePagination
  utils/            ← shopTypes.ts（湯底類型顏色對應）
  layouts/          ← DefaultLayout（Navbar+Footer）/ AuthLayout
  views/            ← 8 個頁面元件
  components/
    common/         ← AppToast / AppPagination / AppSpinner / AppModal
    layout/         ← AppNavbar / AppFooter
    shops/          ← ShopCard / ShopFilterSidebar
```

---

## 設計規範

### 色彩 Token

| Token | 顏色 | 用途 |
|-------|------|------|
| `ink` | `#0C0C0C` | 背景 |
| `red` | `#C8201A` | 主色／CTA |
| `cream` | `#F0E9D6` | 主要文字 |
| `cream-dark` | `#DDD3B8` | 次要文字 |
| `site-gray` | `#3A3A3A` | 邊框／卡片背景 |

### 字型

| 用途 | 字體 Class |
|------|-----------|
| 標題 | `font-bebas` (Bebas Neue) |
| 裝飾 | `font-marker` (Permanent Marker) |
| 內文 | `font-body` (Noto Sans TC) |
| 等寬 | `font-mono` (Share Tech Mono) |

### 常用元件 Class

```html
<button class="btn-primary">主要按鈕</button>
<button class="btn-outline">次要按鈕</button>
<div class="card p-4">卡片</div>
<input class="input-field" />
<span class="tag">標籤</span>
<h2 class="section-title">區塊標題</h2>
```

---

## 部署

| 項目 | 說明 |
|------|------|
| 平台 | Cloudflare Pages |
| Build command | `npm run build` |
| Output directory | `dist` |
| 正式 API | `VITE_API_BASE_URL=https://ramendo-api.onrender.com` |

CI/CD 透過 GitHub Actions 自動部署（push to `main`）。
