'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { Receipt, Hash, IndianRupee, Store, FileText, FileDown, Mail, Printer, Loader2 } from 'lucide-react'
import { db } from '@/lib/api'
import { PageHeader } from '@/components/page-header'
import { LoadingState, EmptyState } from '@/components/states'
import { timeAgo, formatINR } from '@/lib/helpers'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export default function InvoicesPage() {
  const { data: invoices, mutate } = useSWR('invoices', () => db.listInvoices())
  const [emailOpen, setEmailOpen] = useState(false)
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null)
  const [recipientEmail, setRecipientEmail] = useState('')
  const [sending, setSending] = useState(false)

  // Print state
  const [printOpen, setPrintOpen] = useState(false)
  const [printInvoice, setPrintInvoice] = useState<any>(null)

  const handleDownload = async (invoiceId: string) => {
    try {
      await db.downloadInvoicePdf(invoiceId)
      toast.success('Invoice PDF download started')
    } catch (err) {
      toast.error('Failed to download invoice PDF')
    }
  }

  const handleEmailClick = (invoiceId: string) => {
    setSelectedInvoiceId(invoiceId)
    setRecipientEmail('')
    setEmailOpen(true)
  }

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedInvoiceId) return
    setSending(true)
    try {
      await db.sendInvoiceEmail(selectedInvoiceId, recipientEmail)
      toast.success('Invoice sent via email successfully!')
      setEmailOpen(false)
    } catch (err) {
      toast.error('Failed to send invoice email')
    } finally {
      setSending(false)
    }
  }

  const handlePrintClick = (invoice: any) => {
    setPrintInvoice(invoice)
    setPrintOpen(true)
  }

  const handleTriggerPrint = () => {
    const printContent = document.getElementById('printable-invoice-area')
    if (!printContent) return
    
    const windowUrl = 'about:blank'
    const uniqueName = new Date().getTime()
    const printWindow = window.open(windowUrl, uniqueName.toString(), 'left=50000,top=50000,width=0,height=0')
    if (!printWindow) return

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${printInvoice.invoiceNumber}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #333; }
            .header { border-bottom: 2px solid #ddd; padding-bottom: 20px; margin-bottom: 20px; }
            .title { font-size: 24px; font-weight: bold; }
            .details { margin-bottom: 30px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .item-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .item-table th, .item-table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            .item-table th { background: #f5f5f5; }
            .totals { text-align: right; }
            .totals div { margin-bottom: 5px; }
            .total-final { font-size: 18px; font-weight: bold; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">INVOICE</div>
            <div>Invoice Number: ${printInvoice.invoiceNumber}</div>
            <div>Date: ${new Date(printInvoice.createdAt).toLocaleDateString()}</div>
          </div>
          <div class="details">
            <div>
              <strong>Vendor:</strong><br />
              ${printInvoice.purchaseOrder.quotation.vendor.name}
            </div>
            <div>
              <strong>PO Reference:</strong><br />
              ${printInvoice.purchaseOrder.poNumber}
            </div>
          </div>
          <table class="item-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Procured goods/services ref ${printInvoice.purchaseOrder.poNumber}</td>
                <td>₹${printInvoice.subtotal.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>
          <div class="totals">
            <div>Subtotal: ₹${printInvoice.subtotal.toLocaleString('en-IN')}</div>
            <div>Tax (GST 18%): ₹${printInvoice.tax.toLocaleString('en-IN')}</div>
            <div class="total-final">Total: ₹${printInvoice.total.toLocaleString('en-IN')}</div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.close();
            }
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
  }

  return (
    <div>
      <PageHeader
        eyebrow="Billing"
        title="Manage"
        accentWord="invoices"
        description="View and process vendor invoices against issued purchase orders."
      />

      {!invoices ? (
        <LoadingState label="Loading invoices…" />
      ) : invoices.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No invoices yet"
          description="Invoices will be listed here once generated."
        />
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>PO Ref & Vendor</TableHead>
                <TableHead>Amount (Total)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id} className="hover:bg-muted/20">
                  <TableCell className="font-semibold text-foreground">
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      {invoice.invoiceNumber}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      {invoice.purchaseOrder.poNumber}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <Store className="h-3 w-3" />
                      {invoice.purchaseOrder.quotation.vendor.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 font-bold text-foreground">
                        <IndianRupee className="h-3 w-3" />
                        {formatINR(invoice.total)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Sub: {formatINR(invoice.subtotal)} | Tax: {formatINR(invoice.tax)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                      invoice.status === 'PAID'
                        ? 'bg-green-500/10 text-green-600 ring-green-500/20'
                        : invoice.status === 'OVERDUE'
                        ? 'bg-red-500/10 text-red-600 ring-red-500/20'
                        : 'bg-orange-500/10 text-orange-600 ring-orange-500/20'
                    }`}>
                      {invoice.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {timeAgo(invoice.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleDownload(invoice.id)} title="Download PDF">
                        <FileDown className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleEmailClick(invoice.id)} title="Email Invoice">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handlePrintClick(invoice)} title="Print Invoice">
                        <Printer className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Email Dialog */}
      <Dialog open={emailOpen} onOpenChange={setEmailOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Email Invoice</DialogTitle>
            <DialogDescription>Send the invoice PDF directly to a recipient's inbox.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSendEmail} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="recipientEmail">Recipient Email</Label>
              <Input
                id="recipientEmail"
                type="email"
                required
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="accounting@vendor.com"
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="ghost" onClick={() => setEmailOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={sending} className="bg-accent text-accent-foreground hover:bg-accent/90">
                {sending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Send Email
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Print View Dialog */}
      {printInvoice && (
        <Dialog open={printOpen} onOpenChange={setPrintOpen}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Print Invoice Preview</DialogTitle>
              <DialogDescription>Review the document before sending to printer.</DialogDescription>
            </DialogHeader>
            
            <div id="printable-invoice-area" className="border border-border p-6 rounded-xl space-y-4 bg-muted/20 text-sm">
              <div className="flex justify-between border-b border-border pb-4">
                <div>
                  <h3 className="font-heading text-lg font-bold text-foreground">INVOICE</h3>
                  <p className="text-xs text-muted-foreground">{printInvoice.invoiceNumber}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{new Date(printInvoice.createdAt).toLocaleDateString()}</p>
                  <p className="text-xs text-muted-foreground">Issue Date</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground block">Supplier / Vendor:</span>
                  <span className="font-bold text-foreground">{printInvoice.purchaseOrder.quotation.vendor.name}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">PO Reference:</span>
                  <span className="font-bold text-foreground">{printInvoice.purchaseOrder.poNumber}</span>
                </div>
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatINR(printInvoice.subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Tax (GST 18%)</span>
                  <span>{formatINR(printInvoice.tax)}</span>
                </div>
                <div className="flex justify-between font-bold text-foreground border-t border-border pt-2">
                  <span>Total Amount</span>
                  <span>{formatINR(printInvoice.total)}</span>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setPrintOpen(false)}>
                Close
              </Button>
              <Button type="button" onClick={handleTriggerPrint} className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Printer className="mr-2 h-4 w-4" /> Print
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
