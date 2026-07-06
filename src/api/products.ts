import { apiClient } from './client';
import type {
  ApiResponse,
  PaginatedProducts,
  Product,
  ProductListParams,
  UpdateProductStatusPayload,
} from '@/types';

export async function getProducts(params: ProductListParams) {
  const { data } = await apiClient.get<ApiResponse<PaginatedProducts>>(
    '/product',
    { params },
  );
  return data;
}

export async function getProduct(id: string) {
  const { data } = await apiClient.get<ApiResponse<Product>>(`/product/${id}`);
  return data;
}

export async function updateProductStatus(
  id: string,
  payload: UpdateProductStatusPayload,
) {
  const { data } = await apiClient.patch<ApiResponse<Product>>(
    `/product/${id}/status`,
    payload,
  );
  return data;
}
