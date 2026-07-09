import { apiClient } from './client';
import { normalizeUserId, normalizeUserIds } from '@/lib/user-id';
import type {
  ApiResponse,
  AssignRequestersPayload,
  CreateUserPayload,
  UnassignRequestersPayload,
  UpdateUserPayload,
  User,
  UserListParams,
} from '@/types';

function normalizeAssignPayload(payload: AssignRequestersPayload) {
  const verifierId = normalizeUserId(payload.verifierId);
  const requesterIds = normalizeUserIds(payload.requesterIds);

  if (!verifierId) {
    throw new Error('Select a valid verifier');
  }
  if (!requesterIds.length) {
    throw new Error('Select at least one valid requester');
  }

  return { verifierId, requesterIds };
}

function normalizeUnassignPayload(payload: UnassignRequestersPayload) {
  const requesterIds = normalizeUserIds(payload.requesterIds);

  if (!requesterIds.length) {
    throw new Error('Select at least one valid requester');
  }

  return { requesterIds };
}

export async function createUser(payload: CreateUserPayload) {
  const { data } = await apiClient.post<ApiResponse<User>>('/user', payload);
  return data;
}

export async function getUsers(params?: UserListParams) {
  const { data } = await apiClient.get<ApiResponse<User[]>>('/user', {
    params,
  });
  return data;
}

export async function updateUser(id: string, payload: UpdateUserPayload) {
  const { data } = await apiClient.patch<ApiResponse<User>>(
    `/user/${id}`,
    payload,
  );
  return data;
}

export async function deleteUser(id: string) {
  const { data } = await apiClient.delete<ApiResponse<User>>(`/user/${id}`);
  return data;
}

export async function getVerifiers() {
  const { data } = await apiClient.get<ApiResponse<User[]>>('/user/verifiers');
  return data;
}

export async function assignRequesters(payload: AssignRequestersPayload) {
  const { data } = await apiClient.post<ApiResponse<User[]>>(
    '/user/assign-requesters',
    normalizeAssignPayload(payload),
  );
  return data;
}

export async function unassignRequesters(payload: UnassignRequestersPayload) {
  const { data } = await apiClient.post<ApiResponse<User[]>>(
    '/user/unassign-requesters',
    normalizeUnassignPayload(payload),
  );
  return data;
}
