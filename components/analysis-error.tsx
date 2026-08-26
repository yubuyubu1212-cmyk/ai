'use client'

import { ImageOff, RefreshCw, TriangleAlert } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export function NotCircuitState({ onPickImage }: { onPickImage: () => void }) {
  return (
    <Card className="border border-warning-border bg-warning-surface py-0 ring-0">
      <CardContent className="flex flex-col items-start gap-4 px-5 py-6 sm:flex-row sm:items-center">
        <span
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-card text-warning-foreground ring-1 ring-warning-border"
        >
          <ImageOff className="size-5" />
        </span>
        <div className="flex flex-1 flex-col gap-1">
          <p className="text-sm font-bold text-warning-foreground">
            회로도로 인식되지 않는 이미지입니다.
          </p>
          <p className="text-sm leading-relaxed text-warning-foreground/80">
            회로 사진이 맞는지 확인해주세요. 회로 전체가 잘 보이는 사진을 올리면 더
            정확하게 분석할 수 있습니다.
          </p>
        </div>
        <Button variant="outline" onClick={onPickImage} className="shrink-0">
          다른 이미지 선택
        </Button>
      </CardContent>
    </Card>
  )
}

export function FailedState({ onRetry }: { onRetry: () => void }) {
  return (
    <Card className="border border-destructive/25 bg-destructive/5 py-0 ring-0">
      <CardContent className="flex flex-col items-start gap-4 px-5 py-6 sm:flex-row sm:items-center">
        <span
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-card text-destructive ring-1 ring-destructive/25"
        >
          <TriangleAlert className="size-5" />
        </span>
        <div className="flex flex-1 flex-col gap-1">
          <p className="text-sm font-bold text-destructive">
            분석에 실패했습니다.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            잠시 후 다시 시도해주세요. 입력한 사진과 설명은 그대로 유지됩니다.
          </p>
        </div>
        <Button variant="outline" onClick={onRetry} className="shrink-0">
          <RefreshCw data-icon="inline-start" />
          다시 시도
        </Button>
      </CardContent>
    </Card>
  )
}
