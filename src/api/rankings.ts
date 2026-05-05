import { apiClient } from './client'
import type { ApiResponse, RankingItem, RankingType } from '@/types'

export const rankingsApi = {
  getList: (type: RankingType = 'combined', limit = 20) =>
    apiClient.get<ApiResponse<RankingItem[]>>('/api/rankings', { params: { type, limit } }),
}
