<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useShopFiltersStore } from '@/stores/shop-filters.store'

const filters = useShopFiltersStore()
const { city, types, sort } = storeToRefs(filters)

const CITIES = ['台北市', '新北市', '桃園市', '台中市', '台南市', '高雄市', '新竹市', '基隆市']
const TYPES = ['豚骨', '醬油', '鹽味', '味噌', '沾麵', '冷麵', '台式', '創意']
const SORT_OPTIONS = [
  { value: 'rating', label: '評分最高' },
  { value: 'reviews', label: '評論最多' },
  { value: 'newest', label: '最新上線' },
]
</script>

<template>
  <aside class="w-64 shrink-0 space-y-6">
    <!-- Sort -->
    <div>
      <p class="text-xs font-mono text-site-gray-lighter uppercase mb-2">排序</p>
      <div class="flex flex-col gap-1">
        <button
          v-for="opt in SORT_OPTIONS"
          :key="opt.value"
          class="text-left text-sm px-3 py-1.5 rounded transition-colors"
          :class="sort === opt.value ? 'bg-red text-white' : 'text-cream-dark hover:text-cream'"
          @click="filters.$patch({ sort: opt.value as 'rating' | 'reviews' | 'newest', page: 1 })"
        >
          {{ opt.label }}
        </button>
      </div>
    </div>

    <!-- City -->
    <div>
      <p class="text-xs font-mono text-site-gray-lighter uppercase mb-2">城市</p>
      <select
        v-model="city"
        class="input-field text-sm"
        @change="filters.$patch({ district: '', page: 1 })"
      >
        <option value="">全部城市</option>
        <option v-for="c in CITIES" :key="c" :value="c">{{ c }}</option>
      </select>
    </div>

    <!-- Types -->
    <div>
      <p class="text-xs font-mono text-site-gray-lighter uppercase mb-2">湯底類型</p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="t in TYPES"
          :key="t"
          class="tag cursor-pointer transition-colors"
          :class="types.includes(t) ? 'bg-red text-white' : 'hover:bg-site-gray'"
          @click="filters.toggleType(t)"
        >
          {{ t }}
        </button>
      </div>
    </div>

    <button class="btn-ghost w-full text-sm" @click="filters.reset()">清除篩選</button>
  </aside>
</template>
