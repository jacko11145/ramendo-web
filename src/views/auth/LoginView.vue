<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useUiStore } from '@/stores/ui.store'

const auth = useAuthStore()
const ui = useUiStore()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(email.value, password.value)
    ui.toast.success('登入成功')
    const redirect = route.query.redirect as string | undefined
    router.push(redirect ?? '/')
  } catch (e: unknown) {
    error.value = (e as { response?: { data?: { message?: string } } })?.response?.data?.message ?? '登入失敗，請確認帳號密碼'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="card w-full max-w-sm p-8">
    <h2 class="font-bebas text-3xl tracking-widest text-center mb-6">登入</h2>

    <form @submit.prevent="handleLogin" class="space-y-4">
      <div>
        <label class="block text-xs text-site-gray-lighter mb-1">Email</label>
        <input v-model="email" type="email" class="input-field" placeholder="you@example.com" required />
      </div>
      <div>
        <label class="block text-xs text-site-gray-lighter mb-1">密碼</label>
        <input v-model="password" type="password" class="input-field" placeholder="••••••••" required />
      </div>

      <p v-if="error" class="text-red text-xs">{{ error }}</p>

      <button type="submit" class="btn-primary w-full" :disabled="loading">
        <span v-if="loading" class="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin" />
        <span v-else>登入</span>
      </button>
    </form>

    <p class="text-center text-sm text-site-gray-lighter mt-6">
      還沒有帳號？
      <RouterLink to="/auth/register" class="text-red hover:underline">立即註冊</RouterLink>
    </p>
  </div>
</template>
