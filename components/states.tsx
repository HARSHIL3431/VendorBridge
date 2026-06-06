import { Loader2 } from 'lucide-react'

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card/50 py-20 text-muted-foreground">
      <Loader2 className="h-6 w-6 animate-spin text-accent" />
      <p className="text-sm font-medium">{label}</p>
    </div>
  )
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ElementType
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
      <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="font-heading text-lg font-bold text-foreground">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-3">{action}</div>}
    </div>
  )
}

export function RestrictedState() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-destructive/30 bg-destructive/5 px-6 py-16 text-center">
      <h3 className="font-heading text-lg font-bold text-destructive">Access restricted</h3>
      <p className="max-w-sm text-sm text-muted-foreground">
        Your role doesn&apos;t have permission to view this section.
      </p>
    </div>
  )
}
