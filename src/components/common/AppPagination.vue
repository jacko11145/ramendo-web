<script setup lang="ts">
import { toRefs } from 'vue'
import { usePagination } from '@/composables/usePagination'

const props = defineProps<{ total: number; page: number; limit: number }>()
const emit = defineEmits<{ (e: 'update:page', page: number): void }>()

const { total, page, limit } = toRefs(props)
const { totalPages, hasPrev, hasNext, pages } = usePagination(total, page, limit)
</script>

<template>
  <div v-if="totalPages > 1" class="flex items-center gap-1 justify-center">
    <button
      class="btn-ghost px-3"
      :disabled="!hasPrev"
      @click="emit('update:page', page - 1)"
    >
      ‹
    </button>
    <template v-for="p in pages" :key="p">
      <span v-if="p === '...'" class="px-2 text-site-gray-lighter">…</span>
      <button
        v-else
        class="w-8 h-8 rounded text-sm transition-colors"
        :class="p === page ? 'bg-red text-white' : 'text-cream hover:bg-site-gray'"
        @click="emit('update:page', p as number)"
      >
        {{ p }}
      </button>
    </template>
    <button
      class="btn-ghost px-3"
      :disabled="!hasNext"
      @click="emit('update:page', page + 1)"
    >
      ›
    </button>
  </div>
</template>
