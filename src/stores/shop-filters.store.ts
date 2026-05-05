import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useShopFiltersStore = defineStore('shopFilters', () => {
  const city = ref('')
  const district = ref('')
  const types = ref<string[]>([])
  const sort = ref<'rating' | 'reviews' | 'newest'>('rating')
  const page = ref(1)
  const limit = ref(12)
  const search = ref('')

  const params = computed(() => ({
    city: city.value || undefined,
    district: district.value || undefined,
    types: types.value.length ? types.value : undefined,
    sort: sort.value,
    page: page.value,
    limit: limit.value,
    search: search.value || undefined,
  }))

  function reset() {
    city.value = ''
    district.value = ''
    types.value = []
    sort.value = 'rating'
    page.value = 1
    search.value = ''
  }

  function setPage(p: number) { page.value = p }
  function toggleType(type: string) {
    const idx = types.value.indexOf(type)
    if (idx >= 0) types.value.splice(idx, 1)
    else types.value.push(type)
    page.value = 1
  }

  return { city, district, types, sort, page, limit, search, params, reset, setPage, toggleType }
})
