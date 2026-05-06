<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { storeToRefs } from 'pinia'
import { shopsApi } from '@/api/shops'
import { reviewsApi } from '@/api/reviews'
import { favoritesApi } from '@/api/favorites'
import { useAuthStore } from '@/stores/auth.store'
import { useShopStatus } from '@/composables/useShopStatus'
import { getTypeClass } from '@/utils/shopTypes'
import AppSpinner from '@/components/common/AppSpinner.vue'
import AppPagination from '@/components/common/AppPagination.vue'
import type { BusinessHours } from '@/types'

const route = useRoute()
const guid = computed(() => route.params.guid as string)
const reviewPage = ref(1)

const { isLoggedIn } = storeToRefs(useAuthStore())
const qc = useQueryClient()

const DAY_LABELS: Record<keyof BusinessHours, string> = {
  monday: '週一', tuesday: '週二', wednesday: '週三',
  thursday: '週四', friday: '週五', saturday: '週六', sunday: '週日',
}

const { data: shop, isLoading } = useQuery({
  queryKey: ['shop', guid],
  queryFn: () => shopsApi.getByGuid(guid.value).then((r) => r.data.data),
})

const { data: reviewData, isLoading: loadingReviews } = useQuery({
  queryKey: ['shop-reviews', guid, reviewPage],
  queryFn: () => reviewsApi.getByShop(guid.value, reviewPage.value).then((r) => r.data.data),
})

const { data: favorites } = useQuery({
  queryKey: ['user-favorites'],
  queryFn: () => favoritesApi.getList().then((r) => r.data.data),
  enabled: isLoggedIn,
})

const isFavorited = computed(() =>
  favorites.value?.some((f) => f.shopGuid === shop.value?.id) ?? false
)

const { mutate: toggleFavorite, isPending: toggling } = useMutation({
  mutationFn: () => favoritesApi.toggle(shop.value!.id),
  onSuccess: () => qc.invalidateQueries({ queryKey: ['user-favorites'] }),
})

const shopBusinessHours = computed(() => shop.value?.businessHours ?? null)
const { isOpen, todayHours: _todayHours } = useShopStatus(shopBusinessHours)

const activeTab = ref<'menu' | 'reviews' | 'info'>('menu')
const lightboxIndex = ref<number | null>(null)

// ─── Review form ─────────────────────────────────────────────────────────────
const newRating = ref(0)
const hoverRating = ref(0)
const newVisitDate = ref('')
const newComment = ref('')
const reviewError = ref('')

const { mutate: submitReview, isPending: submittingReview } = useMutation({
  mutationFn: () => reviewsApi.create({
    shopGuid: shop.value!.id,
    rating: newRating.value,
    visitDate: newVisitDate.value,
    comment: newComment.value || undefined,
  }),
  onSuccess: () => {
    newRating.value = 0
    newVisitDate.value = ''
    newComment.value = ''
    reviewError.value = ''
    qc.invalidateQueries({ queryKey: ['shop-reviews', guid] })
    qc.invalidateQueries({ queryKey: ['shop', guid] })
  },
  onError: () => {
    reviewError.value = '送出失敗，請稍後再試'
  },
})

function handleSubmitReview() {
  if (!newRating.value) { reviewError.value = '請選擇評分'; return }
  if (!newVisitDate.value) { reviewError.value = '請填寫造訪日期'; return }
  reviewError.value = ''
  submitReview()
}
</script>

<template>
  <AppSpinner v-if="isLoading" class="mt-20" />

  <div v-else-if="shop" class="max-w-5xl mx-auto px-4 py-8">
    <!-- Hero -->
    <div class="relative rounded-xl overflow-hidden mb-8 aspect-[21/9] bg-ink-light">
      <img v-if="shop.coverImage" :src="shop.coverImage" :alt="shop.name" class="w-full h-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />

      <!-- Favorite button -->
      <button
        v-if="isLoggedIn"
        class="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-body backdrop-blur-sm transition-all"
        :class="isFavorited
          ? 'bg-red text-white'
          : 'bg-ink/60 text-cream hover:bg-red/80 hover:text-white'"
        :disabled="toggling"
        @click="toggleFavorite()"
      >
        <span class="text-base leading-none">{{ isFavorited ? '♥' : '♡' }}</span>
        {{ isFavorited ? '已收藏' : '加入收藏' }}
      </button>

      <div class="absolute bottom-6 left-6">
        <div class="flex items-center gap-2 mb-2">
          <span
            class="px-2 py-0.5 text-xs font-mono rounded"
            :class="isOpen ? 'bg-green-800/80 text-green-200' : 'bg-site-gray/80 text-cream-dark'"
          >
            {{ isOpen ? '營業中' : '休息中' }}
          </span>
          <span v-if="shop.isVerified" class="text-red font-bebas">✦ 認證店家</span>
        </div>
        <h1 class="font-bebas text-5xl tracking-widest text-white">{{ shop.name }}</h1>
        <p class="text-cream-dark mt-1">{{ shop.city }} {{ shop.district }} · {{ shop.address }}</p>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-3 gap-4 mb-8">
      <div v-for="stat in [
        { label: '用戶評分', value: shop.userRating?.toFixed(1) ?? '—' },
        { label: 'Google 評分', value: shop.googleRating?.toFixed(1) ?? '—' },
        { label: '評論數', value: String(shop.reviewCount) },
      ]" :key="stat.label" class="card p-4 text-center">
        <p class="font-bebas text-3xl text-cream">{{ stat.value }}</p>
        <p class="text-xs text-site-gray-lighter mt-1">{{ stat.label }}</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 border-b border-site-gray mb-6">
      <button
        v-for="tab in [
          { key: 'menu', label: '菜單' },
          { key: 'reviews', label: '評論' },
          { key: 'info', label: '資訊' },
        ]"
        :key="tab.key"
        class="font-bebas text-lg tracking-wider px-6 py-2 border-b-2 transition-colors"
        :class="activeTab === tab.key
          ? 'border-red text-cream'
          : 'border-transparent text-site-gray-lighter hover:text-cream'"
        @click="activeTab = tab.key as 'menu' | 'reviews' | 'info'"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Menu Tab -->
    <div v-if="activeTab === 'menu'">
      <div v-if="shop.menuItems.length" class="space-y-3">
        <div
          v-for="item in shop.menuItems"
          :key="item.id"
          class="card p-4 flex items-start gap-4"
        >
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <span class="font-bebas text-lg text-cream">{{ item.name }}</span>
              <span v-if="item.isHighlight" class="tag bg-red/20 text-red-light">推薦</span>
              <span v-if="item.isLimited" class="tag">限定</span>
            </div>
            <p v-if="item.description" class="text-xs text-site-gray-lighter mt-1">{{ item.description }}</p>
          </div>
          <span class="font-mono text-cream-dark text-sm whitespace-nowrap">NT$ {{ item.price }}</span>
        </div>
      </div>
      <p v-else class="text-site-gray-lighter text-center py-10">尚無菜單資料</p>
    </div>

    <!-- Reviews Tab -->
    <div v-if="activeTab === 'reviews'">
      <!-- Write Review Form -->
      <div v-if="isLoggedIn" class="card p-5 mb-6">
        <h4 class="font-bebas text-xl tracking-wider text-cream mb-4">發表評論</h4>

        <!-- Star Rating -->
        <div class="flex gap-1 mb-4">
          <button
            v-for="n in 5"
            :key="n"
            class="text-2xl leading-none transition-colors"
            :class="(hoverRating || newRating) >= n ? 'text-amber-400' : 'text-site-gray'"
            @mouseenter="hoverRating = n"
            @mouseleave="hoverRating = 0"
            @click="newRating = n"
          >★</button>
          <span v-if="newRating" class="ml-2 text-sm text-site-gray-lighter self-center">{{ newRating }}.0</span>
        </div>

        <!-- Visit Date -->
        <div class="mb-3">
          <label class="block text-xs text-site-gray-lighter mb-1">造訪日期</label>
          <input
            v-model="newVisitDate"
            type="date"
            class="input-field w-full sm:w-48"
            :max="new Date().toISOString().slice(0, 10)"
          />
        </div>

        <!-- Comment -->
        <div class="mb-4">
          <label class="block text-xs text-site-gray-lighter mb-1">評論內容（選填）</label>
          <textarea
            v-model="newComment"
            class="input-field w-full resize-none"
            rows="3"
            placeholder="分享你的用餐體驗..."
          />
        </div>

        <p v-if="reviewError" class="text-red text-xs mb-3">{{ reviewError }}</p>

        <button
          class="btn-primary"
          :disabled="submittingReview"
          @click="handleSubmitReview"
        >
          {{ submittingReview ? '送出中...' : '送出評論' }}
        </button>
      </div>

      <!-- Review List -->
      <AppSpinner v-if="loadingReviews" />
      <div v-else-if="reviewData?.items.length" class="space-y-4">
        <div v-for="review in reviewData.items" :key="review.id" class="card p-4">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-9 h-9 rounded-full bg-red flex items-center justify-center text-sm font-bebas shrink-0">
              {{ (review.userName ?? '?').charAt(0) }}
            </div>
            <div>
              <p class="text-sm text-cream">{{ review.userName ?? '匿名' }}</p>
              <p class="text-xs text-site-gray-lighter">
                Lv.{{ review.userLevel }}
                <span v-if="review.visitDate"> · 造訪 {{ review.visitDate }}</span>
              </p>
            </div>
            <span class="ml-auto font-mono text-cream">★ {{ review.rating }}</span>
          </div>
          <p v-if="review.comment" class="text-sm text-cream-dark">{{ review.comment }}</p>
        </div>
        <AppPagination
          v-if="reviewData"
          :total="reviewData.total"
          :page="reviewPage"
          :limit="reviewData.limit"
          @update:page="reviewPage = $event"
        />
      </div>
      <p v-else class="text-site-gray-lighter text-center py-10">尚無評論</p>
    </div>

    <!-- Info Tab -->
    <div v-if="activeTab === 'info'" class="space-y-6">
      <!-- Gallery -->
      <div v-if="shop.images?.length">
        <h3 class="section-title text-2xl mb-3">店家照片</h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <div
            v-for="(url, i) in shop.images"
            :key="i"
            class="aspect-square bg-ink rounded-lg overflow-hidden cursor-pointer"
            @click="lightboxIndex = i"
          >
            <img :src="url" class="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
          </div>
        </div>
      </div>

      <!-- Lightbox -->
      <Teleport to="body">
        <div
          v-if="lightboxIndex !== null"
          class="fixed inset-0 bg-ink/95 z-50 flex items-center justify-center"
          @click.self="lightboxIndex = null"
        >
          <button class="absolute top-4 right-4 text-cream text-3xl leading-none" @click="lightboxIndex = null">✕</button>
          <button
            v-if="lightboxIndex > 0"
            class="absolute left-4 text-cream text-4xl leading-none px-3"
            @click="lightboxIndex = lightboxIndex! - 1"
          >‹</button>
          <img :src="shop.images[lightboxIndex]" class="max-w-[90vw] max-h-[85vh] object-contain rounded-lg" />
          <button
            v-if="lightboxIndex < shop.images.length - 1"
            class="absolute right-4 text-cream text-4xl leading-none px-3"
            @click="lightboxIndex = lightboxIndex! + 1"
          >›</button>
        </div>
      </Teleport>
      <!-- News -->
      <div v-if="shop.newsItems.length">
        <h3 class="section-title text-2xl mb-3">最新公告</h3>
        <div v-for="n in shop.newsItems" :key="n.title" class="card p-4">
          <p class="font-bebas text-lg text-cream">{{ n.title }}</p>
          <p class="text-sm text-cream-dark mt-1">{{ n.content }}</p>
          <p class="text-xs text-site-gray-lighter mt-2">{{ n.startDate }} — {{ n.endDate }}</p>
        </div>
      </div>

      <!-- Business Hours -->
      <div v-if="shop.businessHours">
        <h3 class="section-title text-2xl mb-3">營業時間</h3>
        <div class="card divide-y divide-site-gray">
          <div
            v-for="(key, i) in (Object.keys(DAY_LABELS) as (keyof BusinessHours)[])"
            :key="i"
            class="flex justify-between px-4 py-2 text-sm"
          >
            <span class="text-site-gray-lighter">{{ DAY_LABELS[key] }}</span>
            <span class="text-cream">
              {{ shop.businessHours![key] ? `${shop.businessHours![key]!.open} — ${shop.businessHours![key]!.close}` : '休息' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Contact -->
      <div class="card p-4 space-y-2 text-sm">
        <div v-if="shop.phone" class="flex gap-3"><span class="text-site-gray-lighter w-16">電話</span><span>{{ shop.phone }}</span></div>
        <div v-if="shop.website" class="flex gap-3"><span class="text-site-gray-lighter w-16">網站</span><a :href="shop.website" target="_blank" class="text-red hover:underline">{{ shop.website }}</a></div>
        <div v-if="shop.instagram" class="flex gap-3"><span class="text-site-gray-lighter w-16">IG</span><a :href="`https://instagram.com/${shop.instagram}`" target="_blank" class="text-red hover:underline">@{{ shop.instagram }}</a></div>

        <!-- Type tags -->
        <div v-if="shop.types?.length" class="flex gap-3 pt-1">
          <span class="text-site-gray-lighter w-16 shrink-0">湯底</span>
          <div class="flex flex-wrap gap-1">
            <span
              v-for="t in shop.types"
              :key="t"
              class="text-xs px-1.5 py-0.5 rounded font-mono"
              :class="getTypeClass(t)"
            >{{ t }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="text-center py-20 text-site-gray-lighter">
    <p class="font-bebas text-4xl">找不到這間店家</p>
  </div>
</template>
