'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FilePlus, FolderKanban, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Role } from '@/lib/definitions';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home, roles: ['Oficina Emisora', 'Supervisor', 'Gerente'] },
  { href: '/documents/new', label: 'Nuevo Documento', icon: FilePlus, roles: ['Oficina Emisora'] },
  { href: '/dashboard/review', label: 'Revisar Documentos', icon: FolderKanban, roles: ['Supervisor'] },
  { href: '/dashboard/reports', label: 'Reportes', icon: BarChart3, roles: ['Gerente'] },
];

export function NavLinks({ userRole }: { userRole: Role }) {
  const pathname = usePathname();

  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole));
  
  // Custom logic for dashboard active state
  const isDashboardActive = (itemHref: string) => {
    if (itemHref === '/dashboard') {
        return pathname === '/dashboard';
    }
    return pathname.startsWith(itemHref);
  }

  return (
    <nav className="grid items-start px-2 text-sm font-medium">
      {filteredNavItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
            { 'bg-sidebar-accent text-primary': isDashboardActive(item.href) }
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
