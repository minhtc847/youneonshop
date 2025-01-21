import axios from "../setup/axios"

interface CartItem {
  id: string
  product_id: string
  quantity: number
}

interface CartResponse {
  cart: {
    id: string
    product_id: string
    product_name: string
    price: number
    quantity: number
    image: string
  }[]
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
export const addToCart = async (token: string, item: CartItem) => {
  try {
    const response = await axios.post("/carts", item, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error("Error adding item to cart:", error)
    throw error
  }
}

// Update cart item
export const updateCartItem = async (token: string, itemId: string, quantity: number) => {
  try {
    const response = await axios.put(
      `/carts/${itemId}`,
      { quantity },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    return response.data
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

