'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Store,
  FileText,
  Send,
  GitCompareArrows,
  CheckCircle2,
  ScrollText,
  Receipt,
  Activity as ActivityIcon,
  BarChart3,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'
import type { Permission } from '@/lib/helpers'
import { can } from '@/lib/helpers'

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
  permission?: Permission
}

const NAV: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/vendors', label: 'Vendors', icon: Store, permission: 'viewVendors' },
  { href: '/rfqs', label: 'RFQs', icon: FileText },
  { href: '/quotations', label: 'Quotations', icon: Send },
  { href: '/comparison', label: 'Comparison', icon: GitCompareArrows, permission: 'compareQuotations' },
  { href: '/approvals', label: 'Approvals', icon: CheckCircle2 },
  { href: '/purchase-orders', label: 'Purchase Orders', icon: ScrollText },
  { href: '/invoices', label: 'Invoices', icon: Receipt },
  { href: '/activity', label: 'Activity Logs', icon: ActivityIcon },
  { href: '/reports', label: 'Reports', icon: BarChart3 },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  const items = NAV.filter((i) => !i.permission || can(user?.role, i.permission))

  return (
    <aside className="hidden w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground lg:flex">
      <div className="flex h-16 items-center gap-2 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
          <GitCompareArrows className="h-5 w-5" strokeWidth={2.5} />
        </div>
        <span className="font-heading text-xl font-extrabold tracking-tight">
          Vendor<span className="text-sidebar-primary">Bridge</span>
        </span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors',
                active
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              )}
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={2.25} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-5 py-4 text-xs text-sidebar-foreground/60">
        VendorBridge ERP v1.0
      </div>
    </aside>
  )
}
