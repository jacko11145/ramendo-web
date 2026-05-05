import { useAuthStore } from '@/stores/auth.store'
import { useUiStore } from '@/stores/ui.store'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

export function useAuth() {
  const auth = useAuthStore()
  const ui = useUiStore()
  const router = useRouter()
  const { user, isLoggedIn, isAdmin, isVip } = storeToRefs(auth)

  async function loginAndRedirect(email: string, password: string) {
    await auth.login(email, password)
    ui.toast.success('登入成功')
    await router.push('/')
  }

  async function logoutAndRedirect() {
    await auth.logout()
    ui.toast.info('已登出')
    await router.push('/')
  }

  return { user, isLoggedIn, isAdmin, isVip, loginAndRedirect, logoutAndRedirect }
}
