import { computed, type Ref } from 'vue'

export function useLevel(points: Ref<number>) {
  const level = computed(() => Math.floor(points.value / 100) + 1)
  const currentLevelPoints = computed(() => points.value % 100)
  const nextLevelPoints = computed(() => 100)
  const progress = computed(() => (currentLevelPoints.value / nextLevelPoints.value) * 100)

  return { level, currentLevelPoints, nextLevelPoints, progress }
}
