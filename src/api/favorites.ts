import { apiClient } from './client'
import type { ApiResponse, FavoriteShop } from '@/types'

export const favoritesApi = {
  getList: () =>
    apiClient.get<ApiResponse<FavoriteShop[]>>('/api/user/favorites'),

  toggle: (shopGuid: string) =>
    apiClient.post<ApiResponse<{ isFavorite: boolean }>>(`/api/user/favorites/${shopGuid}`),
}
