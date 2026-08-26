import { AppHeader } from '@/components/app-header'
import { CircuitAnalyzer } from '@/components/circuit-analyzer'

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <AppHeader />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="flex max-w-2xl flex-col gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
            처음 보는 회로도,
            <br />
            빠르게 이해하기
          </h1>
          <p className="text-[15px] leading-relaxed text-pretty text-muted-foreground">
            회로 사진이나 설명을 입력하면 주요 부품의 역할, 신호 흐름, 전체 동작 원리를
            정리해드립니다. 전자공학을 처음 배우는 분도 쉽게 이해할 수 있도록 설명합니다.
          </p>
        </div>

        <div className="mt-8 lg:mt-10">
          <CircuitAnalyzer />
        </div>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-xs leading-relaxed text-muted-foreground">
            분석 결과는 참고용이며, 실제 회로 제작이나 실험 전에는 반드시 데이터시트와
            전문가의 확인을 거쳐주세요.
          </p>
        </div>
      </footer>
    </div>
  )
}
