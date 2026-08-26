import { CircuitBoard } from 'lucide-react'

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center gap-2.5 px-4 sm:px-6 lg:px-8">
        <span
          aria-hidden="true"
          className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground"
        >
          <CircuitBoard className="size-4.5" />
        </span>
        <span className="text-[15px] font-bold tracking-tight text-foreground">
          회로 분석 AI
        </span>
      </div>
    </header>
  )
}
