import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/auth'
import type { UserSession } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<UserSession | null>(null)
  const accessToken = ref<string | null>(localStorage.getItem('accessToken'))
  const refreshToken = ref<string | null>(localStorage.getItem('refreshToken'))

  const isLoggedIn = computed(() => !!accessToken.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'Admin')
  const isVip = computed(() => user.value?.isVip || user.value?.role === 'Admin')

  function setTokens(access: string, refresh: string) {
    accessToken.value = access
    refreshToken.value = refresh
    localStorage.setItem('accessToken', access)
    localStorage.setItem('refreshToken', refresh)
  }

  function clearAuth() {
    user.value = null
    accessToken.value = null
    refreshToken.value = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }

  async function login(email: string, password: string) {
    const res = await authApi.login({ email, password })
    const data = res.data.data!
    setTokens(data.accessToken, data.refreshToken)
    user.value = data.user
  }

  async function loginWithGoogle(idToken: string) {
    const res = await authApi.google(idToken)
    const data = res.data.data!
    setTokens(data.accessToken, data.refreshToken)
    user.value = data.user
  }

  async function register(email: string, password: string, name: string, invitationCode: string) {
    const res = await authApi.register({ email, password, name, invitationCode })
    const data = res.data.data!
    setTokens(data.accessToken, data.refreshToken)
    user.value = data.user
  }

  async function logout() {
    if (refreshToken.value) {
      await authApi.logout(refreshToken.value).catch(() => {})
    }
    clearAuth()
  }

  async function fetchMe() {
    if (!accessToken.value) return
    const res = await authApi.me()
    user.value = res.data.data
  }

  return {
    user, accessToken, refreshToken,
    isLoggedIn, isAdmin, isVip,
    login, loginWithGoogle, register, logout, fetchMe, clearAuth,
  }
})
