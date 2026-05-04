import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAdminToken } from '@/lib/admin/adminAuth';

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface BackendProduct {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  discount_price?: number | null;
  image_url?: string | null;
  images?: Array<{ url: string; alt: string; order: number; blurDataUrl: string | null }>;
  category?: string | null;
  theme?: string | null;
  is_active?: boolean;
  meta_title?: string | null;
  meta_description?: string | null;
  updated_at?: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
    first_name?: string | null;
    last_name?: string | null;
  };
}

export interface AdminDashboard {
  totalOrders: number;
  revenue: number;
  totalCustomers: number;
  lowStockCount: number;
}

export interface OrderMetrics {
  total: number;
  byStatus: Record<string, number>;
}

export interface RevenueMetrics {
  totalRevenue: number;
  averageOrderValue: number;
  orderCount: number;
}

export interface CustomerMetrics {
  newCustomers: number;
}

export interface ProductMetric {
  productId: string;
  productName: string;
  unitsSold: number;
  revenue: number;
}

export interface InventoryItem {
  id: string;
  sku: string;
  quantity: number;
  reserved: number;
  updated_at: string;
  products: {
    id: string;
    name: string;
    slug: string;
    category?: string | null;
    is_active: boolean;
  } | null;
}

export interface UpdateProductPayload {
  name?: string;
  description?: string;
  price?: number;
  discount_price?: number | null;
  category?: string;
  theme?: string;
  meta_title?: string;
  meta_description?: string;
  is_active?: boolean;
}

export interface ProductImage {
  url: string;
  alt: string;
  order: number;
  blurDataUrl: string | null;
}

const baseUrl = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api').replace(/\/+$/, '');

const unwrap = <T>(response: ApiEnvelope<T>) => response.data;

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const token = getAdminToken();
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Inventory', 'Analytics', 'AdminSession', 'AdminProducts'],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, { email: string; password: string }>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
      transformResponse: unwrap,
      invalidatesTags: ['AdminSession'],
    }),

    getMe: builder.query<LoginResponse['user'], void>({
      query: () => '/auth/me',
      transformResponse: unwrap,
      providesTags: ['AdminSession'],
    }),

    getInventory: builder.query<InventoryItem[], void>({
      query: () => '/inventory',
      transformResponse: unwrap,
      providesTags: ['Inventory'],
    }),

    updateInventory: builder.mutation<InventoryItem, { id: string; quantity?: number; reserved?: number; sku?: string }>({
      query: ({ id, ...patch }) => ({
        url: `/inventory/${id}`,
        method: 'PUT',
        body: patch,
      }),
      transformResponse: unwrap,
      invalidatesTags: ['Inventory'],
    }),

    getAdminDashboard: builder.query<AdminDashboard, { dateFrom?: string; dateTo?: string } | undefined>({
      query: (params) =>
        params ? { url: '/admin/analytics/dashboard', params } : '/admin/analytics/dashboard',
      transformResponse: unwrap,
      providesTags: ['Analytics'],
    }),

    getAdminOrderMetrics: builder.query<OrderMetrics, { dateFrom?: string; dateTo?: string } | undefined>({
      query: (params) =>
        params ? { url: '/admin/analytics/orders', params } : '/admin/analytics/orders',
      transformResponse: unwrap,
      providesTags: ['Analytics'],
    }),

    getAdminRevenueMetrics: builder.query<RevenueMetrics, { dateFrom?: string; dateTo?: string } | undefined>({
      query: (params) =>
        params ? { url: '/admin/analytics/revenue', params } : '/admin/analytics/revenue',
      transformResponse: unwrap,
      providesTags: ['Analytics'],
    }),

    getAdminCustomerMetrics: builder.query<CustomerMetrics, { dateFrom?: string; dateTo?: string } | undefined>({
      query: (params) =>
        params ? { url: '/admin/analytics/customers', params } : '/admin/analytics/customers',
      transformResponse: unwrap,
      providesTags: ['Analytics'],
    }),

    getAdminProductMetrics: builder.query<ProductMetric[], { dateFrom?: string; dateTo?: string; limit?: number } | undefined>({
      query: (params) =>
        params ? { url: '/admin/analytics/products', params } : '/admin/analytics/products',
      transformResponse: unwrap,
      providesTags: ['Analytics'],
    }),

    getAdminProducts: builder.query<BackendProduct[], void>({
      query: () => '/admin/products',
      transformResponse: unwrap,
      providesTags: ['AdminProducts'],
    }),

    updateAdminProduct: builder.mutation<BackendProduct, { id: string; patch: UpdateProductPayload }>({
      query: ({ id, patch }) => ({
        url: `/admin/products/${id}`,
        method: 'PUT',
        body: patch,
      }),
      transformResponse: unwrap,
      invalidatesTags: ['AdminProducts'],
    }),

    uploadProductImages: builder.mutation<{ images: ProductImage[] }, { productId: string; formData: FormData }>({
      query: ({ productId, formData }) => ({
        url: `/admin/products/${productId}/upload`,
        method: 'POST',
        body: formData,
      }),
      transformResponse: unwrap,
    }),

    updateProductImagesArray: builder.mutation<BackendProduct, { id: string; images: ProductImage[] }>({
      query: ({ id, images }) => ({
        url: `/admin/products/${id}/images`,
        method: 'PUT',
        body: { images },
      }),
      transformResponse: unwrap,
      invalidatesTags: ['AdminProducts'],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetMeQuery,
  useGetInventoryQuery,
  useUpdateInventoryMutation,
  useGetAdminDashboardQuery,
  useGetAdminOrderMetricsQuery,
  useGetAdminRevenueMetricsQuery,
  useGetAdminCustomerMetricsQuery,
  useGetAdminProductMetricsQuery,
  useGetAdminProductsQuery,
  useUpdateAdminProductMutation,
  useUploadProductImagesMutation,
  useUpdateProductImagesArrayMutation,
} = adminApi;
