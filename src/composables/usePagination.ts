import { computed, type Ref } from 'vue'

export function usePagination(total: Ref<number>, page: Ref<number>, limit: Ref<number>) {
  const totalPages = computed(() => Math.ceil(total.value / limit.value))
  const hasPrev = computed(() => page.value > 1)
  const hasNext = computed(() => page.value < totalPages.value)

  const pages = computed(() => {
    const tp = totalPages.value
    if (tp <= 7) return Array.from({ length: tp }, (_, i) => i + 1)
    const p = page.value
    if (p <= 4) return [1, 2, 3, 4, 5, '...', tp]
    if (p >= tp - 3) return [1, '...', tp - 4, tp - 3, tp - 2, tp - 1, tp]
    return [1, '...', p - 1, p, p + 1, '...', tp]
  })

  return { totalPages, hasPrev, hasNext, pages }
}
