import axios from 'axios';
import { apiClient } from './client';
import type { ProductStatus, UserRole } from '@/types';

export type ExportFormat = 'csv' | 'pdf';

export type ExportProductsParams = {
  format: ExportFormat;
  search?: string;
  status?: ProductStatus;
};

export type ExportUsersParams = {
  format: ExportFormat;
  search?: string;
  role?: UserRole;
};

function filenameFromDisposition(
  disposition: string | undefined,
  fallback: string,
): string {
  if (!disposition) return fallback;
  const utfMatch = disposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utfMatch?.[1]) {
    return decodeURIComponent(utfMatch[1]);
  }
  const match = disposition.match(/filename="?([^"]+)"?/i);
  return match?.[1] ?? fallback;
}

function triggerBrowserDownload(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(url);
}

async function messageFromBlob(blob: Blob): Promise<string | null> {
  try {
    const text = await blob.text();
    const parsed = JSON.parse(text) as { message?: string | string[] };
    if (Array.isArray(parsed.message)) return parsed.message.join(', ');
    if (typeof parsed.message === 'string') return parsed.message;
  } catch {
    return null;
  }
  return null;
}

async function downloadExport(
  path: string,
  params: Record<string, string | undefined>,
  fallbackFilename: string,
) {
  try {
    const response = await apiClient.get(path, {
      params,
      responseType: 'blob',
    });

    const contentType = String(response.headers['content-type'] ?? '');
    if (contentType.includes('application/json')) {
      const message = await messageFromBlob(response.data as Blob);
      throw new Error(message || 'Export failed');
    }

    const filename = filenameFromDisposition(
      response.headers['content-disposition'],
      fallbackFilename,
    );
    triggerBrowserDownload(response.data as Blob, filename);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data instanceof Blob) {
      const message = await messageFromBlob(error.response.data);
      throw new Error(message || error.message || 'Export failed');
    }
    throw error;
  }
}

export async function downloadVisibilityExport(format: ExportFormat) {
  await downloadExport(
    '/export/visibility',
    { format },
    `tag-it-visibility-report.${format}`,
  );
}

export async function downloadProductsExport(params: ExportProductsParams) {
  await downloadExport(
    '/export/products',
    {
      format: params.format,
      ...(params.search ? { search: params.search } : {}),
      ...(params.status ? { status: params.status } : {}),
    },
    `tag-it-products.${params.format}`,
  );
}

export async function downloadUsersExport(params: ExportUsersParams) {
  await downloadExport(
    '/export/users',
    {
      format: params.format,
      ...(params.search ? { search: params.search } : {}),
      ...(params.role ? { role: params.role } : {}),
    },
    `tag-it-users.${params.format}`,
  );
}
