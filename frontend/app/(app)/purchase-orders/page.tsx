'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import { ScrollText, Store, FileText, IndianRupee, Hash, Loader2 } from 'lucide-react'
import { db } from '@/lib/api'
import { PageHeader } from '@/components/page-header'
import { LoadingState, EmptyState } from '@/components/states'
import { timeAgo, formatINR, can } from '@/lib/helpers'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function PurchaseOrdersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { data: pos, mutate } = useSWR('purchase-orders', () => db.listPurchaseOrders())
  const [invoiceGeneratingId, setInvoiceGeneratingId] = useState<string | null>(null)

  const handleGenerateInvoice = async (purchaseOrderId: string) => {
    setInvoiceGeneratingId(purchaseOrderId)
    try {
      await db.generateInvoice(purchaseOrderId)
      toast.success('Invoice generated successfully!')
      router.push('/invoices')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to generate Invoice')
    } finally {
      setInvoiceGeneratingId(null)
    }
  }

  const showActionColumn = can(user?.role, 'generateInvoice')

  return (
    <div>
      <PageHeader
        eyebrow="Fulfilment"
        title="Purchase"
        accentWord="Orders"
        description="Track and manage purchase orders generated from approved quotations."
      />

      {!pos ? (
        <LoadingState label="Loading purchase orders…" />
      ) : pos.length === 0 ? (
        <EmptyState
          icon={ScrollText}
          title="No purchase orders"
          description="Approved quotations will generate purchase orders here."
        />
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>PO Number</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>RFQ Details</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                {showActionColumn && <TableHead className="text-right">Action</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {pos.map((po) => (
                <TableRow key={po.id} className="hover:bg-muted/20">
                  <TableCell className="font-semibold text-foreground">
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      {po.poNumber}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <Store className="h-4 w-4 text-muted-foreground" />
                      {po.quotation.vendor.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      {po.quotation.rfq.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 font-medium">
                      <IndianRupee className="h-3 w-3" />
                      {formatINR(po.quotation.price)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-md bg-accent/10 px-2 py-1 text-xs font-medium text-accent ring-1 ring-inset ring-accent/20">
                      {po.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {timeAgo(po.createdAt)}
                  </TableCell>
                  {showActionColumn && (
                    <TableCell className="text-right">
                      {po.status === 'ISSUED' && (
                        <Button
                          size="sm"
                          disabled={invoiceGeneratingId !== null}
                          onClick={() => handleGenerateInvoice(po.id)}
                          className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold"
                        >
                          {invoiceGeneratingId === po.id ? (
                            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                          ) : null}
                          Generate Invoice
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
