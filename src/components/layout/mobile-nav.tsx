"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface MobileNavProps {
  onClose: () => void
}

const agentLinks = [
  {
    id: 'heuristics',
    name: 'Análise Heurística',
    href: '/agents/heuristics',
    description: 'Avalie interfaces com as heurísticas de Nielsen'
  },
  {
    id: 'patterns',
    name: 'Repositório de Padrões',
    href: '/agents/patterns',
    description: 'Descubra padrões UX/UI para seu desafio'
  },
  {
    id: 'usecases',
    name: 'Casos de Uso',
    href: '/agents/usecases',
    description: 'Gere casos de uso para suas funcionalidades'
  },
  {
    id: 'coreaction',
    name: 'Core Action',
    href: '/agents/coreaction',
    description: 'Defina a ação principal do seu produto'
  },
  {
    id: 'comparison',
    name: 'Confronto de Ideias',
    href: '/agents/comparison',
    description: 'Compare duas ideias e determine a melhor'
  },
  {
    id: 'ideation',
    name: 'Ideação de Features',
    href: '/agents/ideation',
    description: 'Gere ideias para novas funcionalidades'
  }
]

export function MobileNav({ onClose }: MobileNavProps) {
  const pathname = usePathname()

  return (
    <div className="fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 md:hidden">
      <div className="relative z-20 rounded-md bg-popover p-4">
        <nav className="grid gap-2">
          <h2 className="text-lg font-semibold mb-2">Agentes</h2>
          {agentLinks.map((agent) => (
            <Link
              key={agent.id}
              href={agent.href}
              className={cn(
                "flex flex-col rounded-md p-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname === agent.href ? "bg-accent text-accent-foreground" : ""
              )}
              onClick={onClose}
            >
              <span className="font-medium">{agent.name}</span>
              <span className="text-xs text-muted-foreground">{agent.description}</span>
            </Link>
          ))}
          <div className="mt-4 border-t pt-4">
            <Link
              href="/subscription"
              className={cn(
                "flex items-center rounded-md p-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname === "/subscription" ? "bg-accent text-accent-foreground" : ""
              )}
              onClick={onClose}
            >
              Assinatura
            </Link>
            <Link
              href="/profile"
              className={cn(
                "flex items-center rounded-md p-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname === "/profile" ? "bg-accent text-accent-foreground" : ""
              )}
              onClick={onClose}
            >
              Perfil
            </Link>
            <Link
              href="/settings"
              className={cn(
                "flex items-center rounded-md p-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname === "/settings" ? "bg-accent text-accent-foreground" : ""
              )}
              onClick={onClose}
            >
              Configurações
            </Link>
          </div>
        </nav>
      </div>
    </div>
  )
}
