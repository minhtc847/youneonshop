"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "@/setup/axios";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Image from "next/image";
import { Trash2 } from "lucide-react";

interface CartItem {
  id: string;
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Lấy token từ localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("bearerToken");
    if (!storedToken) {
      router.push("/login"); // Redirect nếu không có token
    } else {
      setToken(storedToken);
    }
  }, [router]);

  // Lấy danh sách sản phẩm trong giỏ hàng
  useEffect(() => {
    if (token) {
      fetchCartItems();
    }
  }, [token]);

  const fetchCartItems = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get("/carts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartItems(response.data.cart_items || []);
    } catch (err) {
      console.error("Error fetching cart items:", err);
      setError("Failed to fetch cart items. Please try again.");
      toast.error("Failed to fetch cart items. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý xóa sản phẩm khỏi giỏ hàng
  const handleRemoveItem = async (itemId: string) => {
    try {
      await axios.delete(`/carts/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
      toast.success("Item removed from cart");
    } catch (err) {
      console.error("Error removing item from cart:", err);
      toast.error("Failed to remove item from cart. Please try again.");
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-neon-blue">Your Cart</h1>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-neon-blue">Your Cart</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.h1
        className="text-4xl font-bold mb-8 text-neon-blue"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Your Cart
      </motion.h1>
      {cartItems.length === 0 ? (
        <motion.p
          className="text-xl text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Your cart is empty. Start shopping to add items to your cart!
        </motion.p>
      ) : (
        <motion.div
          className="space-y-6"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {cartItems.map((item) => (
            <motion.div
              key={item.id}
              className="flex items-center justify-between bg-gray-800 p-4 rounded-lg"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <div className="flex items-center space-x-4">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="rounded-md"
                />
                <div>
                  <h2 className="text-xl font-semibold text-neon-pink">{item.name}</h2>
                  <p className="text-gray-400">Quantity: {item.quantity}</p>
                  <p className="text-neon-green">${item.price.toFixed(2)}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveItem(item.id)}
                className="text-red-500 hover:text-red-700 transition-colors duration-200"
              >
                <Trash2 size={24} />
              </Button>
            </motion.div>
          ))}
          <motion.div
            className="flex justify-between items-center mt-8 pt-4 border-t border-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h3 className="text-2xl font-bold text-neon-blue">Total:</h3>
            <p className="text-2xl font-bold text-neon-green">${calculateTotal().toFixed(2)}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Button className="w-full bg-neon-blue hover:bg-neon-blue/80 text-black font-bold py-3 px-8 rounded-full transition-all duration-300 hover:shadow-glow-blue">
              Proceed to Checkout
            </Button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
