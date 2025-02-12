'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from "@/components/ui/button"

const faqs = [
  {
    question: "How long do neon lights typically last?",
    answer: "Our LED neon lights are designed to last up to 50,000 hours, which is equivalent to about 5.7 years of continuous use. With proper care and maintenance, they can last even longer."
  },
  {
    question: "Are your neon lights energy-efficient?",
    answer: "Yes, our LED neon lights are highly energy-efficient. They consume significantly less power compared to traditional neon lights, which helps reduce electricity costs and environmental impact."
  },
  {
    question: "Can I customize the design of my neon light?",
    answer: "We offer custom neon light services where you can create your own unique design. Contact our team to discuss your ideas, and we'll work with you to bring your vision to life."
  },
  {
    question: "What is the difference between traditional neon and LED neon?",
    answer: "Traditional neon lights use gas-filled glass tubes, while LED neon uses LED strips encased in flexible silicone. LED neon is more durable, energy-efficient, and allows for more design flexibility compared to traditional neon."
  },
  {
    question: "Do you offer installation services?",
    answer: "Yes, we offer professional installation services for our neon lights. Our team of experienced technicians can ensure your neon light is safely and properly installed."
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy for all standard products. Custom orders are non-refundable. If you receive a damaged product, please contact us immediately and we'll arrange a replacement."
  },
  {
    question: "How do I clean and maintain my neon light?",
    answer: "To clean your LED neon light, simply use a soft, dry cloth to gently wipe away dust. For tougher stains, you can use a slightly damp cloth. Always ensure the light is unplugged before cleaning. Avoid using harsh chemicals or abrasive materials."
  },
  {
    question: "Are your neon lights suitable for outdoor use?",
    answer: "Many of our LED neon lights are suitable for outdoor use, as they are rated IP65 for water resistance. However, we recommend checking the product specifications or contacting our support team to confirm if a specific product is suitable for your outdoor needs."
  }
]

export default function FAQPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.h1
        className="text-5xl font-bold mb-12 text-center text-neon-blue"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Frequently Asked Questions
      </motion.h1>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <input
          type="text"
          placeholder="Search FAQs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-blue"
        />
      </motion.div>

      <div className="max-w-3xl mx-auto">
        {filteredFaqs.length === 0 ? (
          <motion.p
            className="text-center text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            No matching FAQs found. Please try a different search term.
          </motion.p>
        ) : (
          filteredFaqs.map((faq, index) => (
            <motion.div
              key={index}
              className="mb-4 bg-gray-800 rounded-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Button
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none bg-gray-800 hover:bg-gray-700"
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-lg font-semibold text-neon-pink">{faq.question}</span>
                {activeIndex === index ? (
                  <ChevronUp className="text-neon-blue w-6 h-6" />
                ) : (
                  <ChevronDown className="text-neon-blue w-6 h-6" />
                )}
              </Button>
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 py-4 bg-gray-700"
                  >
                    <p className="text-gray-300">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}

