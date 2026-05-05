import { apiClient } from './client'
import type { ApiResponse, PagedResult, Review } from '@/types'

export interface CreateReviewPayload {
  shopGuid: string
  rating: number
  visitDate: string
  comment?: string
  menuItemRatings?: Array<{ menuItemId: string; rating: number; comment?: string }>
  options?: Array<{ optionTypeId: number; optionValueId: number }>
}

export const reviewsApi = {
  getByShop: (shopGuid: string, page = 1, limit = 10) =>
    apiClient.get<ApiResponse<PagedResult<Review>>>(`/api/shops/${shopGuid}/reviews`, {
      params: { page, limit },
    }),

  create: (data: CreateReviewPayload) =>
    apiClient.post<ApiResponse<Review>>('/api/reviews', data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/api/reviews/${id}`),
}
