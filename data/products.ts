export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image: string;
  image_list?: string[];
  category?: string; // We'll keep this for filtering purposes
  rating?: number; // We'll keep this for display purposes
}

export const products: Product[] = [
  {
    id: "1",
    name: "Blue Wave",
    description: "A calming blue neon wave to bring serenity to your space.",
    price: 1000000,
    image: "/neon-1.jpg",
    image_list: ["/neon-1.jpg", "/neon-2.jpg", "/neon-3.jpg"],
    category: "Abstract",
    rating: 4.5
  },
  {
    id: "2",
    name: "Pink Flamingo",
    description: "Add a tropical flair to your decor with this vibrant pink flamingo.",
    price: 1500000,
    image: "/neon-2.jpg",
    image_list: ["/neon-2.jpg", "/neon-3.jpg", "/neon-1.jpg"],
    category: "Animals",
    rating: 4.8
  },
  {
    id: "3",
    name: "Yellow Bolt",
    description: "Energize your room with this striking yellow lightning bolt.",
    price: 500000,
    image: "/neon-3.jpg",
    image_list: ["/neon-3.jpg", "/neon-1.jpg", "/neon-2.jpg"],
    category: "Abstract",
    rating: 4.2
  },
  {
    id: "4",
    name: "Green Leaf",
    description: "Bring a touch of nature indoors with this glowing green leaf.",
    price: 1200000,
    image: "/neon-1.jpg",
    image_list: ["/neon-1.jpg", "/neon-2.jpg", "/neon-3.jpg"],
    category: "Nature",
    rating: 4.7
  },
  {
    id: "5",
    name: "Purple Haze",
    description: "Create a dreamy atmosphere with this mesmerizing purple haze design.",
    price: 1800000,
    image: "/neon-2.jpg",
    image_list: ["/neon-2.jpg", "/neon-3.jpg", "/neon-1.jpg"],
    category: "Abstract",
    rating: 4.6
  },
  {
    id: "6",
    name: "Red Heart",
    description: "Express your love with this classic red neon heart.",
    price: 900000,
    image: "/neon-3.jpg",
    image_list: ["/neon-3.jpg", "/neon-1.jpg", "/neon-2.jpg"],
    category: "Symbols",
    rating: 4.9
  },
  {
    id: "7",
    name: "Orange Sunset",
    description: "Capture the warmth of a sunset with this orange neon masterpiece.",
    price: 1300000,
    image: "/neon-1.jpg",
    image_list: ["/neon-1.jpg", "/neon-2.jpg", "/neon-3.jpg"],
    category: "Nature",
    rating: 4.3
  },
  {
    id: "8",
    name: "Teal Ocean",
    description: "Dive into tranquility with this soothing teal ocean wave.",
    price: 1400000,
    image: "/neon-2.jpg",
    image_list: ["/neon-2.jpg", "/neon-3.jpg", "/neon-1.jpg"],
    category: "Nature",
    rating: 4.4
  },
];

