export interface Product {
  id: string;
  name: string;
  price: number;
  image: string | null;
  image_list: string[] | null;
  description: string;
  category_id: string;
  inventory_id: string;
  discount_id: string;
  is_deleted: boolean;
  created_at: string;
  modified_at: string;
  tags: string[];
}

export interface ProductsResponse {
  metadata: {
    current_page: number;
    page_size: number;
    first_page: number;
    last_page: number;
    total_records: number;
  };
  products: Product[];
}

