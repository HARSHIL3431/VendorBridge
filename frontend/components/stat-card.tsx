import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string | number
  icon: React.ElementType
  tone?: 'orange' | 'gold' | 'forest' | 'olive' | 'rust'
  hint?: string
}

const TONES: Record<string, string> = {
  orange: 'bg-accent/10 text-accent',
  gold: 'bg-[oklch(0.8_0.16_80/0.16)] text-[oklch(0.5_0.13_70)]',
  forest: 'bg-primary/10 text-primary',
  olive: 'bg-secondary/15 text-secondary',
  rust: 'bg-[oklch(0.45_0.13_40/0.12)] text-[oklch(0.45_0.13_40)]',
}

export function StatCard({ label, value, icon: Icon, tone = 'forest', hint }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-muted-foreground">{label}</p>
          <p className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-foreground">
            {value}
          </p>
        </div>
        <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl', TONES[tone])}>
          <Icon className="h-5 w-5" strokeWidth={2.25} />
        </div>
      </div>
      {hint && <p className="mt-3 text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}
