'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import { ArrowLeft, Loader2, FileText, Upload, Users, Paperclip } from 'lucide-react'
import Link from 'next/link'
import { db } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'

export default function NewRfqPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { data: vendors } = useSWR('vendors-list', () => db.listVendors())
  const [submitting, setSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    quantity: 1,
    deadline: ''
  })
  const [assignedVendors, setAssignedVendors] = useState<string[]>([])
  const [fileName, setFileName] = useState('')

  const handleVendorToggle = (vendorId: string) => {
    setAssignedVendors(prev =>
      prev.includes(vendorId)
        ? prev.filter(id => id !== vendorId)
        : [...prev, vendorId]
    )
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSubmitting(true)
    try {
      await db.createRfq(formData)
      toast.success('RFQ created and assigned successfully!')
      router.push('/rfqs')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create RFQ')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/rfqs" className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to RFQs
      </Link>
      
      <PageHeader
        title="Create new"
        accentWord="RFQ"
        description="Draft a Request for Quotation to receive bids from registered vendors."
      />

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3 border-b border-border pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-bold text-foreground">RFQ Details</h2>
            <p className="text-xs text-muted-foreground">Specify the procurement requirements.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              required
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              placeholder="e.g. Laptop Procurement 2026"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              required
              rows={4}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Detailed specifications and requirements..."
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                required
                value={formData.quantity}
                onChange={e => setFormData({...formData, quantity: parseInt(e.target.value) || 1})}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="deadline">Submission Deadline</Label>
              <Input
                id="deadline"
                type="date"
                required
                value={formData.deadline}
                onChange={e => setFormData({...formData, deadline: e.target.value})}
              />
            </div>
          </div>

          {/* Attachments Section */}
          <div className="space-y-2">
            <Label>Specifications Document (Attachment)</Label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-accent">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground/75 mt-1">PDF, DOCX, or XLSX (Max 10MB)</p>
                </div>
                <input type="file" className="hidden" accept=".pdf,.docx,.xlsx" onChange={handleFileChange} />
              </label>
            </div>
            {fileName && (
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground bg-muted p-2 rounded-lg mt-2 w-fit">
                <Paperclip className="h-3.5 w-3.5 text-accent" />
                {fileName}
              </div>
            )}
          </div>

          {/* Vendor Assignment Section */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" /> Assign Vendors
            </Label>
            <p className="text-xs text-muted-foreground">Select the vendors who should be notified to bid on this RFQ.</p>
            <div className="grid gap-3 md:grid-cols-2 max-h-[150px] overflow-y-auto border border-border rounded-xl p-3 bg-muted/20">
              {vendors && vendors.length > 0 ? (
                vendors.map(v => (
                  <div key={v.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`vendor-${v.id}`}
                      checked={assignedVendors.includes(v.id)}
                      onCheckedChange={() => handleVendorToggle(v.id)}
                    />
                    <label
                      htmlFor={`vendor-${v.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {v.name} <span className="text-xs text-muted-foreground">({v.category})</span>
                    </label>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground col-span-2">No registered vendors available.</p>
              )}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="ghost" render={<Link href="/rfqs" />}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="bg-accent text-accent-foreground hover:bg-accent/90">
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Create RFQ
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
