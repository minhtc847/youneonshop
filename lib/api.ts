import axios from 'axios';
import { ProductsResponse } from '@/types/product';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function fetchProducts(queryString: string): Promise<ProductsResponse> {
  const response = await axios.get<ProductsResponse>(`${API_URL}/products?${queryString}`);
  return response.data;
}

