<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth.store'
import { useUiStore } from '@/stores/ui.store'

const auth = useAuthStore()
const ui = useUiStore()
const router = useRouter()
const { user, isLoggedIn } = storeToRefs(auth)
const menuOpen = ref(false)

async function handleLogout() {
  await auth.logout()
  ui.toast.info('已登出')
  router.push('/')
  menuOpen.value = false
}
</script>

<template>
  <nav class="sticky top-0 z-40 bg-ink/90 backdrop-blur border-b border-site-gray">
    <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
      <!-- Logo -->
      <RouterLink to="/" class="font-bebas text-3xl tracking-widest text-cream hover:text-red transition-colors">
        <span class="bg-red text-white leading-none px-0.5">拉</span>麵道
      </RouterLink>

      <!-- Desktop Nav -->
      <div class="hidden md:flex items-center gap-8">
        <RouterLink
          v-for="link in [
            { to: '/ramen-shops', label: '店家探索' },
            { to: '/rankings', label: '排行榜' },
          ]"
          :key="link.to"
          :to="link.to"
          class="font-body text-sm text-cream-dark hover:text-cream transition-colors"
          active-class="text-cream"
        >
          {{ link.label }}
        </RouterLink>
      </div>

      <!-- Auth -->
      <div class="hidden md:flex items-center gap-3">
        <template v-if="isLoggedIn">
          <RouterLink to="/user/dashboard" class="flex items-center gap-2 text-sm text-cream-dark hover:text-cream transition-colors">
            <div class="w-8 h-8 rounded-full bg-red flex items-center justify-center text-xs font-bebas">
              {{ user?.name?.charAt(0) ?? 'U' }}
            </div>
          </RouterLink>
          <button class="btn-ghost text-sm px-3 py-1" @click="handleLogout">登出</button>
        </template>
        <template v-else>
          <RouterLink to="/auth/login" class="btn-ghost text-sm px-4 py-1.5">登入</RouterLink>
          <RouterLink to="/auth/register" class="btn-primary text-sm px-4 py-1.5">註冊</RouterLink>
        </template>
      </div>

      <!-- Mobile hamburger -->
      <button class="md:hidden text-cream p-1" @click="menuOpen = !menuOpen">
        <span class="block w-5 h-0.5 bg-cream mb-1 transition-all" :class="menuOpen ? 'rotate-45 translate-y-1.5' : ''" />
        <span class="block w-5 h-0.5 bg-cream mb-1 transition-all" :class="menuOpen ? 'opacity-0' : ''" />
        <span class="block w-5 h-0.5 bg-cream transition-all" :class="menuOpen ? '-rotate-45 -translate-y-1.5' : ''" />
      </button>
    </div>

    <!-- Mobile Menu -->
    <Transition name="slide-down">
      <div v-if="menuOpen" class="md:hidden bg-ink-light border-t border-site-gray px-4 py-4 flex flex-col gap-3">
        <RouterLink to="/ramen-shops" class="text-cream-dark hover:text-cream py-1" @click="menuOpen = false">店家探索</RouterLink>
        <RouterLink to="/rankings" class="text-cream-dark hover:text-cream py-1" @click="menuOpen = false">排行榜</RouterLink>
        <div class="border-t border-site-gray pt-3 flex gap-3">
          <template v-if="isLoggedIn">
            <RouterLink to="/user/dashboard" class="btn-outline text-sm flex-1 text-center" @click="menuOpen = false">個人頁面</RouterLink>
            <button class="btn-ghost text-sm flex-1" @click="handleLogout">登出</button>
          </template>
          <template v-else>
            <RouterLink to="/auth/login" class="btn-outline text-sm flex-1 text-center" @click="menuOpen = false">登入</RouterLink>
            <RouterLink to="/auth/register" class="btn-primary text-sm flex-1 text-center" @click="menuOpen = false">註冊</RouterLink>
          </template>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<style scoped>
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.2s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
