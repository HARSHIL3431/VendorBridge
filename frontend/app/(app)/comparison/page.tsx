'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { GitCompareArrows, AlertCircle, Store, IndianRupee, Truck, Star, ArrowUpDown, Loader2 } from 'lucide-react'
import { db } from '@/lib/api'
import { PageHeader } from '@/components/page-header'
import { LoadingState, EmptyState } from '@/components/states'
import { formatINR, can } from '@/lib/helpers'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth-context'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function ComparisonPage() {
  const { user } = useAuth()
  const [selectedRfq, setSelectedRfq] = useState<string | null>(null)
  const { data: rfqs } = useSWR('rfqs', () => db.listRfqs())
  const { data: comparison, mutate } = useSWR(
    selectedRfq ? `compare-${selectedRfq}` : null,
    () => db.compare(selectedRfq!)
  )

  // Sorting & Filtering States
  const [sortBy, setSortBy] = useState<'price' | 'delivery' | null>(null)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [maxPrice, setMaxPrice] = useState('')
  const [maxDelivery, setMaxDelivery] = useState('')

  // Evaluation States
  const [evalOpen, setEvalOpen] = useState(false)
  const [evalQuoteId, setEvalQuoteId] = useState<string | null>(null)
  const [evalStatus, setEvalStatus] = useState<'APPROVED' | 'REJECTED'>('APPROVED')
  const [evalRemarks, setEvalRemarks] = useState('')
  const [evalSubmitting, setEvalSubmitting] = useState(false)

  const handleOpenEval = (quotationId: string) => {
    setEvalQuoteId(quotationId)
    setEvalStatus('APPROVED')
    setEvalRemarks('')
    setEvalOpen(true)
  }

  const handleSubmitEval = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !evalQuoteId) return
    setEvalSubmitting(true)
    try {
      await db.approve({
        quotationId: evalQuoteId,
        status: evalStatus,
        remarks: evalRemarks,
      })
      toast.success(`Quotation ${evalStatus.toLowerCase()} successfully!`)
      setEvalOpen(false)
      mutate()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to submit evaluation')
    } finally {
      setEvalSubmitting(false)
    }
  }

  // Helpers to get a mock rating for the vendor
  const getMockRating = (vendorId: string) => {
    // Generate a semi-stable rating between 3.5 and 5.0 based on vendorId hash
    let sum = 0
    for (let i = 0; i < vendorId.length; i++) sum += vendorId.charCodeAt(i)
    return (3.5 + (sum % 16) * 0.1).toFixed(1)
  }

  // Process data (Filter then Sort)
  let processedQuotations = comparison?.quotations ? [...comparison.quotations] : []

  if (maxPrice) {
    processedQuotations = processedQuotations.filter(q => q.price <= parseFloat(maxPrice))
  }
  if (maxDelivery) {
    processedQuotations = processedQuotations.filter(q => q.deliveryDays <= parseInt(maxDelivery))
  }

  if (sortBy === 'price') {
    processedQuotations.sort((a, b) => sortOrder === 'asc' ? a.price - b.price : b.price - a.price)
  } else if (sortBy === 'delivery') {
    processedQuotations.sort((a, b) => sortOrder === 'asc' ? a.deliveryDays - b.deliveryDays : b.deliveryDays - a.deliveryDays)
  }

  const toggleSort = (field: 'price' | 'delivery') => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Evaluation"
        title="Compare"
        accentWord="quotations"
        description="Analyze incoming bids side-by-side to make the best procurement decisions."
      />

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <div className="md:col-span-1">
          <label className="text-sm font-bold text-foreground mb-2 block">Select an RFQ to compare bids</label>
          <Select onValueChange={setSelectedRfq}>
            <SelectTrigger className="w-full bg-card h-11">
              <SelectValue placeholder="Select RFQ..." />
            </SelectTrigger>
            <SelectContent>
              {rfqs?.map(rfq => (
                <SelectItem key={rfq.id} value={rfq.id}>{rfq.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedRfq && comparison && (
          <>
            <div>
              <label className="text-sm font-bold text-foreground mb-2 block">Filter by Max Price (₹)</label>
              <Input
                type="number"
                placeholder="Enter max price..."
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
                className="h-11 bg-card"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-foreground mb-2 block">Filter by Max Delivery (Days)</label>
              <Input
                type="number"
                placeholder="Enter max days..."
                value={maxDelivery}
                onChange={e => setMaxDelivery(e.target.value)}
                className="h-11 bg-card"
              />
            </div>
          </>
        )}
      </div>

      {!selectedRfq ? (
        <EmptyState
          icon={GitCompareArrows}
          title="No RFQ selected"
          description="Please select an RFQ from the dropdown above to view comparisons."
        />
      ) : !comparison ? (
        <LoadingState label="Loading comparison data…" />
      ) : comparison.quotations.length === 0 ? (
        <EmptyState
          icon={AlertCircle}
          title="No quotations yet"
          description="This RFQ has not received any bids yet."
        />
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Vendor</TableHead>
                <TableHead>
                  <button onClick={() => toggleSort('price')} className="flex items-center gap-1 hover:text-foreground">
                    Price <ArrowUpDown className="h-3.5 w-3.5" />
                  </button>
                </TableHead>
                <TableHead>
                  <button onClick={() => toggleSort('delivery')} className="flex items-center gap-1 hover:text-foreground">
                    Delivery <ArrowUpDown className="h-3.5 w-3.5" />
                  </button>
                </TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processedQuotations.map((q) => {
                const rating = getMockRating(q.vendorId)
                return (
                  <TableRow key={q.quotationId} className={`hover:bg-muted/20 ${q.lowestPrice ? 'bg-green-500/5 hover:bg-green-500/10' : ''}`}>
                    <TableCell className="font-semibold text-foreground">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Store className="h-4 w-4 text-muted-foreground" />
                          {q.vendor}
                          {q.lowestPrice && (
                            <span className="ml-2 inline-flex items-center rounded-md bg-green-500/10 px-2 py-1 text-[10px] font-bold text-green-600 ring-1 ring-inset ring-green-500/20 uppercase">
                              Lowest Bid
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                          <Star className="h-3 w-3 fill-amber-500" />
                          {rating} / 5.0
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 font-bold text-foreground">
                        <IndianRupee className="h-3 w-3" />
                        {formatINR(q.price)}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Truck className="h-4 w-4" />
                        {q.deliveryDays} days
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[250px] truncate" title={q.notes}>
                      {q.notes || '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      {can(user?.role, 'approve') && (
                        <Button 
                          size="sm" 
                          onClick={() => handleOpenEval(q.quotationId)}
                          className="bg-accent text-accent-foreground hover:bg-accent/90"
                        >
                          Evaluate
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
              {processedQuotations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-sm text-muted-foreground">
                    No quotations match your filter criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
      {/* Evaluation Dialog */}
      <Dialog open={evalOpen} onOpenChange={setEvalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Evaluate Bid / Quotation</DialogTitle>
            <DialogDescription>
              Submit approval or rejection decisions with remarks for this quotation.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitEval} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="evalStatus">Decision</Label>
              <Select value={evalStatus} onValueChange={(v: any) => setEvalStatus(v)}>
                <SelectTrigger id="evalStatus" className="h-11 bg-card">
                  <SelectValue placeholder="Select decision" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="APPROVED">Approve Quotation</SelectItem>
                  <SelectItem value="REJECTED">Reject Quotation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="evalRemarks">Remarks / Reason</Label>
              <Input
                id="evalRemarks"
                required
                value={evalRemarks}
                onChange={(e) => setEvalRemarks(e.target.value)}
                placeholder="e.g. Best price/timeline or over budget..."
                className="bg-card h-11"
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="ghost" onClick={() => setEvalOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={evalSubmitting}
                className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold"
              >
                {evalSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Submit Decision
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
