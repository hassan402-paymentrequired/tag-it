import { apiClient } from './client';
import type {
  ApiResponse,
  AssignRequestersPayload,
  CreateUserPayload,
  User,
} from '@/types';

export async function createUser(payload: CreateUserPayload) {
  const { data } = await apiClient.post<ApiResponse<User>>('/user', payload);
  return data;
}

export async function getVerifiers() {
  const { data } = await apiClient.get<ApiResponse<User[]>>('/user/verifiers');
  return data;
}

export async function assignRequesters(payload: AssignRequestersPayload) {
  const { data } = await apiClient.post<ApiResponse<User[]>>(
    '/user/assign-requesters',
    payload,
  );
  return data;
}

export async function unassignRequesters(payload: AssignRequestersPayload) {
  const { data } = await apiClient.post<ApiResponse<User[]>>(
    '/user/unassign-requesters',
    payload,
  );
  return data;
}
