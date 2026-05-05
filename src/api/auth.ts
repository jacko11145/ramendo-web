import { apiClient } from './client'
import type { ApiResponse, AuthTokens, UserSession } from '@/types'

export const authApi = {
  register: (data: { email: string; password: string; name: string; invitationCode: string }) =>
    apiClient.post<ApiResponse<AuthTokens>>('/api/auth/register', data),

  login: (data: { email: string; password: string }) =>
    apiClient.post<ApiResponse<AuthTokens>>('/api/auth/login', data),

  google: (idToken: string) =>
    apiClient.post<ApiResponse<AuthTokens>>('/api/auth/google', { idToken }),

  refresh: (refreshToken: string) =>
    apiClient.post<ApiResponse<AuthTokens>>('/api/auth/refresh', { refreshToken }),

  logout: (refreshToken: string) =>
    apiClient.post<ApiResponse<null>>('/api/auth/logout', { refreshToken }),

  me: () =>
    apiClient.get<ApiResponse<UserSession>>('/api/auth/me'),
}
