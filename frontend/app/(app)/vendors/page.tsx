'use client'

import { useState } from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import { Plus, Store, Mail, Phone, Hash } from 'lucide-react'
import { db } from '@/lib/api'
import { PageHeader } from '@/components/page-header'
import { StatusBadge } from '@/components/status-badge'
import { LoadingState, EmptyState } from '@/components/states'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function VendorsPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('ALL')
  const [status, setStatus] = useState('ALL')

  const { data: vendors, error, mutate } = useSWR(
    ['vendors', search, category, status],
    () => db.listVendors({ search, category, status })
  )

  const isFiltered = search !== '' || category !== 'ALL' || status !== 'ALL'

  return (
    <div>
      <PageHeader
        eyebrow="Directory"
        title="Manage your"
        accentWord="vendors"
        description="View and manage all registered suppliers and vendors in your network."
      >
        <Button
          render={<Link href="/vendors/new" />}
          className="bg-accent font-bold text-accent-foreground hover:bg-accent/90"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Vendor
        </Button>
      </PageHeader>

      {/* Search and Filters Bar */}
      <div className="grid gap-4 md:grid-cols-3 mb-6 bg-card border border-border p-4 rounded-xl">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Search Vendors</label>
          <Input
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 bg-background"
          />
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Category</label>
          <Select value={category} onValueChange={(v) => setCategory(v ?? 'ALL')}>
            <SelectTrigger className="h-10 bg-background">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Categories</SelectItem>
              <SelectItem value="Electronics">Electronics</SelectItem>
              <SelectItem value="Office Supplies">Office Supplies</SelectItem>
              <SelectItem value="Hardware">Hardware</SelectItem>
              <SelectItem value="Services">Services</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Status</label>
          <Select value={status} onValueChange={(v) => setStatus(v ?? 'ALL')}>
            <SelectTrigger className="h-10 bg-background">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
              <SelectItem value="BLACKLISTED">Blacklisted</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {!vendors ? (
        <LoadingState label="Loading vendors…" />
      ) : vendors.length === 0 ? (
        isFiltered ? (
          <EmptyState
            icon={Store}
            title="No matching vendors found"
            description="Try adjusting your search query or filter selections."
            action={
              <Button onClick={() => { setSearch(''); setCategory('ALL'); setStatus('ALL'); }} className="mt-4">
                Clear Filters
              </Button>
            }
          />
        ) : (
          <EmptyState
            icon={Store}
            title="No vendors found"
            description="Get started by adding your first vendor to the directory."
            action={
              <Button render={<Link href="/vendors/new" />} className="mt-4">
                <Plus className="mr-2 h-4 w-4" /> Add Vendor
              </Button>
            }
          />
        )
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>GST Number</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendors.map((vendor) => (
                <TableRow key={vendor.id} className="hover:bg-muted/20">
                  <TableCell className="font-semibold text-foreground">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Store className="h-4 w-4" />
                      </div>
                      {vendor.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5"><Mail className="h-3 w-3"/>{vendor.email}</span>
                      <span className="flex items-center gap-1.5"><Phone className="h-3 w-3"/>{vendor.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-md bg-secondary/10 px-2 py-1 text-xs font-medium text-secondary-foreground ring-1 ring-inset ring-secondary/20">
                      {vendor.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Hash className="h-3 w-3"/>{vendor.gstNumber}</span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={vendor.status} />
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
