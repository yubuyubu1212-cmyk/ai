'use client'

import * as React from 'react'

import { AnalysisEmpty } from '@/components/analysis-empty'
import { FailedState, NotCircuitState } from '@/components/analysis-error'
import { AnalysisResultView } from '@/components/analysis-result-view'
import { AnalysisSkeleton } from '@/components/analysis-skeleton'
import { CircuitInputCard } from '@/components/circuit-input-card'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  DEMO_SCENARIOS,
  getMockResult,
  type AnalysisResult,
  type DemoScenario,
} from '@/lib/mock-analysis'

import { useLocalStorage } from '@/lib/use-local-storage'

const STORAGE_KEY = 'circuit-analysis:last-result'

type Status = 'idle' | 'loading' | 'done' | 'not-circuit' | 'failed'

export function CircuitAnalyzer() {
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const [imageUrl, setImageUrl] = React.useState<string | null>(null)
  const [fileName, setFileName] = React.useState<string | null>(null)
  const [text, setText] = React.useState('')
  const [inputError, setInputError] = React.useState<string | null>(null)
  const [useRealAi, setUseRealAi] = React.useState(true)
  const [scenario, setScenario] = React.useState<DemoScenario>('success')
  const [status, setStatus] = React.useState<Status>('idle')
  const [savedResult, setSavedResult, isHydrated] = useLocalStorage<AnalysisResult | null>(
    STORAGE_KEY,
    null
  )
  const [result, setResult] = React.useState<AnalysisResult | null>(null)
  const [restored, setRestored] = React.useState(false)
  const [isAiResult, setIsAiResult] = React.useState(false)

  React.useEffect(() => {
    if (isHydrated && savedResult && status === 'idle' && !result) {
      if (Array.isArray(savedResult.parts)) {
        setResult(savedResult)
        setStatus('done')
        setRestored(true)
      }
    }
  }, [isHydrated, savedResult, status, result])

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  function applyFile(file: File) {
    setImageUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous)
      return URL.createObjectURL(file)
    })
    setFileName(file.name)
    setInputError(null)
  }

  function handleRemoveImage() {
    setImageUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous)
      return null
    })
    setFileName(null)
  }

  async function handleAnalyze() {
    if (!imageUrl && text.trim().length === 0) {
      setInputError('회로 사진을 업로드하거나 회로 설명을 입력해주세요.')
      return
    }

    setInputError(null)
    setRestored(false)
    setStatus('loading')

    if (useRealAi) {
      try {
        let imageBase64: string | null = null
        if (imageUrl) {
          const response = await fetch(imageUrl)
          const blob = await response.blob()
          imageBase64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result as string)
            reader.onerror = reject
            reader.readAsDataURL(blob)
          })
        }

        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: imageBase64,
            text,
          }),
        })

        const data = await res.json()

        if (!res.ok) {
          if (data.errorCode === 'NOT_CIRCUIT_IMAGE') {
            setResult(null)
            setStatus('not-circuit')
            setSavedResult(null)
            return
          }
          setResult(null)
          setStatus('failed')
          setSavedResult(null)
          return
        }

        if (data.status === 'success' && data.data) {
          setResult(data.data)
          setStatus('done')
          setIsAiResult(true)
          setSavedResult(data.data)
        } else {
          setResult(null)
          setStatus('failed')
          setIsAiResult(false)
          setSavedResult(null)
        }
      } catch (err) {
        console.error('Real AI call error:', err)
        setResult(null)
        setStatus('failed')
        setIsAiResult(false)
        setSavedResult(null)
      }
      return
    }

    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      if (scenario === 'not-circuit') {
        setResult(null)
        setStatus('not-circuit')
        setSavedResult(null)
        return
      }

      if (scenario === 'failed') {
        setResult(null)
        setStatus('failed')
        setSavedResult(null)
        return
      }

      const next = getMockResult(scenario)
      setResult(next)
      setStatus('done')
      setIsAiResult(false)
      setSavedResult(next)
    }, 1400)
  }

  return (
    <div className="flex flex-col gap-8">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) applyFile(file)
          event.target.value = ''
        }}
      />

      <CircuitInputCard
        imageUrl={imageUrl}
        fileName={fileName}
        text={text}
        error={inputError}
        isAnalyzing={status === 'loading'}
        onTextChange={setText}
        onOpenPicker={() => fileInputRef.current?.click()}
        onDropFile={applyFile}
        onRemoveImage={handleRemoveImage}
        onAnalyze={handleAnalyze}
      />

      <section className="flex flex-col gap-3 rounded-lg border border-dashed border-border bg-muted/40 px-4 py-3.5">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex flex-col gap-0.5">
            <p className="text-xs font-bold tracking-wide text-foreground uppercase">
              분석 엔진 모드 설정
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Gemini 2.5 Flash 실시간 AI 분석과 모의 데모 상태 중 선택할 수 있습니다.
            </p>
          </div>
          <ToggleGroup
            value={[useRealAi ? 'real' : 'demo']}
            onValueChange={(val) => {
              if (val[0]) setUseRealAi(val[0] === 'real')
            }}
            variant="outline"
            size="sm"
            aria-label="분석 엔진 선택"
          >
            <ToggleGroupItem
              value="real"
              className="bg-card aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground font-medium"
            >
              ✨ Gemini 2.5 AI 실시간 분석
            </ToggleGroupItem>
            <ToggleGroupItem
              value="demo"
              className="bg-card aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground font-medium"
            >
              🛠️ 모의 데모 모드
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {!useRealAi && (
          <div className="flex flex-col gap-2 pt-2 border-t border-border/60">
            <p className="text-xs font-medium text-foreground">모의 시나리오 선택:</p>
            <ToggleGroup
              value={[scenario]}
              onValueChange={(value) => {
                const next = value[0] as DemoScenario | undefined
                if (next) setScenario(next)
              }}
              variant="outline"
              size="sm"
              className="flex-wrap"
              aria-label="데모 상태 선택"
            >
              {DEMO_SCENARIOS.map((option) => (
                <ToggleGroupItem
                  key={option.value}
                  value={option.value}
                  className="bg-card aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground"
                >
                  {option.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        )}
      </section>

      <section className="flex flex-col gap-3" aria-live="polite">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            분석 결과
          </h2>
          {restored ? (
            <p className="text-xs text-muted-foreground">
              이 브라우저에 저장된 마지막 분석 결과입니다.
            </p>
          ) : null}
        </div>

        {status === 'idle' ? <AnalysisEmpty /> : null}
        {status === 'loading' ? <AnalysisSkeleton isRealAi={useRealAi} /> : null}
        {status === 'not-circuit' ? (
          <NotCircuitState onPickImage={() => fileInputRef.current?.click()} />
        ) : null}
        {status === 'failed' ? <FailedState onRetry={handleAnalyze} /> : null}
        {status === 'done' && result ? <AnalysisResultView result={result} isAiResult={isAiResult} /> : null}
      </section>
    </div>
  )
}
