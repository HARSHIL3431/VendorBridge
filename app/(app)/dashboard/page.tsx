'use client'

import useSWR from 'swr'
import Link from 'next/link'
import {
  Store,
  FileText,
  CheckCircle2,
  Receipt,
  ScrollText,
  ArrowUpRight,
  FileText as RfqIcon,
  Send,
  CircleCheck,
  CircleX,
  Truck,
  FilePlus2,
  Mail,
} from 'lucide-react'
import { db } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'
import { formatINR, timeAgo } from '@/lib/helpers'
import type { ActivityType } from '@/lib/types'
import { PageHeader } from '@/components/page-header'
import { StatCard } from '@/components/stat-card'
import { StatusBadge } from '@/components/status-badge'
import { LoadingState } from '@/components/states'
import { Button } from '@/components/ui/button'
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Cell,
} from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

const ACTIVITY_ICON: Record<ActivityType, React.ElementType> = {
  RFQ_CREATED: RfqIcon,
  QUOTATION_SUBMITTED: Send,
  QUOTATION_APPROVED: CircleCheck,
  QUOTATION_REJECTED: CircleX,
  VENDOR_CREATED: Store,
  PO_GENERATED: Truck,
  INVOICE_GENERATED: FilePlus2,
  INVOICE_SENT: Mail,
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { data: stats } = useSWR('dashboard-stats', () => db.dashboardStats())
  const { data: rfqs } = useSWR('rfqs', () => db.listRfqs())
  const { data: invoices } = useSWR('invoices', () => db.listInvoices())

  const firstName = user?.name.split(' ')[0]

  const spendByStatus = invoices
    ? [
        { name: 'Pending', value: invoices.filter((i) => i.status === 'PENDING').reduce((s, i) => s + i.total, 0), fill: 'var(--color-pending)' },
        { name: 'Paid', value: invoices.filter((i) => i.status === 'PAID').reduce((s, i) => s + i.total, 0), fill: 'var(--color-paid)' },
        { name: 'Overdue', value: invoices.filter((i) => i.status === 'OVERDUE').reduce((s, i) => s + i.total, 0), fill: 'var(--color-overdue)' },
      ]
    : []

  return (
    <div>
      <PageHeader
        eyebrow={`Hello, ${firstName ?? 'there'}`}
        title="Your procurement"
        accentWord="snapshot"
        description="A live view of vendors, requests, approvals and spend across VendorBridge."
      >
        <Button
          render={<Link href="/rfqs/new" />}
          className="bg-accent font-bold text-accent-foreground hover:bg-accent/90"
        >
          New RFQ <ArrowUpRight className="ml-1 h-4 w-4" />
        </Button>
      </PageHeader>

      {!stats ? (
        <LoadingState label="Loading dashboard…" />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
            <StatCard label="Total Vendors" value={stats.totalVendors} icon={Store} tone="forest" />
            <StatCard label="Active RFQs" value={stats.activeRfqs} icon={FileText} tone="orange" />
            <StatCard label="Pending Approvals" value={stats.pendingApprovals} icon={CheckCircle2} tone="gold" />
            <StatCard label="Purchase Orders" value={stats.totalPurchaseOrders} icon={ScrollText} tone="olive" />
            <StatCard label="Invoices" value={stats.totalInvoices} icon={Receipt} tone="rust" />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {/* Spend chart */}
            <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-2">
              <div className="mb-1 flex items-center justify-between">
                <h2 className="font-heading text-xl font-extrabold text-foreground">
                  Invoice spend by status
                </h2>
                <span className="text-sm font-semibold text-muted-foreground">
                  {invoices ? formatINR(invoices.reduce((s, i) => s + i.total, 0)) : '—'} total
                </span>
              </div>
              <ChartContainer
                config={{
                  value: { label: 'Amount' },
                  pending: { label: 'Pending', color: 'var(--chart-2)' },
                  paid: { label: 'Paid', color: 'var(--chart-4)' },
                  overdue: { label: 'Overdue', color: 'var(--chart-5)' },
                }}
                className="mt-4 h-[260px] w-full"
              >
                <BarChart data={spendByStatus} barSize={56}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    width={70}
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent formatter={(v) => formatINR(Number(v))} />}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {spendByStatus.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </div>

            {/* Recent activity */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-heading text-xl font-extrabold text-foreground">
                Recent activity
              </h2>
              <ul className="mt-4 space-y-4">
                {stats.recentActivity.map((a, idx) => {
                  const Icon = ACTIVITY_ICON[a.type as ActivityType] ?? FileText
                  return (
                    <li key={idx} className="flex gap-3">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-accent">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium leading-snug text-foreground">
                          {a.message}
                        </p>
                        <p className="text-xs text-muted-foreground">{timeAgo(a.createdAt)}</p>
                      </div>
                    </li>
                  )
                })}
              </ul>
              <Button
                render={<Link href="/activity" />}
                variant="ghost"
                className="mt-4 w-full font-semibold text-accent hover:bg-accent/5 hover:text-accent"
              >
                View all activity
              </Button>
            </div>
          </div>

          {/* RFQ pipeline */}
          <div className="mt-6 rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <Button render={<Link href="/rfqs" />} variant="ghost" className="font-semibold text-accent hover:bg-accent/5 hover:text-accent">
                View all
              </Button>
            </div>
            <div className="space-y-2">
              {rfqs?.slice(0, 4).map((r) => (
                <Link
                  key={r.id}
                  href={`/rfqs/${r.id}`}
                  className="flex items-center justify-between rounded-xl border border-border px-4 py-3 transition-colors hover:border-accent hover:bg-accent/5"
                >
                  <div className="min-w-0">
                    <p className="truncate font-bold text-foreground">{r.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Qty {r.quantity} · {timeAgo(r.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={r.status} />
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
