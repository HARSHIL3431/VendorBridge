'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, LogOut, GitCompareArrows, Bell, Info } from 'lucide-react'
import {
  LayoutDashboard,
  Store,
  FileText,
  Send,
  GitCompareArrows as Compare,
  CheckCircle2,
  ScrollText,
  Receipt,
  Activity as ActivityIcon,
  BarChart3,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useAuth } from '@/lib/auth-context'
import { ROLE_LABELS } from '@/lib/types'
import { can, initials, type Permission } from '@/lib/helpers'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/vendors', label: 'Vendors', icon: Store, permission: 'viewVendors' as Permission },
  { href: '/rfqs', label: 'RFQs', icon: FileText },
  { href: '/quotations', label: 'Quotations', icon: Send },
  { href: '/comparison', label: 'Comparison', icon: Compare, permission: 'compareQuotations' as Permission },
  { href: '/approvals', label: 'Approvals', icon: CheckCircle2 },
  { href: '/purchase-orders', label: 'Purchase Orders', icon: ScrollText },
  { href: '/invoices', label: 'Invoices', icon: Receipt },
  { href: '/activity', label: 'Activity Logs', icon: ActivityIcon },
  { href: '/reports', label: 'Reports', icon: BarChart3 },
]

const MOCK_NOTIFICATIONS = [
  { id: '1', title: 'New RFQ Created', message: 'Laptop Procurement 2026 RFQ is now live.', time: '10m ago' },
  { id: '2', title: 'Quotation Approved', message: 'Bid from ABC Tech Ltd has been approved by Manager.', time: '1h ago' },
  { id: '3', title: 'Invoice Issued', message: 'Invoice #INV-2026-001 generated for PO-2026-001.', time: '2h ago' },
]

export function Topbar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [unreadNotifications, setUnreadNotifications] = useState(MOCK_NOTIFICATIONS)

  const items = NAV.filter((i) => !i.permission || can(user?.role, i.permission))

  const handleClearNotifications = () => {
    setUnreadNotifications([])
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/80 px-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-2">
        {/* Mobile nav */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu" />
            }
          >
            <Menu className="h-5 w-5" />
          </DialogTrigger>
          <DialogContent className="left-0 top-0 h-full max-w-[16rem] translate-x-0 translate-y-0 rounded-none border-0 bg-sidebar p-0 text-sidebar-foreground data-[state=open]:slide-in-from-left sm:rounded-none">
            <DialogHeader className="flex h-16 flex-row items-center gap-2 px-6 text-left">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
                <GitCompareArrows className="h-5 w-5" strokeWidth={2.5} />
              </div>
              <DialogTitle className="font-heading text-xl font-extrabold text-sidebar-foreground">
                VendorBridge
              </DialogTitle>
            </DialogHeader>
            <nav className="space-y-1 px-3 pb-4">
              {items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + '/')
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold',
                      active
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                        : 'text-sidebar-foreground/80 hover:bg-sidebar-accent',
                    )}
                  >
                    <Icon className="h-[18px] w-[18px]" strokeWidth={2.25} />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-3">
        {/* Notification Bell Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-muted">
                <Bell className="h-5 w-5 text-foreground" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5 rounded-full bg-accent animate-pulse" />
                )}
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-80 p-2">
            <div className="flex items-center justify-between px-2 py-1.5">
              <span className="font-heading text-sm font-bold text-foreground">Notifications</span>
              {unreadNotifications.length > 0 && (
                <button onClick={handleClearNotifications} className="text-xs font-semibold text-accent hover:underline">
                  Clear all
                </button>
              )}
            </div>
            <DropdownMenuSeparator />
            {unreadNotifications.length > 0 ? (
              <div className="space-y-1 py-1 max-h-[280px] overflow-y-auto">
                {unreadNotifications.map((n) => (
                  <DropdownMenuItem key={n.id} className="flex gap-2.5 items-start p-2.5 rounded-lg focus:bg-muted/50 cursor-pointer">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent mt-0.5">
                      <Info className="h-4 w-4" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-foreground leading-tight">{n.title}</p>
                      <p className="text-[11px] text-muted-foreground leading-snug">{n.message}</p>
                      <p className="text-[10px] text-muted-foreground/75 font-medium pt-1">{n.time}</p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-muted-foreground">
                No new notifications
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button className="flex items-center gap-3 rounded-full py-1 pl-1 pr-3 transition-colors hover:bg-muted">
                <Avatar className="h-9 w-9 border-2 border-accent/40">
                  <AvatarFallback className="bg-accent text-accent-foreground text-sm font-bold">
                    {user ? initials(user.name) : '–'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden text-left sm:block">
                  <p className="text-sm font-bold leading-tight text-foreground">{user?.name}</p>
                  <p className="text-xs leading-tight text-muted-foreground">
                    {user ? ROLE_LABELS[user.role] : ''}
                  </p>
                </div>
              </button>
            }
          />
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <p className="font-bold">{user?.name}</p>
              <p className="text-xs font-normal text-muted-foreground">{user?.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
