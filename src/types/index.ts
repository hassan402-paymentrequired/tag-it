export type UserRole = 'REQUESTER' | 'VERIFIER' | 'ADMIN';

export type ProductStatus = 'pending' | 'approved' | 'rejected';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isDeleted: boolean;
  isSuspended: boolean;
  verifier?: User | null;
  requesters?: User[];
  createdAt: string;
  updatedAt: string;
}

export interface Upload {
  id: string;
  url: string;
  mimeType: string;
  reference: string;
}

export interface Product {
  id: string;
  tagId: string;
  serialNumber: string;
  assignedTo: string;
  location: string;
  costCenter: string;
  assetClass: string;
  assetType: string;
  brand: string;
  assetDetails: string;
  assetCondition: string;
  assetStatus: string;
  status: ProductStatus;
  rejectionReason?: string | null;
  user: User;
  verifier: User;
  image?: Upload | null;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total: number;
  pageCount: number;
  pageTotal: number;
  page: string;
  limit: string;
}

export interface PaginatedProducts {
  data: Product[];
  pagination: Pagination;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface CreateUserPayload {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  password: string;
}

export interface AssignRequestersPayload {
  verifierId: string;
  requesterIds: string[];
}

export interface UnassignRequestersPayload {
  requesterIds: string[];
}

export interface RequesterProductStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export interface RequesterWithStats extends User {
  stats: RequesterProductStats;
}

export interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  isSuspended?: boolean;
}

export interface UserListParams {
  role?: UserRole;
  search?: string;
}

export interface UpdateProductStatusPayload {
  status: ProductStatus;
  rejectionReason?: string;
}

export interface ProductListParams {
  currentPage: string;
  pageSize: string;
  search?: string;
  status?: ProductStatus;
}
