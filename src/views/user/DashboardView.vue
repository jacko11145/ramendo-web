<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useQuery } from '@tanstack/vue-query'
import { useAuthStore } from '@/stores/auth.store'
import { useLevel } from '@/composables/useLevel'
import { favoritesApi } from '@/api/favorites'
import { submissionsApi } from '@/api/submissions'
import AppSpinner from '@/components/common/AppSpinner.vue'
import type { ShopSubmission } from '@/types'

const { user } = storeToRefs(useAuthStore())
const points = computed(() => user.value?.experiencePoints ?? 0)
const { level, currentLevelPoints, nextLevelPoints, progress } = useLevel(points)

const activeTab = ref<'favorites' | 'submissions'>('favorites')

const { data: favorites, isLoading: loadingFav } = useQuery({
  queryKey: ['user-favorites'],
  queryFn: () => favoritesApi.getList().then((r) => r.data.data),
  enabled: computed(() => !!user.value),
})

const { data: submissions, isLoading: loadingSub } = useQuery({
  queryKey: ['user-submissions'],
  queryFn: () => submissionsApi.getMySubmissions().then((r) => r.data.data),
  enabled: computed(() => !!user.value),
})

const STATUS_LABEL: Record<ShopSubmission['status'], string> = {
  Pending: '審核中',
  Approved: '已通過',
  Rejected: '已拒絕',
}
const STATUS_CLASS: Record<ShopSubmission['status'], string> = {
  Pending: 'bg-yellow-900/50 text-yellow-300',
  Approved: 'bg-green-900/50 text-green-300',
  Rejected: 'bg-red/20 text-red-light',
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-10">
    <!-- Profile Card -->
    <div class="card p-6 mb-8 flex items-start gap-6">
      <div class="w-16 h-16 rounded-full bg-red flex items-center justify-center font-bebas text-3xl shrink-0">
        {{ user?.name?.charAt(0) ?? 'U' }}
      </div>
      <div class="flex-1">
        <h1 class="font-bebas text-3xl tracking-wide">{{ user?.name }}</h1>
        <p class="text-site-gray-lighter text-sm">{{ user?.email }}</p>
        <div class="flex items-center gap-2 mt-2">
          <span class="tag">Lv.{{ level }}</span>
          <span v-if="user?.isVip" class="tag bg-red/20 text-red-light">VIP</span>
          <span class="text-xs text-site-gray-lighter font-mono">{{ user?.role }}</span>
        </div>
        <!-- XP Progress Bar -->
        <div class="mt-3">
          <div class="flex justify-between text-xs text-site-gray-lighter mb-1">
            <span>{{ currentLevelPoints }} / {{ nextLevelPoints }} XP</span>
            <span>下一等級</span>
          </div>
          <div class="h-1.5 bg-site-gray rounded-full overflow-hidden">
            <div class="h-full bg-red transition-all duration-500 rounded-full" :style="{ width: `${progress}%` }" />
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 border-b border-site-gray mb-6">
      <button
        v-for="tab in [{ key: 'favorites', label: '我的收藏' }, { key: 'submissions', label: '提案記錄' }]"
        :key="tab.key"
        class="font-bebas text-lg tracking-wider px-5 py-2 border-b-2 transition-colors"
        :class="activeTab === tab.key ? 'border-red text-cream' : 'border-transparent text-site-gray-lighter hover:text-cream'"
        @click="activeTab = tab.key as 'favorites' | 'submissions'"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Favorites -->
    <div v-if="activeTab === 'favorites'">
      <AppSpinner v-if="loadingFav" />
      <div v-else-if="favorites?.length" class="space-y-3">
        <RouterLink
          v-for="fav in favorites"
          :key="fav.shopGuid"
          :to="`/ramen-shops/${fav.shopGuid}`"
          class="card p-4 flex items-center gap-4 hover:border-red/50 transition-colors"
        >
          <div class="flex-1">
            <p class="font-bebas text-lg">{{ fav.shopName }}</p>
            <p class="text-xs text-site-gray-lighter">{{ fav.city }} {{ fav.district }}</p>
          </div>
          <span
            class="text-xs px-2 py-0.5 rounded font-mono"
            :class="fav.isOpen ? 'text-green-300' : 'text-site-gray-lighter'"
          >
            {{ fav.isOpen ? '營業中' : '休息中' }}
          </span>
        </RouterLink>
      </div>
      <div v-else class="text-center py-12 text-site-gray-lighter">
        <p class="font-bebas text-3xl mb-2">尚無收藏</p>
        <RouterLink to="/ramen-shops" class="btn-outline text-sm mt-4 inline-block">探索店家</RouterLink>
      </div>
    </div>

    <!-- Submissions -->
    <div v-if="activeTab === 'submissions'">
      <div class="flex justify-between items-center mb-4">
        <p class="text-sm text-site-gray-lighter">共 {{ submissions?.length ?? 0 }} 筆提案</p>
        <RouterLink to="/user/submit-shop" class="btn-primary text-sm px-4 py-1.5">提案新店家</RouterLink>
      </div>
      <AppSpinner v-if="loadingSub" />
      <div v-else-if="submissions?.length" class="space-y-3">
        <div v-for="sub in submissions" :key="sub.id" class="card p-4">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="font-bebas text-lg">{{ sub.shopName }}</p>
              <p class="text-xs text-site-gray-lighter">{{ sub.city }} {{ sub.district }}</p>
            </div>
            <span class="px-2 py-0.5 text-xs rounded font-mono" :class="STATUS_CLASS[sub.status]">
              {{ STATUS_LABEL[sub.status] }}
            </span>
          </div>
          <p v-if="sub.rejectionReason" class="text-xs text-red mt-2">原因：{{ sub.rejectionReason }}</p>
          <p class="text-xs text-site-gray-lighter mt-2 font-mono">{{ sub.submittedAt.slice(0, 10) }}</p>
        </div>
      </div>
      <div v-else class="text-center py-12 text-site-gray-lighter">
        <p class="font-bebas text-3xl mb-2">尚無提案記錄</p>
      </div>
    </div>
  </div>
</template>
