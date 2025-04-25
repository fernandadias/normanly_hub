"use client"

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ChevronRight } from 'lucide-react'

const ROUTE_LABELS: Record<string, string> = {
  agents: 'Agentes',
  heuristics: 'Análise Heurística',
  history: 'Histórico',
};

export function AppBreadcrumb() {
  const pathname = usePathname()
  
  if (pathname === '/') return null;
  
  const segments = pathname.split('/').filter(Boolean);
  const isInSidebar = segments.length === 1;
  
  if (isInSidebar) return null;

  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Início</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {segments.map((segment, index) => {
          const path = `/${segments.slice(0, index + 1).join('/')}`;
          const isLast = index === segments.length - 1;
          
          return (
            <div key={path}>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                {isLast ? (
                  <span>{ROUTE_LABELS[segment] || segment}</span>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={path}>{ROUTE_LABELS[segment] || segment}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
} 