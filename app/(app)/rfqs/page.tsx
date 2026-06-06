'use client'

import useSWR from 'swr'
import Link from 'next/link'
import { Plus, FileText, Calendar, Box, ArrowRight } from 'lucide-react'
import { db } from '@/lib/api'
import { PageHeader } from '@/components/page-header'
import { StatusBadge } from '@/components/status-badge'
import { LoadingState, EmptyState } from '@/components/states'
import { Button } from '@/components/ui/button'
import { timeAgo } from '@/lib/helpers'

export default function RfqsPage() {
  const { data: rfqs } = useSWR('rfqs', () => db.listRfqs())

  return (
    <div>
      <PageHeader
        eyebrow="Procurement"
        title="Manage your"
        accentWord="RFQs"
        description="Create and track Requests for Quotation across your vendor network."
      >
        <Button
          render={<Link href="/rfqs/new" />}
          className="bg-accent font-bold text-accent-foreground hover:bg-accent/90"
        >
          <Plus className="mr-2 h-4 w-4" /> New RFQ
        </Button>
      </PageHeader>

      {!rfqs ? (
        <LoadingState label="Loading RFQs…" />
      ) : rfqs.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No RFQs found"
          description="Create your first Request for Quotation to start receiving bids."
          action={
            <Button render={<Link href="/rfqs/new" />} className="mt-4">
              <Plus className="mr-2 h-4 w-4" /> Create RFQ
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rfqs.map((rfq) => (
            <div key={rfq.id} className="group relative rounded-2xl border border-border bg-card p-5 transition-colors hover:border-accent hover:bg-accent/5">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <StatusBadge status={rfq.status} />
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground">
                <Link href={`/rfqs/${rfq.id}`} className="focus:outline-none">
                  <span className="absolute inset-0" aria-hidden="true" />
                  {rfq.title}
                </Link>
              </h3>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {rfq.description}
              </p>
              <div className="mt-6 flex items-center justify-between text-xs font-medium text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5"><Box className="h-3.5 w-3.5" /> Qty: {rfq.quantity}</span>
                  <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {timeAgo(rfq.createdAt)}</span>
                </div>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
