<script setup lang="ts">
import { watch } from 'vue'
import { useQuery, keepPreviousData } from '@tanstack/vue-query'
import { storeToRefs } from 'pinia'
import { shopsApi } from '@/api/shops'
import { useShopFiltersStore } from '@/stores/shop-filters.store'
import ShopCard from '@/components/shops/ShopCard.vue'
import ShopFilterSidebar from '@/components/shops/ShopFilterSidebar.vue'
import AppPagination from '@/components/common/AppPagination.vue'
import AppSpinner from '@/components/common/AppSpinner.vue'

const filters = useShopFiltersStore()
const { params, page, limit } = storeToRefs(filters)

const { data, isLoading, isError } = useQuery({
  queryKey: ['shops', params],
  queryFn: () => shopsApi.getList(params.value).then((r) => r.data.data),
  placeholderData: keepPreviousData,
})

watch(params, () => window.scrollTo({ top: 0, behavior: 'smooth' }))
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-10">
    <h1 class="section-title text-5xl mb-8">店家探索</h1>

    <div class="flex gap-8">
      <ShopFilterSidebar class="hidden lg:block" />

      <div class="flex-1 min-w-0">
        <!-- Mobile filter toggle -->
        <div class="lg:hidden mb-4">
          <details class="card p-4">
            <summary class="cursor-pointer text-sm text-cream-dark">篩選條件</summary>
            <ShopFilterSidebar class="mt-4" />
          </details>
        </div>

        <AppSpinner v-if="isLoading" />

        <div v-else-if="isError" class="text-center py-12 text-site-gray-lighter">
          無法載入店家資料，請稍後再試
        </div>

        <template v-else>
          <p class="text-sm text-site-gray-lighter mb-4">共 {{ data?.total ?? 0 }} 間店家</p>

          <div v-if="data?.items.length" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
            <ShopCard v-for="shop in data.items" :key="shop.guid" :shop="shop" />
          </div>

          <div v-else class="text-center py-20 text-site-gray-lighter">
            <p class="font-bebas text-4xl mb-2">找不到店家</p>
            <p class="text-sm">試試調整篩選條件</p>
          </div>

          <AppPagination
            v-if="data"
            :total="data.total"
            :page="page"
            :limit="limit"
            @update:page="filters.setPage"
          />
        </template>
      </div>
    </div>
  </div>
</template>
