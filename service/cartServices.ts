
import axios from '../setup/axios';
export interface CartItem {
  product_id: string
  product_name : string
  quantity: number
  image: string
  price: number
}

export interface CartResponse {
    cart: CartItem[]
}

// Get all cart items
export const getCartItems = async (token: string): Promise<CartResponse> => {
  try {
    const response = await axios.get<CartResponse>("/carts", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    console.log("Cart items:", response.data)
    return response.data
  } catch (error) {
    console.error("Error fetching cart items:", error)
    throw error
  }
}

// Add item to cart
export const addToCart = async (token: string, productId:string,quantity:number) => {
  try {
    const response = await axios.post("/carts", {
        "product_id": productId,
        "quantity": quantity
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    throw error
  }
}

// Update cart item
export const updateCartItem = async (token: string, itemId: string, quantity: number) => {
  try {
    const response = await axios.put(
        `/carts/${itemId}`,
        {
          "product_id": itemId,
          "quantity": quantity
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating cart item:", error)
    throw error
  }
}

// Remove item from cart
export const removeFromCart = async (token: string, itemId: string) => {
  try {
    const response = await axios.delete(`/carts/${itemId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error("Error removing item from cart:", error)
    throw error
  }
}

