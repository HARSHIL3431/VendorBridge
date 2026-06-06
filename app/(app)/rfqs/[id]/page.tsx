'use client'

import { useState } from 'react'
import useSWR, { mutate } from 'swr'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Box, Calendar, FileText, Send, Store, IndianRupee, Loader2, CheckCircle2 } from 'lucide-react'
import { db } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'
import { PageHeader } from '@/components/page-header'
import { StatusBadge } from '@/components/status-badge'
import { LoadingState, EmptyState } from '@/components/states'
import { formatINR, timeAgo } from '@/lib/helpers'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function RfqDetailsPage() {
  const params = useParams()
  const id = params.id as string
  const { user } = useAuth()
  const { data: rfq, error } = useSWR(`rfq-${id}`, () => db.getRfq(id))

  const [price, setPrice] = useState('')
  const [deliveryDays, setDeliveryDays] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const isVendor = user?.role === 'VENDOR'
  const myQuote = rfq?.quotations.find((q) => q.vendorId === user?.vendorId)

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !user.vendorId) return

    setSubmitting(true)
    try {
      if (myQuote) {
        await db.updateQuotation(myQuote.id, {
          price: parseFloat(price),
          deliveryDays: parseInt(deliveryDays),
          notes,
        })
        toast.success('Quotation updated successfully!')
        setIsEditing(false)
      } else {
        await db.submitQuotation({
          rfqId: id,
          vendorId: user.vendorId,
          price: parseFloat(price),
          deliveryDays: parseInt(deliveryDays),
          notes,
        })
        toast.success('Quotation submitted successfully!')
      }
      mutate(`rfq-${id}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to submit quotation')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <Link href="/rfqs" className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to RFQs
      </Link>

      {!rfq ? (
        <LoadingState label="Loading RFQ details…" />
      ) : (
        <>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <StatusBadge status={rfq.status} />
                <span className="text-xs font-semibold text-muted-foreground">ID: {rfq.id}</span>
              </div>
              <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground text-balance">
                {rfq.title}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {rfq.description}
              </p>
              
              <div className="mt-6 flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Box className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Quantity</p>
                    {rfq.quantity} units
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Deadline</p>
                    {new Date(rfq.deadline).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10">
            {isVendor ? (
              myQuote && !isEditing ? (
                <div className="rounded-2xl border border-success/20 bg-success/5 p-6 max-w-xl">
                  <div className="flex items-center justify-between mb-4 border-b border-border/50 pb-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-6 w-6 text-success" />
                      <div>
                        <h3 className="font-heading text-lg font-bold text-foreground">Quotation Submitted</h3>
                        <p className="text-xs text-muted-foreground">Your proposal has been logged successfully.</p>
                      </div>
                    </div>
                    {rfq.status === 'OPEN' && (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          setPrice(myQuote.price.toString())
                          setDeliveryDays(myQuote.deliveryDays.toString())
                          setNotes(myQuote.notes || '')
                          setIsEditing(true)
                        }}
                        className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold"
                      >
                        Edit Bid
                      </Button>
                    )}
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Proposed Price:</span>
                      <span className="font-bold text-foreground">{formatINR(myQuote.price)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery Timeline:</span>
                      <span className="font-semibold text-foreground">{myQuote.deliveryDays} days</span>
                    </div>
                    {myQuote.notes && (
                      <div className="pt-2">
                        <span className="text-xs text-muted-foreground block mb-1">Notes:</span>
                        <p className="text-xs bg-card p-3 rounded-lg border border-border">{myQuote.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : rfq.status !== 'OPEN' ? (
                <EmptyState
                  icon={Calendar}
                  title="RFQ is closed"
                  description="This RFQ is no longer accepting quotations."
                />
              ) : (
                <div className="rounded-2xl border border-border bg-card p-6 max-w-xl">
                  <div className="mb-6 flex items-center gap-3 border-b border-border pb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Send className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="font-heading text-lg font-bold text-foreground">
                        {myQuote ? 'Edit Quotation' : 'Submit Quotation'}
                      </h2>
                      <p className="text-xs text-muted-foreground">Provide your bidding rates and timelines.</p>
                    </div>
                  </div>

                  <form onSubmit={handleBidSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="price">Price Per Unit (₹)</Label>
                      <Input
                        id="price"
                        type="number"
                        min="0.01"
                        step="0.01"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="e.g. 1500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="delivery">Delivery Timeline (Days)</Label>
                      <Input
                        id="delivery"
                        type="number"
                        min="1"
                        required
                        value={deliveryDays}
                        onChange={(e) => setDeliveryDays(e.target.value)}
                        placeholder="e.g. 7"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="notes">Notes / Remarks</Label>
                      <Textarea
                        id="notes"
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Additional details, warranty, or support notes..."
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      {myQuote && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setIsEditing(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      )}
                      <Button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 font-bold"
                      >
                        {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {myQuote ? 'Update Proposal' : 'Submit Proposal'}
                      </Button>
                    </div>
                  </form>
                </div>
              )
            ) : (
              <>
                <h2 className="mb-4 font-heading text-xl font-extrabold text-foreground">
                  Submitted Quotations ({rfq.quotations.length})
                </h2>
                
                {rfq.quotations.length === 0 ? (
                  <EmptyState
                    icon={Send}
                    title="No bids yet"
                    description="Quotations for this RFQ will appear here once vendors submit them."
                  />
                ) : (
                  <div className="rounded-xl border border-border bg-card overflow-hidden">
                    <Table>
                      <TableHeader className="bg-muted/50">
                        <TableRow>
                          <TableHead>Vendor</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Delivery</TableHead>
                          <TableHead>Notes</TableHead>
                          <TableHead>Submitted</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rfq.quotations.map((q) => (
                          <TableRow key={q.id} className="hover:bg-muted/20">
                            <TableCell className="font-semibold text-foreground">
                              <div className="flex items-center gap-2">
                                <Store className="h-4 w-4 text-muted-foreground" />
                                {q.vendor.name}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1.5 font-bold text-foreground">
                                <IndianRupee className="h-3 w-3" />
                                {formatINR(q.price)}
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {q.deliveryDays} days
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate" title={q.notes}>
                              {q.notes || '—'}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {timeAgo(q.createdAt)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}
