'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import axios from "axios"
import TawkChat from "@/components/TawkChat";

const CLOUDINARY_URL ='cloudinary://545287944591526:_XoPlM55S-0qrGHsjHchogM1FEE@ddxq9g4di'
const CLOUDINARY_UPLOAD_PRESET = 'Youneon-ai-tawk'
const CLOUDINARY_NAME = 'ddxq9g4di'
declare global {
    interface Window {
        Tawk_API?: {
            setAttributes: (data: Record<string, any>, callback?: (error?: any) => void) => void;
            maximize: () => void;
        };
    }
}
export default function DesignPage() {
    const [text, setText] = useState('')
    const [size, setSize] = useState(50)
    const [imageSrc, setImageSrc] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [recentImages, setRecentImages] = useState<string[]>([])

    const uploadImageToCloudinary = async (file:File) => {
        if (!imageSrc) return null

        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)

        try {
            const response = await axios.post("https://api.cloudinary.com/v1_1/" + CLOUDINARY_NAME + "/"+ "image/upload", formData)
            return response.data.secure_url // Trả về URL ảnh
        } catch (error) {
            console.error("Lỗi upload ảnh lên Cloudinary:", error)
            return null
        }
    }

    const sendImageToChat = async () => {
        if (!imageSrc) {
            alert("Chưa có ảnh để gửi!");
            return;
        }

        // Chuyển base64 thành file để upload
        const res = await fetch(imageSrc);
        const blob = await res.blob();
        const file = new File([blob], "generated_image.png", { type: "image/png" });

        setLoading(true);
        const cloudinaryUrl = await uploadImageToCloudinary(file);
        setLoading(false);

        if (cloudinaryUrl && window.Tawk_API) {
            console.log(window.Tawk_API)
            window.Tawk_API.setAttributes(
                { selectedImage: cloudinaryUrl },
                (error?: any) => {
                    if (error) {
                        console.error("Lỗi gửi ảnh đến chat:", error);
                    } else {
                        console.log("✅ Ảnh đã gửi đến chat!");
                        window.Tawk_API?.maximize(); // Mở chat lên
                    }
                }
            );
        }
    };




    useEffect(() => {
        const storedImages = JSON.parse(localStorage.getItem("recentImages") || "[]")
        setRecentImages(storedImages)
    }, [])

    const generateImage = async () => {
        if (!text.trim()) return

        setLoading(true)
        try {
            const response = await axios.post("https://youneonshop-2-vzno.onrender.com-2.onrender.com/generate-image",
                { prompt: "Hãy tạo cho tôi 1 chiếc đèn neon đẹp: " + text },
                { responseType: "blob" }
            )

            const reader = new FileReader()
            reader.readAsDataURL(response.data)
            reader.onloadend = () => {
                const base64Image = reader.result as string
                setImageSrc(base64Image)

                const newRecentImages = [base64Image, ...recentImages].slice(0, 4)
                setRecentImages(newRecentImages)
                localStorage.setItem("recentImages", JSON.stringify(newRecentImages))
            }
        } catch (error) {
            console.error("Failed to generate image:", error)
        }
        setLoading(false)
    }

    return (
        <div  style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534841090574-cba2d662b62e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}>
            <div className="container mx-auto px-4 py-16 via-gray-900 to-gray-800 min-h-screen text-white ">
                <h1 className="text-3xl font-extrabold mb-8 text-center text-neon-blue animate-pulse drop-shadow-[0_0_10px_#0ff]">Sử dụng Trí Tuệ Nhân Tạo cho thiết kế của bạn</h1>
<TawkChat></TawkChat>
                <div className="grid md:grid-cols-2 gap-12 items-start">
                    <div className="space-y-6 bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
                        <div>
                            <Label htmlFor="text" className="text-neon-blue mb-2 block text-lg">Bạn muốn 1 chiếc đèn như nào ...</Label>
                            <Input
                                id="text"
                                type="text"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="bg-gray-900 text-white border-neon-blue focus:ring-neon-blue px-4 py-3 rounded-md"
                                placeholder="Tôi muốn 1 cái đèn neon màu cam cho quán cà phê"
                            />
                        </div>

                        <div>
                            <Label htmlFor="size" className="text-neon-blue mb-2 block text-lg">Size</Label>
                            <Slider
                                id="size"
                                min={20}
                                max={100}
                                step={1}
                                value={[size]}
                                onValueChange={(value) => setSize(value[0])}
                                className="my-4"
                            />
                            <div className="text-white text-center text-lg">{size}</div>
                        </div>

                        <Button
                            className="w-full bg-neon-pink hover:bg-neon-pink/80 text-black font-bold py-3 px-8 rounded-full transition-all duration-300 hover:shadow-[0_0_20px_#ff00ff] text-lg"
                            onClick={generateImage}
                            disabled={loading}
                        >
                            {loading ? "Generating..." : "AI Generate"}
                        </Button>
                        {imageSrc && (
                            <Button
                                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-4 transition-all"
                                onClick={sendImageToChat}
                            >
                                Liên hệ
                            </Button>
                        )}
                        <div className="grid grid-cols-4 gap-4 mt-6">
                            {recentImages.map((img, index) => (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    key={index}
                                    src={img}
                                    alt={`Recent Image ${index + 1}`}
                                    className="w-full h-24 object-cover rounded-lg cursor-pointer border-2 border-transparent hover:border-neon-blue transition-all shadow-md"
                                    onClick={() => setImageSrc(img)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="bg-gray-900 p-8 rounded-xl shadow-xl border border-gray-700 flex items-center justify-center min-h-[400px]">
                        {imageSrc ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={imageSrc} alt="Generated Neon Light" className="max-w-full max-h-full rounded-lg object-cover shadow-lg" />
                        ) : (
                            <p className="text-gray-500 text-lg">Your generated image will appear here.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
