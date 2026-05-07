<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { rankingsApi } from '@/api/rankings'
import type { RankingType } from '@/types'
import AppSpinner from '@/components/common/AppSpinner.vue'
import defaultShopImg from '@/assets/default-shop.png'

const activeType = ref<RankingType>('combined')

const TABS: { key: RankingType; label: string; desc: string }[] = [
  { key: 'combined', label: '綜合排名', desc: '結合用戶評分與 Google 評分' },
  { key: 'user', label: '用戶評分', desc: '依用戶評分排序' },
  { key: 'google', label: 'Google 評分', desc: '依 Google 評分排序' },
]

const { data, isLoading } = useQuery({
  queryKey: ['rankings', activeType],
  queryFn: () => rankingsApi.getList(activeType.value, 30).then((r) => r.data.data),
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-10">
    <h1 class="section-title text-6xl mb-2">排行榜</h1>
    <p class="text-site-gray-lighter mb-8">台灣拉麵店家評分排行</p>

    <!-- Type Tabs -->
    <div class="flex gap-1 mb-8 border-b border-site-gray">
      <button
        v-for="tab in TABS"
        :key="tab.key"
        class="font-bebas text-lg tracking-wider px-5 py-2 border-b-2 transition-colors"
        :class="activeType === tab.key
          ? 'border-red text-cream'
          : 'border-transparent text-site-gray-lighter hover:text-cream'"
        @click="activeType = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <AppSpinner v-if="isLoading" />

    <div v-else-if="data?.length" class="space-y-2">
      <RouterLink
        v-for="item in data"
        :key="item.shopGuid"
        :to="`/ramen-shops/${item.shopGuid}`"
        class="flex items-center gap-4 p-4 rounded-lg bg-ink-light border border-site-gray hover:border-red/50 transition-all hover:-translate-x-1 group"
      >
        <!-- Rank -->
        <div class="w-12 text-center">
          <span
            class="font-bebas text-3xl"
            :class="{
              'text-[#FFD700]': item.rank === 1,
              'text-[#C0C0C0]': item.rank === 2,
              'text-[#CD7F32]': item.rank === 3,
              'text-site-gray-lighter': item.rank > 3,
            }"
          >
            {{ item.rank }}
          </span>
        </div>

        <!-- Image -->
        <div class="w-12 h-12 rounded bg-ink overflow-hidden shrink-0">
          <img :src="item.coverImage ?? defaultShopImg" class="w-full h-full object-cover" />
        </div>

        <!-- Name -->
        <div class="flex-1 min-w-0">
          <p class="font-bebas text-xl tracking-wide group-hover:text-red transition-colors truncate">
            {{ item.shopName }}
          </p>
          <p class="text-xs text-site-gray-lighter">{{ item.city }} {{ item.district }}</p>
        </div>

        <!-- Score + Reviews -->
        <div class="text-right">
          <p class="font-mono text-cream text-lg">{{ item.score.toFixed(1) }}</p>
          <p class="text-xs text-site-gray-lighter">
            {{ activeType === 'google' ? item.googleReviewCount : item.reviewCount }} 則
          </p>
        </div>
      </RouterLink>
    </div>

    <div v-else class="text-center py-20 text-site-gray-lighter">
      <p class="font-bebas text-4xl">暫無排行資料</p>
    </div>
  </div>
</template>
