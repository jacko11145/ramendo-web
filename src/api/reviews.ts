import { apiClient } from './client'
import type { ApiResponse, PagedResult, Review } from '@/types'

export interface CreateReviewPayload {
  shopGuid: string
  rating: number
  visitDate: string
  comment?: string
  images?: string[]
}

export const reviewsApi = {
  getByShop: (shopGuid: string, page = 1, limit = 10) =>
    apiClient.get<ApiResponse<PagedResult<Review>>>(`/api/shops/${shopGuid}/reviews`, {
      params: { page, limit },
    }),

  create: (data: CreateReviewPayload) =>
    apiClient.post<ApiResponse<Review>>('/api/reviews', data),

  uploadImages: (files: File[]) => {
    const form = new FormData()
    files.forEach((f) => form.append('files', f))
    return apiClient.post<ApiResponse<string[]>>('/api/reviews/images', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  delete: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/api/reviews/${id}`),
}
