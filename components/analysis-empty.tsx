import { CircuitBoard } from 'lucide-react'

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

export function AnalysisEmpty() {
  return (
    <Empty className="rounded-xl border border-dashed border-border bg-card/50 py-10">
      <EmptyHeader>
        <EmptyMedia
          variant="icon"
          className="size-11 rounded-full bg-accent text-primary [&_svg:not([class*='size-'])]:size-5"
        >
          <CircuitBoard />
        </EmptyMedia>
        <EmptyTitle className="text-sm">분석 결과가 여기에 표시됩니다.</EmptyTitle>
        <EmptyDescription>
          회로 사진이나 설명을 입력하고 분석을 시작해보세요.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
