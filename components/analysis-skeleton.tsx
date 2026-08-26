import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'

export function AnalysisSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-busy="true">
      <div
        role="status"
        className="flex items-center gap-2.5 rounded-lg border border-border bg-accent/60 px-4 py-3"
      >
        <Spinner className="size-4 text-primary" />
        <p className="text-sm font-medium text-foreground">
          회로를 분석하고 있습니다. 잠시만 기다려주세요.
        </p>
      </div>

      <Card className="gap-0 overflow-hidden py-0">
        <CardHeader className="border-b border-border px-5 py-4">
          <Skeleton className="h-4 w-24" />
        </CardHeader>
        <CardContent className="flex flex-col gap-2.5 px-5 py-5">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-[92%]" />
          <Skeleton className="h-3.5 w-[70%]" />
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        {[0, 1, 2, 3].map((index) => (
          <Card key={index} size="sm" className="gap-3">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-9" />
                <Skeleton className="h-3.5 w-16" />
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-[80%]" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="gap-0 overflow-hidden py-0">
        <CardHeader className="border-b border-border px-5 py-4">
          <Skeleton className="h-4 w-20" />
        </CardHeader>
        <CardContent className="flex flex-col gap-4 px-5 py-5 md:flex-row">
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="flex flex-1 items-center gap-3 md:flex-col md:items-start">
              <Skeleton className="size-7 shrink-0 rounded-full" />
              <div className="flex flex-1 flex-col gap-1.5 md:w-full">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
