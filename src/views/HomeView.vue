<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { shopsApi } from '@/api/shops'
import { rankingsApi } from '@/api/rankings'
import ShopCard from '@/components/shops/ShopCard.vue'
import AppSpinner from '@/components/common/AppSpinner.vue'

const { data: shopsData, isLoading: loadingShops } = useQuery({
  queryKey: ['shops', 'featured'],
  queryFn: () => shopsApi.getList({ sort: 'rating', limit: 6 }).then((r) => r.data.data),
})

const { data: rankData } = useQuery({
  queryKey: ['rankings', 'combined'],
  queryFn: () => rankingsApi.getList('combined', 5).then((r) => r.data.data),
})
</script>

<template>
  <!-- Hero -->
  <section class="relative min-h-[60vh] flex items-center overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-b from-red-dark/30 to-ink" />
    <div class="relative max-w-7xl mx-auto px-4 py-24">
      <h1 class="font-bebas text-7xl md:text-9xl tracking-widest text-cream leading-none">
        <span class="bg-red text-white leading-none px-1">拉</span>麵道
      </h1>
      <p class="text-cream-dark mt-4 max-w-md text-lg">
        探索台灣最棒的拉麵體驗 — 從豚骨到醬油，每一碗都是一段故事。
      </p>
      <div class="flex gap-4 mt-8">
        <RouterLink to="/ramen-shops" class="btn-primary text-xl px-8 py-3">探索店家</RouterLink>
        <RouterLink to="/rankings" class="btn-outline text-xl px-8 py-3">排行榜</RouterLink>
      </div>
    </div>
  </section>

  <!-- Featured Shops -->
  <section class="max-w-7xl mx-auto px-4 py-16">
    <div class="flex items-end justify-between mb-8">
      <h2 class="section-title">精選店家</h2>
      <RouterLink to="/ramen-shops" class="text-sm text-site-gray-lighter hover:text-cream transition-colors">
        查看全部 →
      </RouterLink>
    </div>
    <AppSpinner v-if="loadingShops" />
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <ShopCard
        v-for="shop in shopsData?.items"
        :key="shop.id"
        :shop="shop"
      />
    </div>
  </section>

  <!-- Top Rankings Preview -->
  <section v-if="rankData?.length" class="bg-ink-light border-y border-site-gray py-16">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex items-end justify-between mb-8">
        <h2 class="section-title">本週排行</h2>
        <RouterLink to="/rankings" class="text-sm text-site-gray-lighter hover:text-cream transition-colors">
          完整排行 →
        </RouterLink>
      </div>
      <div class="space-y-3">
        <RouterLink
          v-for="item in rankData"
          :key="item.shopGuid"
          :to="`/ramen-shops/${item.shopGuid}`"
          class="flex items-center gap-4 p-4 rounded-lg bg-ink border border-site-gray hover:border-red/50 transition-colors"
        >
          <span class="font-bebas text-3xl w-8 text-center" :class="item.rank <= 3 ? 'text-red' : 'text-site-gray-lighter'">
            {{ item.rank }}
          </span>
          <div class="flex-1 min-w-0">
            <p class="font-bebas text-lg tracking-wide truncate">{{ item.shopName }}</p>
            <p class="text-xs text-site-gray-lighter">{{ item.city }} {{ item.district }}</p>
          </div>
          <span class="font-mono text-cream text-sm">{{ item.score.toFixed(1) }}</span>
        </RouterLink>
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="max-w-7xl mx-auto px-4 py-20 text-center">
    <h2 class="section-title text-5xl mb-4">知道好店？</h2>
    <p class="text-cream-dark mb-8">登入後可以提案新店家，讓更多拉麵愛好者發現它。</p>
    <RouterLink to="/user/submit-shop" class="btn-primary text-xl px-10 py-3">提案店家</RouterLink>
  </section>
</template>
