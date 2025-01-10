import axios from '../setup/axios';
import { Products } from '@/data/products';

export const getCategories = async (): Promise<string[]> => {
    try {
        const response = await axios.get('/categories');
        console.log('Categories fetched successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch categories:', error);
        throw error;
    }
};

export const listProduct = async (): Promise<Products[]> => {
    try {
        const response = await axios.get('/products');
        console.log('Productfetched successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch products:', error);
        throw error;
    }
};

export const getProductById = async (id: number | string): Promise<Products> => {
    try {
        const response = await axios.get(`/products/${id}`);
        console.log(`Products${id} fetched successfully:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch Products${id}:`, error);
        throw error;
    }
};

export const getTags = async (): Promise<string[]> => {
    try {
        const response = await axios.get('/tags');
        console.log('Tags fetched successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch tags:', error);
        throw error;
    }
};

