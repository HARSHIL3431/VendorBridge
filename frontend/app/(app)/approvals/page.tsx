'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import { CheckCircle2, User, IndianRupee, Store, FileText, Loader2 } from 'lucide-react'
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

export default function ApprovalsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { data: approvals, mutate } = useSWR('approvals', () => db.listApprovals())
  const [poGeneratingId, setPoGeneratingId] = useState<string | null>(null)

  const handleGeneratePO = async (quotationId: string) => {
    setPoGeneratingId(quotationId)
    try {
      await db.generatePO(quotationId)
      toast.success('Purchase Order generated successfully!')
      router.push('/purchase-orders')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to generate Purchase Order')
    } finally {
      setPoGeneratingId(null)
    }
  }

  const showActionColumn = can(user?.role, 'generatePO')

  return (
    <div>
      <PageHeader
        eyebrow="Workflow"
        title="Quotation"
        accentWord="approvals"
        description="Review quotation approval decisions made by managers."
      />

      {!approvals ? (
        <LoadingState label="Loading approvals…" />
      ) : approvals.length === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title="No approvals yet"
          description="Approved or rejected quotations will be listed here."
        />
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>RFQ & Vendor</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Remarks</TableHead>
                <TableHead>Date</TableHead>
                {showActionColumn && <TableHead className="text-right">Action</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {approvals.map((approval) => (
                <TableRow key={approval.id} className="hover:bg-muted/20">
                  <TableCell>
                    <div className="font-semibold text-foreground flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      {approval.quotation.rfq.title}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                      <Store className="h-3 w-3" />
                      {approval.quotation.vendor.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 font-medium">
                      <IndianRupee className="h-3 w-3" />
                      {formatINR(approval.quotation.price)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                      approval.status === 'APPROVED' 
                        ? 'bg-green-500/10 text-green-600 ring-green-500/20' 
                        : 'bg-red-500/10 text-red-600 ring-red-500/20'
                    }`}>
                      {approval.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate" title={approval.remarks}>
                    {approval.remarks || '—'}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {timeAgo(approval.createdAt)}
                  </TableCell>
                  {showActionColumn && (
                    <TableCell className="text-right">
                      {approval.status === 'APPROVED' && (
                        <Button
                          size="sm"
                          disabled={poGeneratingId !== null}
                          onClick={() => handleGeneratePO(approval.quotationId)}
                          className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold"
                        >
                          {poGeneratingId === approval.quotationId ? (
                            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                          ) : null}
                          Generate PO
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
