import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from '@/components/navbar'
import { ToastContainer, Slide } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { NextAuthProvider } from '@/components/next-auth-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'YOUNEON',
  description: 'Minimalist e-commerce website for selling neon lights',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-black text-white min-h-screen`}>
        <NextAuthProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <Navbar />
            <main className="pt-16">
              {children}
            </main>
            <ToastContainer
              position="top-right"
              autoClose={1000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
              transition={Slide}
              toastClassName="bg-gray-800 text-white"
              progressClassName="bg-neon-blue"
            />
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}

