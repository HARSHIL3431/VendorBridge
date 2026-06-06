interface PageHeaderProps {
  eyebrow?: string
  title: string
  accentWord?: string
  description?: string
  children?: React.ReactNode
}

export function PageHeader({
  eyebrow,
  title,
  accentWord,
  description,
  children,
}: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="mb-1 font-heading text-sm font-bold uppercase tracking-[0.18em] text-accent">
            {eyebrow}
          </p>
        )}
        <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground text-balance sm:text-4xl">
          {title}{' '}
          {accentWord && <span className="italic text-secondary">{accentWord}</span>}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {children && <div className="flex shrink-0 items-center gap-2">{children}</div>}
    </div>
  )
}
