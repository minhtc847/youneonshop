'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const fonts = [
  { name: 'Neon', value: "'Brush Script MT', cursive" },
  { name: 'Retro', value: "'Courier New', monospace" },
  { name: 'Modern', value: "'Open Sans', sans-serif" },
  { name: 'Nickainley', value: "'Nickainley', cursive" },
  { name: 'Antonio', value: "'Antonio', sans-serif" },
  { name: 'LoveNote', value: "'LoveNote', cursive" },
  { name: 'Northshore', value: "'Northshore', cursive" },
  { name: 'Nevada', value: "'Nevada', sans-serif" },
  { name: 'Neontrace', value: "'Neontrace', cursive" },
  { name: 'NeonLite', value: "'NeonLite', cursive" },
  { name: 'Marquee', value: "'Marquee', serif" },
  { name: 'LoveNeon', value: "'LoveNeon', cursive" },
  { name: 'Buttercup', value: "'Buttercup', cursive" },
  { name: 'Typewriter', value: "'Typewriter', monospace" },
  { name: 'Monaco', value: "'Monaco', monospace" },
  { name: 'Rocket', value: "'Rocket', sans-serif" },
  { name: 'Royalty', value: "'Royalty', serif" },
  { name: 'Beachfront', value: "'Beachfront', cursive" },
  { name: 'Freehand', value: "'Freehand', cursive" },
  { name: 'Austin', value: "'Austin', serif" },
  { name: 'Signature', value: "'Signature', cursive" },
  { name: 'Chelsea', value: "'Chelsea', serif" },
  { name: 'Amanda', value: "'Amanda', cursive" },
  { name: 'Barcelona', value: "'Barcelona', cursive" },
  { name: 'NewCursive', value: "'NewCursive', cursive" },
  { name: 'Amsterdam', value: "'Amsterdam', cursive" },
  { name: 'Bayview', value: "'Bayview', cursive" },
  { name: 'Alexa', value: "'Alexa', cursive" },
  { name: 'FREESCPT', value: "'FREESCPT', cursive" },
  { name: 'Barcelony', value: "'Barcelony', cursive" },
  { name: 'Kiona', value: "'Kiona', sans-serif" },
]

const colors = [
  { name: 'Neon Blue', value: '#00ffff' },
  { name: 'Neon Pink', value: '#ff00ff' },
  { name: 'Neon Yellow', value: '#ffff00' },
  { name: 'Neon Green', value: '#39ff14' },
  { name: 'Neon Orange', value: '#ff6600' },
  { name: 'Neon Purple', value: '#9d00ff' },
]

export default function DesignPage() {
  const [text, setText] = useState('Your Text Here')
  const [font, setFont] = useState(fonts[0].value)
  const [color, setColor] = useState(colors[0].value)
  const [size, setSize] = useState(50)

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8 text-center text-neon-blue">Design Your Custom Neon Light</h1>
      
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="space-y-6">
          <div>
            <Label htmlFor="text" className="text-neon-blue mb-2 block">Your Text</Label>
            <Input 
              id="text"
              type="text" 
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="bg-gray-800 text-white border-neon-blue focus:ring-neon-blue"
              placeholder="Enter your text here"
            />
          </div>

          <div>
            <Label htmlFor="font" className="text-neon-blue mb-2 block">Font Style</Label>
            <Select onValueChange={setFont} defaultValue={font}>
              <SelectTrigger className="bg-gray-800 text-white border-neon-blue focus:ring-neon-blue">
                <SelectValue placeholder="Select a font" />
              </SelectTrigger>
              <SelectContent>
                {fonts.map((f) => (
                  <SelectItem key={f.name} value={f.value}>{f.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="color" className="text-neon-blue mb-2 block">Neon Color</Label>
            <Select onValueChange={setColor} defaultValue={color}>
              <SelectTrigger className="bg-gray-800 text-white border-neon-blue focus:ring-neon-blue">
                <SelectValue placeholder="Select a color" />
              </SelectTrigger>
              <SelectContent>
                {colors.map((c) => (
                  <SelectItem key={c.name} value={c.value}>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: c.value }}></div>
                      {c.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <div className="text-white text-center">{size}</div>
          </div>

          <Button className="w-full bg-neon-pink hover:bg-neon-pink/80 text-black font-bold py-3 px-8 rounded-full transition-all duration-300 hover:shadow-glow-pink text-lg">
            Add to Cart
          </Button>
        </div>

        <div className="bg-gray-900 p-8 rounded-lg shadow-lg flex items-center justify-center min-h-[400px]">
          <div 
            style={{ 
              fontFamily: font, 
              color: color, 
              fontSize: `${size}px`,
              textShadow: `0 0 5px ${color}, 0 0 10px ${color}, 0 0 20px ${color}, 0 0 40px ${color}`,
            }}
            className="text-center break-words max-w-full"
          >
            {text || 'Your Text Here'}
          </div>
        </div>
      </div>
    </div>
  )
}

