"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

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

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="hidden md:flex items-center gap-6">
      <div className="relative group">
        <button className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary">
          Agentes
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ml-1 h-3 w-3 transition duration-200 group-hover:rotate-180"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
        <div className="absolute left-0 top-full z-50 mt-2 hidden w-64 rounded-md border bg-popover p-2 shadow-md transition-all group-hover:block">
          <div className="grid gap-1">
            {agentLinks.map((agent) => (
              <Link
                key={agent.id}
                href={agent.href}
                className={cn(
                  "flex flex-col rounded-md p-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                  pathname === agent.href ? "bg-accent text-accent-foreground" : ""
                )}
              >
                <span className="font-medium">{agent.name}</span>
                <span className="text-xs text-muted-foreground">{agent.description}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Link
        href="/subscription"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/subscription" ? "text-primary" : "text-muted-foreground"
        )}
      >
        Assinatura
      </Link>
    </nav>
  )
}
