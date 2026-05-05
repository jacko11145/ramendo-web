import { apiClient } from './client'
import type { ApiResponse, PagedResult, ShopListItem, ShopDetail } from '@/types'

export interface GetShopsParams {
  city?: string
  district?: string
  types?: string[]
  sort?: string
  page?: number
  limit?: number
  search?: string
}

export const shopsApi = {
  getList: (params: GetShopsParams = {}) =>
    apiClient.get<ApiResponse<PagedResult<ShopListItem>>>('/api/shops', {
      params: { ...params, types: params.types?.join(',') },
    }),

  getByGuid: (guid: string) =>
    apiClient.get<ApiResponse<ShopDetail>>(`/api/shops/${guid}`),
}
