<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { submissionsApi } from '@/api/submissions'
import { useUiStore } from '@/stores/ui.store'

const ui = useUiStore()
const router = useRouter()

const form = ref({
  shopName: '',
  city: '',
  district: '',
  address: '',
  note: '',
})
const loading = ref(false)
const error = ref('')

const CITIES = ['台北市', '新北市', '桃園市', '台中市', '台南市', '高雄市', '新竹市', '基隆市', '宜蘭縣', '花蓮縣', '台東縣', '苗栗縣', '彰化縣', '南投縣', '雲林縣', '嘉義市', '嘉義縣', '屏東縣', '澎湖縣', '金門縣', '連江縣']

async function handleSubmit() {
  error.value = ''
  loading.value = true
  try {
    await submissionsApi.create(form.value)
    ui.toast.success('提案已送出，感謝您的貢獻！')
    router.push('/user/dashboard')
  } catch (e: unknown) {
    error.value = (e as { response?: { data?: { message?: string } } })?.response?.data?.message ?? '送出失敗，請稍後再試'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-xl mx-auto px-4 py-10">
    <h1 class="section-title text-5xl mb-2">提案店家</h1>
    <p class="text-site-gray-lighter mb-8 text-sm">發現了值得推薦的拉麵店？告訴我們！</p>

    <form @submit.prevent="handleSubmit" class="card p-6 space-y-5">
      <div>
        <label class="block text-xs text-site-gray-lighter mb-1">店家名稱 *</label>
        <input v-model="form.shopName" class="input-field" placeholder="拉麵太郎" required />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-xs text-site-gray-lighter mb-1">城市 *</label>
          <select v-model="form.city" class="input-field" required>
            <option value="">選擇城市</option>
            <option v-for="c in CITIES" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-site-gray-lighter mb-1">區域 *</label>
          <input v-model="form.district" class="input-field" placeholder="中正區" required />
        </div>
      </div>

      <div>
        <label class="block text-xs text-site-gray-lighter mb-1">地址 *</label>
        <input v-model="form.address" class="input-field" placeholder="中正路 123 號" required />
      </div>

      <div>
        <label class="block text-xs text-site-gray-lighter mb-1">備註（可選）</label>
        <textarea
          v-model="form.note"
          class="input-field resize-none h-24"
          placeholder="推薦原因、特色介紹..."
        />
      </div>

      <p v-if="error" class="text-red text-xs">{{ error }}</p>

      <div class="flex gap-3">
        <button type="button" class="btn-ghost flex-1" @click="router.back()">取消</button>
        <button type="submit" class="btn-primary flex-1" :disabled="loading">
          <span v-if="loading" class="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin" />
          <span v-else>送出提案</span>
        </button>
      </div>
    </form>
  </div>
</template>
