import type { LucideIcon } from 'lucide-react'
import {
  BookOpen,
  CircleCheck,
  Cpu,
  FileText,
  Info,
  TriangleAlert,
  Waves,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { AnalysisResult } from '@/lib/mock-analysis'

function SectionCard({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon
  title: string
  children: React.ReactNode
}) {
  return (
    <Card className="gap-0 overflow-hidden py-0">
      <CardHeader className="border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Icon aria-hidden="true" className="size-4 text-primary" />
          <CardTitle className="text-sm font-bold">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-5 py-5">{children}</CardContent>
    </Card>
  )
}

export function AnalysisResultView({ result }: { result: AnalysisResult }) {
  const { summary, summaryHighlight, parts, flow, principle, cautions, blurry } = result

  const summaryLead =
    summary && summaryHighlight && summary.includes(summaryHighlight)
      ? summary.slice(0, summary.indexOf(summaryHighlight))
      : summary

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2.5 rounded-lg border border-border bg-success-surface px-4 py-3">
        <CircleCheck aria-hidden="true" className="size-4 shrink-0 text-success" />
        <p className="text-sm font-medium text-foreground">
          분석이 완료되었습니다.
        </p>
      </div>

      {blurry ? (
        <div className="flex items-start gap-2.5 rounded-lg border border-warning-border bg-warning-surface px-4 py-3">
          <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-warning" />
          <p className="text-sm leading-relaxed text-warning-foreground">
            이미지가 흐려 일부 부품은 정확히 식별되지 않았습니다. 확인된 정보만으로
            분석한 결과입니다.
          </p>
        </div>
      ) : null}

      <SectionCard icon={FileText} title="회로 요약">
        <p className="text-[15px] leading-relaxed text-foreground">
          {summaryLead}
          {summaryHighlight && summaryLead !== summary ? (
            <span className="font-medium">{summaryHighlight}</span>
          ) : null}
        </p>
      </SectionCard>

      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2 px-1">
          <Cpu aria-hidden="true" className="size-4 text-primary" />
          <h2 className="text-sm font-bold text-foreground">주요 부품</h2>
          <span className="text-xs text-muted-foreground">
            <span className="font-mono">{parts.length}</span>개 확인
          </span>
        </div>

        <ul className="grid gap-3 sm:grid-cols-2">
          {parts.map((part) => (
            <li key={part.ref} className="flex">
              <Card size="sm" className="w-full gap-3">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-primary/10 px-1.5 py-0.5 font-mono text-xs font-medium text-primary">
                      {part.ref}
                    </span>
                    <CardTitle className="text-sm font-bold">{part.name}</CardTitle>
                    <Badge variant="secondary" className="ml-auto font-normal">
                      {part.tag}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-2.5">
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs font-medium text-muted-foreground">
                      일반적인 역할
                    </p>
                    <p className="text-sm leading-relaxed text-foreground">
                      {part.generalRole}
                    </p>
                  </div>
                  <div className="flex flex-col gap-0.5 rounded-md bg-accent/70 px-3 py-2">
                    <p className="text-xs font-medium text-accent-foreground">
                      이 회로에서의 역할
                    </p>
                    <p className="text-sm leading-relaxed text-foreground">
                      {part.circuitRole}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      <SectionCard icon={Waves} title="신호 흐름">
        {flow ? (
          <ol className="flex flex-col md:flex-row md:gap-2">
            {flow.map((step, index) => (
              <li
                key={step.title}
                className="relative flex gap-3 pb-5 last:pb-0 md:flex-1 md:flex-col md:gap-2 md:pb-0"
              >
                {index < flow.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="absolute top-8 left-[13px] h-[calc(100%-2rem)] w-px bg-border md:top-[13px] md:left-8 md:h-px md:w-[calc(100%-2rem)]"
                  />
                ) : null}
                <span className="relative z-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-accent font-mono text-xs font-medium text-accent-foreground ring-1 ring-primary/20">
                  {index + 1}
                </span>
                <div className="flex flex-col gap-0.5 md:pr-4">
                  <p className="text-sm font-medium text-foreground">{step.title}</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {step.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm leading-relaxed text-muted-foreground">
            입력된 정보만으로는 신호 흐름을 확인하기 어렵습니다. 회로 전체가 보이는
            사진이나 연결 순서에 대한 설명을 추가해주세요.
          </p>
        )}
      </SectionCard>

      {principle ? (
        <SectionCard icon={BookOpen} title="전체 동작 원리">
          <div className="flex flex-col gap-3">
            {principle.map((paragraph) => (
              <p
                key={paragraph.slice(0, 12)}
                className="text-sm leading-relaxed text-foreground"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </SectionCard>
      ) : null}

      {cautions.length > 0 ? (
        <Card className="gap-0 overflow-hidden border border-warning-border bg-warning-surface py-0 ring-0">
          <CardHeader className="border-b border-warning-border px-5 py-3.5">
            <div className="flex items-center gap-2">
              <TriangleAlert aria-hidden="true" className="size-4 text-warning" />
              <CardTitle className="text-sm font-bold text-warning-foreground">
                확인이 필요한 부분
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-5 py-4">
            <ul className="flex flex-col gap-2">
              {cautions.map((caution) => (
                <li key={caution} className="flex gap-2.5">
                  <span
                    aria-hidden="true"
                    className="mt-[7px] size-1.5 shrink-0 rounded-full bg-warning"
                  />
                  <p className="text-sm leading-relaxed text-warning-foreground">
                    {caution}
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
