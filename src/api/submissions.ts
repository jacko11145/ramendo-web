import { apiClient } from './client'
import type { ApiResponse, ShopSubmission } from '@/types'

export interface CreateSubmissionPayload {
  shopName: string
  city: string
  district: string
  address: string
  note?: string
}

export const submissionsApi = {
  getMySubmissions: () =>
    apiClient.get<ApiResponse<ShopSubmission[]>>('/api/user/submissions'),

  create: (data: CreateSubmissionPayload) =>
    apiClient.post<ApiResponse<ShopSubmission>>('/api/submissions', data),
}
