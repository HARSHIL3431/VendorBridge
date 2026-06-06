'use client'

import useSWR from 'swr'
import { Send, FileText, Store, IndianRupee, Truck } from 'lucide-react'
import { db } from '@/lib/api'
import { PageHeader } from '@/components/page-header'
import { LoadingState, EmptyState } from '@/components/states'
import { timeAgo, formatINR } from '@/lib/helpers'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function QuotationsPage() {
  const { data: quotations } = useSWR('quotations', () => db.listQuotations())

  return (
    <div>
      <PageHeader
        eyebrow="Quotations"
        title="View all"
        accentWord="bids"
        description="Review incoming quotations from vendors across different RFQs."
      />

      {!quotations ? (
        <LoadingState label="Loading quotations…" />
      ) : quotations.length === 0 ? (
        <EmptyState
          icon={Send}
          title="No quotations yet"
          description="Quotations submitted by vendors will appear here."
        />
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Vendor</TableHead>
                <TableHead>RFQ</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Delivery Days</TableHead>
                <TableHead>Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotations.map((quotation) => (
                <TableRow key={quotation.id} className="hover:bg-muted/20">
                  <TableCell className="font-semibold text-foreground">
                    <div className="flex items-center gap-2">
                      <Store className="h-4 w-4 text-muted-foreground" />
                      {quotation.vendor.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      {quotation.rfq.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 font-medium text-foreground">
                      <IndianRupee className="h-3 w-3" />
                      {formatINR(quotation.price)}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Truck className="h-4 w-4" />
                      {quotation.deliveryDays} days
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {timeAgo(quotation.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
