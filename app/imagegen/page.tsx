'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import axios from "axios"

export default function DesignPage() {
    const [text, setText] = useState('')
    const [size, setSize] = useState(50)
    const [imageSrc, setImageSrc] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [recentImages, setRecentImages] = useState<string[]>([])

    useEffect(() => {
        // Load recent images from localStorage when component mounts
        const storedImages = JSON.parse(localStorage.getItem("recentImages") || "[]")
        setRecentImages(storedImages)
    }, [])

    const generateImage = async () => {
        if (!text.trim()) return

        setLoading(true)
        try {
            const response = await axios.post("https://youneonshop-2.onrender.com/generate-image",
                { prompt: "Hãy tạo cho tôi 1 chiếc đèn neon đẹp: " + text },
                { responseType: "blob" } // Nhận ảnh dưới dạng blob
            )

            // Chuyển blob thành Base64
            const reader = new FileReader()
            reader.readAsDataURL(response.data)
            reader.onloadend = () => {
                const base64Image = reader.result as string
                setImageSrc(base64Image)

                // Lưu vào danh sách recent images (tối đa 4 ảnh)
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
        <div className="container mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold mb-8 text-center text-neon-blue">Sử dụng Trí Tuệ Nhân Tạo cho thiết kế của bạn</h1>

            <div className="grid md:grid-cols-2 gap-12 items-start">
                <div className="space-y-6">
                    <div>
                        <Label htmlFor="text" className="text-neon-blue mb-2 block">Bạn muốn 1 chiếc đèn như nào ...</Label>
                        <Input
                            id="text"
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="bg-gray-800 text-white border-neon-blue focus:ring-neon-blue"
                            placeholder="Tôi muốn 1 cái đèn neon màu cam cho quán cà phê"
                        />
                    </div>

                    <div>
                        <Label htmlFor="size" className="text-neon-blue mb-2 block">Size</Label>
                        <Slider
                            id="size"
                            min={20}
                            max={100}
                            step={1}
                            value={[size]}
                            onValueChange={(value) => setSize(value[0])}
                            className="my-4"
                        />
                        <div className="text-white text-center">{size}px</div>
                    </div>

                    <Button
                        className="w-full bg-neon-pink hover:bg-neon-pink/80 text-black font-bold py-3 px-8 rounded-full transition-all duration-300 hover:shadow-glow-pink text-lg"
                        onClick={generateImage}
                        disabled={loading}
                    >
                        {loading ? "Generating..." : "AI Generate"}
                    </Button>

                    {/* Recent Generated Images */}
                    <div className="grid grid-cols-4 gap-4 mt-6">
                        {recentImages.map((img, index) => (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                key={index}
                                src={img}
                                alt={`Recent Image ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg cursor-pointer border-2 border-transparent hover:border-neon-blue transition-all"
                                onClick={() => setImageSrc(img)}
                            />
                        ))}
                    </div>
                </div>

                <div className="bg-gray-900 p-8 rounded-lg shadow-lg flex items-center justify-center min-h-[400px] ">
                    {imageSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={imageSrc} alt="Generated Neon Light" className="max-w-full max-h-full rounded-lg object-cover" />
                    ) : (
                        <p className="text-gray-500">Your generated image will appear here.</p>
                    )}
                </div>
            </div>
        </div>
    )
}
