# Register Page

Route: `/register`  
View: `src/views/auth/RegisterView.vue`  
Layout: `AuthLayout`  
Guard: `guestOnly` — 已登入時重導向 `/`

## API Calls

| 操作 | Endpoint | 說明 |
|------|----------|------|
| 註冊 | `POST /api/auth/register` | 需帶 invitationCode |

## Business Logic

- 邀請碼為必填，格式驗證在前端（非空即可，後端驗證有效性）
- 密碼確認欄位：前端比對，不一致時顯示錯誤
- 註冊成功後自動登入（後端回傳 JWT pair），導向 `/`
- Email 已存在 / 邀請碼無效時顯示後端錯誤訊息

## Stores

- `auth.store.ts` — `register()` 方法（register + 自動 setTokens）

## Components

- `AppInput` — displayName / email / password / confirmPassword / invitationCode
- `AppButton` — 提交按鈕
