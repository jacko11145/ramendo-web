import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import type { BusinessHours } from '@/types'

const DAY_KEYS: (keyof BusinessHours)[] = [
  'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday',
]

export function useShopStatus(businessHoursRef: MaybeRefOrGetter<BusinessHours | null | undefined>) {
  const isOpen = computed(() => {
    const businessHours = toValue(businessHoursRef)
    if (!businessHours) return null

    // Taiwan UTC+8
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Taipei' }))
    const dayKey = DAY_KEYS[now.getDay()]
    const hours = businessHours[dayKey]
    if (!hours) return false

    const [openH, openM] = hours.open.split(':').map(Number)
    const [closeH, closeM] = hours.close.split(':').map(Number)
    const currentMinutes = now.getHours() * 60 + now.getMinutes()
    const openMinutes = openH * 60 + openM
    const closeMinutes = closeH * 60 + closeM

    if (closeMinutes < openMinutes) {
      return currentMinutes >= openMinutes || currentMinutes < closeMinutes
    }
    return currentMinutes >= openMinutes && currentMinutes < closeMinutes
  })

  const todayHours = computed(() => {
    const businessHours = toValue(businessHoursRef)
    if (!businessHours) return null
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Taipei' }))
    const dayKey = DAY_KEYS[now.getDay()]
    return businessHours[dayKey]
  })

  return { isOpen, todayHours }
}
