'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, Store } from 'lucide-react'
import Link from 'next/link'
import { db } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function NewVendorPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gstNumber: '',
    category: '',
    status: 'ACTIVE' as const
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSubmitting(true)
    try {
      await db.createVendor(formData)
      toast.success('Vendor added successfully')
      router.push('/vendors')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add vendor')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/vendors" className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to vendors
      </Link>
      
      <PageHeader
        title="Add new"
        accentWord="vendor"
        description="Register a new supplier in the system to allow them to bid on RFQs."
      />

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3 border-b border-border pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Store className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-bold text-foreground">Vendor Details</h2>
            <p className="text-xs text-muted-foreground">Enter the official details of the supplier.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Company Name</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="e.g. ABC Tech Ltd"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={v => setFormData({...formData, category: v ?? ''})}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                  <SelectItem value="Hardware">Hardware</SelectItem>
                  <SelectItem value="Services">Services</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                placeholder="contact@company.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                required
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                placeholder="+91 9876543210"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="gst">GST Number</Label>
            <Input
              id="gst"
              required
              value={formData.gstNumber}
              onChange={e => setFormData({...formData, gstNumber: e.target.value})}
              placeholder="e.g. 22AAAAA0000A1Z5"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="ghost" render={<Link href="/vendors" />}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="bg-accent text-accent-foreground hover:bg-accent/90">
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Vendor
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
