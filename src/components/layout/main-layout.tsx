"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { UserNav } from '@/components/layout/user-nav'
import { MobileNav } from '@/components/layout/mobile-nav'
import { Badge } from '@/components/ui/badge'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur transition-all ${scrolled ? 'shadow-sm' : ''}`}>
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-6 md:gap-10">
              <Link href="/" className="flex items-center space-x-2 md:hidden">
                <span className="font-bold text-xl">Normanly Hub</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex">
                <Link href="/subscription" className="mr-4">
                  <Badge variant="outline">
                    Free Plan
                  </Badge>
                </Link>
              </div>
              <UserNav />
              <button
                className="flex items-center space-x-2 md:hidden"
                onClick={toggleMobileMenu}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                  />
                </svg>
              </button>
            </div>
          </div>
          {isMobileMenuOpen && (
            <MobileNav onClose={() => setIsMobileMenuOpen(false)} />
          )}
        </header>
        <main className="flex-1 p-6">{children}</main>
        <footer className="border-t py-6 md:py-0">
          <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Normanly Hub. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
                Termos
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
                Privacidade
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:underline">
                Contato
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
