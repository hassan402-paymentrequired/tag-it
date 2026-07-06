import { apiClient } from './client';
import type { ApiResponse, LoginPayload, LoginResponse } from '@/types';

export async function login(payload: LoginPayload) {
  const { data } = await apiClient.post<ApiResponse<LoginResponse>>(
    '/user/login',
    payload,
  );
  return data;
}
