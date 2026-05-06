<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { storeToRefs } from 'pinia'
import { favoritesApi } from '@/api/favorites'
import { useAuthStore } from '@/stores/auth.store'
import { getTypeClass } from '@/utils/shopTypes'
import type { ShopListItem } from '@/types'

defineProps<{ shop: ShopListItem }>()

const { isLoggedIn } = storeToRefs(useAuthStore())
const qc = useQueryClient()

const { data: favorites } = useQuery({
  queryKey: ['user-favorites'],
  queryFn: () => favoritesApi.getList().then((r) => r.data.data),
  enabled: isLoggedIn,
})

const isFavorited = (shopId: string) =>
  computed(() => favorites.value?.some((f) => f.shopGuid === shopId) ?? false)

const { mutate: toggleFavorite, isPending: toggling } = useMutation({
  mutationFn: (shopId: string) => favoritesApi.toggle(shopId),
  onSuccess: () => qc.invalidateQueries({ queryKey: ['user-favorites'] }),
})
</script>

<template>
  <RouterLink
    :to="`/ramen-shops/${shop.id}`"
    class="card group block transition-all duration-300 hover:-translate-y-1 hover:border-red/50"
  >
    <!-- Cover image -->
    <div class="relative aspect-[4/3] bg-ink overflow-hidden">
      <img
        v-if="shop.coverImage"
        :src="shop.coverImage"
        :alt="shop.name"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-site-gray-lighter">
        <span class="font-bebas text-5xl opacity-20">拉麵</span>
      </div>
      <!-- Open/Closed badge -->
      <div
        class="absolute top-2 left-2 px-2 py-0.5 text-xs font-mono rounded"
        :class="shop.isOpen ? 'bg-green-800/80 text-green-200' : 'bg-site-gray/80 text-cream-dark'"
      >
        {{ shop.isOpen ? '營業中' : '休息中' }}
      </div>
      <!-- Favorite heart button -->
      <button
        v-if="isLoggedIn"
        class="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full backdrop-blur-sm transition-all text-base leading-none"
        :class="isFavorited(shop.id).value
          ? 'bg-red text-white'
          : 'bg-ink/60 text-cream hover:bg-red/80'"
        :disabled="toggling"
        @click.prevent.stop="toggleFavorite(shop.id)"
      >
        {{ isFavorited(shop.id).value ? '♥' : '♡' }}
      </button>
    </div>

    <!-- Info -->
    <div class="p-4">
      <h3 class="font-bebas text-xl tracking-wide text-cream group-hover:text-red transition-colors truncate flex items-center gap-1.5">
        {{ shop.name }}
        <span v-if="shop.isVerified" class="text-red text-sm shrink-0" title="已認證">✦</span>
      </h3>
      <p class="text-xs text-site-gray-lighter mt-0.5">{{ shop.city }} {{ shop.district }}</p>

      <!-- Tags -->
      <div class="flex flex-wrap gap-1 mt-2">
        <span
          v-for="t in shop.types.slice(0, 3)"
          :key="t"
          class="text-xs px-1.5 py-0.5 rounded font-mono"
          :class="getTypeClass(t)"
        >{{ t }}</span>
      </div>

      <!-- Rating -->
      <div class="flex items-center gap-3 mt-3 text-xs text-site-gray-lighter">
        <span v-if="shop.userRating" class="text-cream">
          ★ {{ shop.userRating.toFixed(1) }}
        </span>
        <span>{{ shop.reviewCount }} 則評論</span>
        <span v-if="shop.googleRating" class="ml-auto">
          Google {{ shop.googleRating.toFixed(1) }}
        </span>
      </div>
    </div>
  </RouterLink>
</template>
