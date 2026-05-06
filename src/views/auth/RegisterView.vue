<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useUiStore } from '@/stores/ui.store'

const auth = useAuthStore()
const ui = useUiStore()
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const confirm = ref('')
const invitationCode = ref('')
const loading = ref(false)
const error = ref('')

async function handleRegister() {
  error.value = ''
  if (password.value !== confirm.value) {
    error.value = '密碼不一致'
    return
  }
  loading.value = true
  try {
    await auth.register(email.value, password.value, name.value, invitationCode.value || undefined)
    ui.toast.success('註冊成功！歡迎加入拉麵道')
    router.push('/')
  } catch (e: unknown) {
    error.value = (e as { response?: { data?: { message?: string } } })?.response?.data?.message ?? '註冊失敗，請稍後再試'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="card w-full max-w-sm p-8">
    <h2 class="font-bebas text-3xl tracking-widest text-center mb-6">註冊</h2>

    <form @submit.prevent="handleRegister" class="space-y-4">
      <div>
        <label class="block text-xs text-site-gray-lighter mb-1">暱稱</label>
        <input v-model="name" class="input-field" placeholder="拉麵太郎" required />
      </div>
      <div>
        <label class="block text-xs text-site-gray-lighter mb-1">Email</label>
        <input v-model="email" type="email" class="input-field" placeholder="you@example.com" required />
      </div>
      <div>
        <label class="block text-xs text-site-gray-lighter mb-1">密碼</label>
        <input v-model="password" type="password" class="input-field" placeholder="至少 8 個字元" required minlength="8" />
      </div>
      <div>
        <label class="block text-xs text-site-gray-lighter mb-1">確認密碼</label>
        <input v-model="confirm" type="password" class="input-field" placeholder="••••••••" required />
      </div>
      <div>
        <label class="block text-xs text-site-gray-lighter mb-1">邀請碼 <span class="text-site-gray">(選填)</span></label>
        <input v-model="invitationCode" class="input-field font-mono uppercase" placeholder="XXXX-XXXX" />
      </div>

      <p v-if="error" class="text-red text-xs">{{ error }}</p>

      <button type="submit" class="btn-primary w-full" :disabled="loading">
        <span v-if="loading" class="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin" />
        <span v-else>建立帳號</span>
      </button>
    </form>

    <p class="text-center text-sm text-site-gray-lighter mt-6">
      已有帳號？
      <RouterLink to="/auth/login" class="text-red hover:underline">立即登入</RouterLink>
    </p>
  </div>
</template>
