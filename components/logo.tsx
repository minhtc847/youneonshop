import Link from 'next/link'

export default function Logo() {
  return (
    <Link href="/" className="text-2xl font-bold text-white transition-all duration-300 group">
      <span className="relative">
        Neon Lights
        <span className="absolute inset-0 bg-neon-blue opacity-0 group-hover:opacity-50 blur-lg transition-opacity duration-300"></span>
      </span>
    </Link>
  )
}

