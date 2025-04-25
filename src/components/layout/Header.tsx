"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { UserNav } from './user-nav'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'

const mockSuggestions = [
  {
    group: "Análises Recentes",
    items: [
      { title: "Análise de Código - Projeto X", href: "/analysis/1" },
      { title: "Revisão de PR - Feature Y", href: "/analysis/2" },
    ]
  },
  {
    group: "Planos",
    items: [
      { title: "Plano de Refatoração", href: "/plans/1" },
      { title: "Plano de Migração", href: "/plans/2" },
    ]
  }
]

export function Header() {
  const [spotlightOpen, setSpotlightOpen] = useState(false)

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4 md:px-6">
        <div className="ml-auto flex items-center space-x-4">
          <Button
            variant="outline"
            className="w-9 px-0 md:w-60 md:px-3 md:justify-start"
            onClick={() => setSpotlightOpen(true)}
          >
            <Search className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline-flex">Pesquisar...</span>
            <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 md:ml-auto md:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
          <UserNav />
        </div>
      </div>

      <CommandDialog open={spotlightOpen} onOpenChange={setSpotlightOpen}>
        <CommandInput placeholder="Digite para pesquisar..." />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          {mockSuggestions.map((group) => (
            <CommandGroup key={group.group} heading={group.group}>
              {group.items.map((item) => (
                <CommandItem
                  key={item.href}
                  onSelect={() => {
                    setSpotlightOpen(false)
                    window.location.href = item.href
                  }}
                >
                  {item.title}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </header>
  )
} 