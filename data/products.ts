import { listProduct, getProductById } from '@/service/productServices';

export interface Products {
  id: number | string;
  name: string;
  price: number;
  image: string | null;
  placeholder: string | null;
  width: number;
  height: number;
  category: string;
  rating: number;
  description?: string;
  specifications?: { name: string; value: string }[];
  reviews?: { author: string; rating: number; comment: string }[];
}

export const fetchProducts = async (): Promise<Products[]> => {
  try {
    const products = await listProduct();
    return products.map((product: Products) => ({
      ...product,
      image: product.image || '/default-image.jpg',
      placeholder: product.placeholder || '/default-placeholder.jpg',
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const fetchProductById = async (id: number | string): Promise<Products | null> => {
  try {
    const products = await getProductById(id);
    return {
      ...products,
      image: products.image || '/default-image.jpg',
      placeholder: products.placeholder || '/default-placeholder.jpg',
    };
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    return null;
  }
};

