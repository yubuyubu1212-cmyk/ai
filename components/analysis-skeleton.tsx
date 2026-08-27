'use client'

import * as React from 'react'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'

const AI_MESSAGES = [
  '회로 이미지를 인식하고 있습니다...',
  '부품 위치와 기호를 파악하고 있습니다...',
  '각 부품의 역할을 분석하고 있습니다...',
  '신호 흐름 경로를 추적하고 있습니다...',
  '전체 동작 원리를 정리하고 있습니다...',
  '분석 결과를 구조화하고 있습니다...',
]

export function AnalysisSkeleton({ isRealAi = false }: { isRealAi?: boolean }) {
  const [messageIndex, setMessageIndex] = React.useState(0)

  React.useEffect(() => {
    if (!isRealAi) return
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % AI_MESSAGES.length)
    }, 1800)
    return () => clearInterval(interval)
  }, [isRealAi])

  const statusMessage = isRealAi
    ? AI_MESSAGES[messageIndex]
    : '회로를 분석하고 있습니다. 잠시만 기다려주세요.'

  return (
    <div className="flex flex-col gap-4" aria-busy="true">
      <div
        role="status"
        className="flex items-center gap-2.5 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3"
      >
        <Spinner className="size-4 text-primary" />
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-semibold text-foreground">
            {isRealAi ? 'Gemini 2.5 AI 분석 중' : '분석 중'}
          </p>
          <p
            className="text-xs text-muted-foreground transition-opacity duration-500"
            key={statusMessage}
          >
            {statusMessage}
          </p>
        </div>
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

      <Card className="gap-0 overflow-hidden py-0">
        <CardHeader className="border-b border-border px-5 py-4">
          <Skeleton className="h-4 w-28" />
        </CardHeader>
        <CardContent className="flex flex-col gap-2.5 px-5 py-5">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-[85%]" />
          <Skeleton className="h-3.5 w-[90%]" />
        </CardContent>
      </Card>
    </div>
  )
}
