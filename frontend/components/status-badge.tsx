import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const STYLES: Record<string, string> = {
  // Vendor
  ACTIVE: 'bg-secondary/15 text-secondary border-secondary/30',
  INACTIVE: 'bg-muted text-muted-foreground border-border',
  BLACKLISTED: 'bg-destructive/10 text-destructive border-destructive/30',
  // RFQ
  OPEN: 'bg-secondary/15 text-secondary border-secondary/30',
  CLOSED: 'bg-muted text-muted-foreground border-border',
  AWARDED: 'bg-accent/15 text-accent border-accent/30',
  // Approval
  APPROVED: 'bg-secondary/15 text-secondary border-secondary/30',
  REJECTED: 'bg-destructive/10 text-destructive border-destructive/30',
  PENDING: 'bg-[oklch(0.8_0.16_80/0.18)] text-[oklch(0.5_0.13_70)] border-[oklch(0.8_0.16_80/0.4)]',
  // PO
  ISSUED: 'bg-accent/15 text-accent border-accent/30',
  FULFILLED: 'bg-secondary/15 text-secondary border-secondary/30',
  CANCELLED: 'bg-destructive/10 text-destructive border-destructive/30',
  // Invoice
  PAID: 'bg-secondary/15 text-secondary border-secondary/30',
  OVERDUE: 'bg-destructive/10 text-destructive border-destructive/30',
}

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'rounded-full px-2.5 py-0.5 text-[0.7rem] font-bold uppercase tracking-wide',
        STYLES[status] ?? 'bg-muted text-muted-foreground border-border',
        className,
      )}
    >
      {status.replace('_', ' ')}
    </Badge>
  )
}
