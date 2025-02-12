'use client'
import React, { useEffect, useState } from 'react';
import { getCartItems, CartItem } from '@/service/cartServices';
import { addAddress } from '@/service/addressService';
import locationData from '@/data/location.json';
import { useSession } from "next-auth/react";
import {motion} from "framer-motion";
import {Button} from "@/components/ui/button";
import Image from "next/image";
import {router} from "next/client";

interface Address {
    city: string;
    district: string;
    ward: string;
    detail: string;
    telephone: string;
    description: string;
}

export default function CheckoutPage () {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [address, setAddress] = useState<Address>({
        city: '',
        district: '',
        ward: '',
        detail: '',
        telephone: '',
        description: ''
    });
    const [imageLoadError, setImageLoadError] = useState<Record<string, boolean>>({})
    const { data: session, status } = useSession();
    const getImageSrc = (item: CartItem) => {
        if (imageLoadError[item.product_id]) {
            return "/placeholder.svg"
        }
        return item.image || "/placeholder.svg"
    }
    useEffect(() => {
        const fetchCartItems = async () => {
            const token = session?.user?.authentication_token;
            const items = await getCartItems(token);
            setCartItems(items.cart);
            const total = items.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            setTotalPrice(total);
        };

        fetchCartItems();
    }, [session]);

    const handleAddressChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setAddress({ ...address, [name]: value });
    };

    const handleImageError = (itemId: string) => {
        setImageLoadError((prev) => ({ ...prev, [itemId]: true }))
    }

    return (
        <main className="container mx-auto px-4 py-16">
            <div className="flex flex-col md:flex-row gap-8 mb-16 checkout-page">
                <div className="address-form bg-gray-800 p-8 rounded-lg shadow-md mb-6 md:w-2/3">
                    <h2 className="text-2xl font-bold mb-4 text-neon-blue">Thông tin thanh toán</h2>
                    <div className="mb-4">
                        <label className="block text-neon-pink mb-2">Thành Phố/Tỉnh</label>
                        <select name="city" value={address.city} onChange={handleAddressChange}
                                className="w-full p-2 rounded">
                            {locationData.map((city) => (
                                <option key={city.Code} value={city.Code}>{city.FullName}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-neon-pink mb-2">Quận/Huyện</label>
                        <select name="district" value={address.district} onChange={handleAddressChange}
                                className="w-full p-2 rounded">
                            {locationData.find(city => city.Code === address.city)?.District.map((district) => (
                                <option key={district.Code} value={district.Code}>{district.FullName}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-neon-pink mb-2">Phường/Xã</label>
                        <select name="ward" value={address.ward} onChange={handleAddressChange}
                                className="w-full p-2 rounded">
                            {locationData.find(city => city.Code === address.city)?.District.find(district => district.Code === address.district)?.Ward.map((ward) => (
                                <option key={ward.Code} value={ward.Code}>{ward.FullName}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-neon-pink mb-2">Số Nhà</label>
                        <input type="text" name="detail" value={address.detail} onChange={handleAddressChange}
                               className="w-full p-2 rounded"/>
                    </div>
                    <div className="mb-4">
                        <label className="block text-neon-pink mb-2">Điện Thoại</label>
                        <input type="text" name="telephone" value={address.telephone} onChange={handleAddressChange}
                               className="w-full p-2 rounded"/>
                    </div>
                    <div className="mb-4">
                        <label className="block text-neon-pink mb-2">Ghi chú</label>
                        <textarea name="description" value={address.description} onChange={handleAddressChange}
                                  className="w-full p-2 rounded"></textarea>
                    </div>
                    <button onClick={()=> router.push("/payment")}
                            className="bg-neon-blue hover:bg-neon-blue/80 text-black font-semibold py-2 px-4 rounded-full transition-all duration-300 hover:shadow-neon-glow">Thanh toan
                    </button>
                </div>
                <div className="checkout-summary bg-gray-800 p-6 rounded-lg shadow-md md:w-1/3 ">
                    {cartItems.length === 0 ? (
                        <motion.div
                            className="text-center space-y-6"
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{duration: 0.5, delay: 0.2}}
                        >
                            <p className="text-xl text-gray-400">Your cart is empty. Start shopping to add items to your
                                cart!</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            className="space-y-6"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                visible: {transition: {staggerChildren: 0.1}},
                            }}
                        >
                            {cartItems.map((item) => (
                                <div key={item.product_id}>
                                    <div className="flex items-center space-x-4">
                                        <Image
                                            src={getImageSrc(item) || "/placeholder.svg"}
                                            alt={item.product_name}
                                            width={80}
                                            height={80}
                                            className="rounded-md"
                                            onError={() => handleImageError(item.product_id)}
                                        />
                                        <div>
                                            <h2 className="text-sm font-sdemibold text-neon-pink">{item.product_name}</h2>
                                            <p className="text-neon-green">{item.price.toLocaleString()}đ</p>
                                            <div className="flex items-center space-x-4 mt-2">
                                                <span className="text-white">{item.quantity}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end space-y-2">
                                        <p className="text-lg text-neon-yellow">{(item.price * item.quantity).toLocaleString()}đ</p>
                                    </div>
                                </div>
                            ))}

                        </motion.div>
                    )}
                    <motion.div
                        className="flex justify-between items-center mt-8 pt-4 border-t border-gray-700"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{duration: 0.5, delay: 0.5}}
                    >
                        <h3 className="text-xl font-bold text-neon-blue">Total:</h3>
                        <p className="text-xl font-bold text-neon-green">{totalPrice.toLocaleString()}đ</p>
                    </motion.div>
                    <motion.div
                        className="flex justify-between items-center mt-8 pt-4 border-t border-gray-700"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{duration: 0.5, delay: 0.5}}
                    >
                        <h3 className="text-xl font-bold text-neon-blue">Delivery Price:</h3>
                        <p className="text-xl font-bold text-neon-green">30000đ</p>
                    </motion.div>
                    <motion.div
                        className="flex justify-between items-center mt-8 pt-4 border-t border-gray-700"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{duration: 0.5, delay: 0.5}}
                    >
                        <h3 className="text-2xl font-bold text-neon-blue">Grand Total:</h3>
                        <p className="text-2xl font-bold text-neon-green">{(totalPrice + 30000).toLocaleString()}đ</p>
                    </motion.div>
                </div>
            </div>

        </main>
    );
};
