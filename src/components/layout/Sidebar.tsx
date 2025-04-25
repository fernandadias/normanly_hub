"use client"

import { Home, History, CreditCard, Brain } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const navigation = [
  { name: 'Hub de Agentes', href: '/agents', icon: Home },
  { name: 'Histórico', href: '/history', icon: History },
  { name: 'Planos', href: '/plans', icon: CreditCard },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Força a sidebar expandida em telas menores
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(false)
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize() // Checa o tamanho inicial da tela

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className={cn(
      "h-screen bg-card border-r border-border flex flex-col transition-all duration-300 sticky top-0",
      isCollapsed ? "w-[80px]" : "w-64"
    )}>
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-4 top-2 hidden lg:flex h-8 w-8 border border-border bg-background"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>

      <div className="p-4">
        {isCollapsed ? (
          <div className="flex justify-center">
            <Brain className="h-5 w-5 text-primary" />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <span className="font-semibold text-lg">Normanly</span>
          </div>
        )}
      </div>

      <div className="flex-1 px-2">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center py-2 text-sm font-medium rounded-md transition-colors',
                  isCollapsed ? 'justify-center px-2' : 'px-3',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {(!isCollapsed || window.innerWidth < 1024) && <span className="ml-3">{item.name}</span>}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-border">
        <div className={cn("space-y-2", isCollapsed && "text-center")}>
          <div className="text-sm font-medium">Plano Atual</div>
          {!isCollapsed && <div className="text-xs text-muted-foreground">Free</div>}
          <div className="h-2 bg-accent rounded-full">
            <div className="h-2 bg-primary rounded-full w-1/4" />
          </div>
          {!isCollapsed && <div className="text-xs text-muted-foreground">25% usado</div>}
          <Button
            variant="link"
            className={cn(
              "text-sm font-medium text-primary hover:text-primary/80",
              isCollapsed ? "w-full p-0" : "w-full"
            )}
          >
            {isCollapsed ? "Pro" : "Upgrade"}
          </Button>
        </div>
      </div>
    </div>
  )
} 