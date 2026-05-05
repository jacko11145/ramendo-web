# Login Page

Route: `/login`  
View: `src/views/auth/LoginView.vue`  
Layout: `AuthLayout`  
Guard: `guestOnly` — 已登入時重導向 `/`

## API Calls

| 操作 | Endpoint | 說明 |
|------|----------|------|
| Email 登入 | `POST /api/auth/login` | 回傳 accessToken + refreshToken + user |
| Google 登入 | `POST /api/auth/google` | 傳入 Google credential，回傳 JWT pair |

## Business Logic

- 登入成功：儲存 tokens → 導向 `redirect` query param 或 `/`
- Google One Tap 使用 `google.accounts.id.initialize` + `renderButton`
- 錯誤訊息顯示於表單下方（email/password 欄位各自顯示）

## Stores

- `auth.store.ts` — `login()` / `googleLogin()` 方法

## Components

- `AppInput` — email + password 欄位
- `AppButton` — 提交按鈕
- Google Sign-In button（官方 SDK 渲染）
