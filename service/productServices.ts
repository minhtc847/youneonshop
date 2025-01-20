import axios from '../setup/axios';
import { Product, ProductsResponse } from '@/types/product';
import qs from 'qs';

// Helper function to handle API errors
const handleApiError = (error: any, defaultValue: any = null) => {
  if (error.response) {
    console.log(`API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
  } else if (error.request) {
    console.log('No response received from server:', error.request);
  } else {
    console.log('Request setup error:', error.message);
  }
  return defaultValue;
};

// Fetch categories
export const getCategories = async (): Promise<string[]> => {
  try {
    const response = await axios.get('/categories');
    return Array.isArray(response.data.categories) ? response.data.categories : [];
  } catch (error) {
    return handleApiError(error, []);
  }
};

// Fetch list of products
export const listProduct = async (params: {
  category?: string;
  tags?: string[];
  name?: string;
  price_from?: number;
  price_to?: number;
  page?: number;
  page_size?: number;
  sort?: string;
}): Promise<ProductsResponse> => {
  try {
    console.log('Sending params to API:', params);
    const response = await axios.get<ProductsResponse>('/products', {
      params,
      paramsSerializer: (params) => {
        const queryString = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach(v => queryString.append(key, v));
          } else if (value !== undefined) {
            queryString.append(key, value.toString());
          }
        });
        return queryString.toString();
      },
    });
    console.log('API response:', response.data);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Fetch product by ID
export const getProductById = async (id: string): Promise<{ product: Product } | null> => {
  try {
    const response = await axios.get<{ product: Product }>(`/products/${id}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, null);
  }
};

// Fetch tags
export const getTags = async (): Promise<string[]> => {
  try {
    const response = await axios.get<string[]>('/tags');
    return response.data.tags;
  } catch (error) {
    return handleApiError(error, []);
  }
};

