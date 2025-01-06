import Logo from './logo'

export default function SimplifiedNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center h-16">
          <Logo />
        </div>
      </div>
    </nav>
  )
}

