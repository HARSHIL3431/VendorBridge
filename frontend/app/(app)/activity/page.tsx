'use client'

import useSWR from 'swr'
import { Activity as ActivityIcon, FileText, Send, CircleCheck, CircleX, Store, Truck, FilePlus2, Mail, User } from 'lucide-react'
import { db } from '@/lib/api'
import { PageHeader } from '@/components/page-header'
import { LoadingState, EmptyState } from '@/components/states'
import { timeAgo } from '@/lib/helpers'
import type { ActivityType } from '@/lib/types'

const ACTIVITY_ICON: Record<ActivityType, React.ElementType> = {
  RFQ_CREATED: FileText,
  QUOTATION_SUBMITTED: Send,
  QUOTATION_APPROVED: CircleCheck,
  QUOTATION_REJECTED: CircleX,
  VENDOR_CREATED: Store,
  PO_GENERATED: Truck,
  INVOICE_GENERATED: FilePlus2,
  INVOICE_SENT: Mail,
}

export default function ActivityPage() {
  const { data: activities } = useSWR('activities', () => db.listActivities())

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        eyebrow="System Logs"
        title="Activity"
        accentWord="history"
        description="A complete timeline of all actions performed in VendorBridge."
      />

      {!activities ? (
        <LoadingState label="Loading activities…" />
      ) : activities.length === 0 ? (
        <EmptyState
          icon={ActivityIcon}
          title="No activity yet"
          description="System events and actions will appear here."
        />
      ) : (
        <div className="relative border-l border-border ml-4 mt-8 space-y-8 pb-8">
          {activities.map((activity) => {
            const Icon = ACTIVITY_ICON[activity.type as ActivityType] ?? FileText
            
            return (
              <div key={activity.id} className="relative flex gap-6 pl-8">
                <div className="absolute -left-[20px] flex h-10 w-10 items-center justify-center rounded-full border-4 border-background bg-muted text-accent">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <p className="font-medium text-foreground">{activity.message}</p>
                  <div className="mt-3 flex items-center gap-4 text-xs font-semibold text-muted-foreground">
                    <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
                      <User className="h-3 w-3" />
                      {activity.actor}
                    </span>
                    <span>{timeAgo(activity.createdAt)}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
