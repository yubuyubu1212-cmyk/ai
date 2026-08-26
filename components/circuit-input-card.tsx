'use client'

import * as React from 'react'
import { ImageUp, Sparkles, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

type CircuitInputCardProps = {
  imageUrl: string | null
  fileName: string | null
  text: string
  error: string | null
  isAnalyzing: boolean
  onTextChange: (value: string) => void
  onOpenPicker: () => void
  onDropFile: (file: File) => void
  onRemoveImage: () => void
  onAnalyze: () => void
}

export function CircuitInputCard({
  imageUrl,
  fileName,
  text,
  error,
  isAnalyzing,
  onTextChange,
  onOpenPicker,
  onDropFile,
  onRemoveImage,
  onAnalyze,
}: CircuitInputCardProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const invalid = Boolean(error)

  function handleDrop(event: React.DragEvent) {
    event.preventDefault()
    setIsDragging(false)
    const file = event.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      onDropFile(file)
    }
  }

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <CardHeader className="gap-1 border-b border-border px-5 py-4 sm:px-6">
        <CardTitle className="text-base">회로 입력</CardTitle>
        <CardDescription>
          사진 또는 설명 중 하나만 입력해도 분석할 수 있습니다.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-5 px-5 py-5 sm:px-6 sm:py-6">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground">회로 사진</span>

          {imageUrl ? (
            <div className="rounded-lg border border-border bg-muted/40 p-3">
              <div className="overflow-hidden rounded-md border border-border bg-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl || '/placeholder.svg'}
                  alt="업로드한 회로 사진 미리보기"
                  className="mx-auto max-h-72 w-full object-contain"
                />
              </div>
              <div className="mt-3 flex items-center gap-2">
                <p className="min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground">
                  {fileName}
                </p>
                <Button variant="outline" size="sm" onClick={onOpenPicker}>
                  다른 이미지 선택
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={onRemoveImage}
                  aria-label="업로드한 이미지 제거"
                >
                  <X />
                </Button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenPicker}
              onDragOver={(event) => {
                event.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={cn(
                'flex min-h-40 w-full flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed px-4 py-8 text-center transition-colors outline-none',
                'border-border bg-muted/40 hover:border-primary/50 hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/40',
                isDragging && 'border-primary bg-accent',
                invalid && 'border-destructive/60 bg-destructive/5',
              )}
            >
              <span
                aria-hidden="true"
                className="mb-1 flex size-10 items-center justify-center rounded-full bg-card text-muted-foreground ring-1 ring-border"
              >
                <ImageUp className="size-5" />
              </span>
              <span className="text-sm font-medium text-foreground">
                회로 사진을 업로드해주세요
              </span>
              <span className="text-sm text-muted-foreground">
                클릭하여 이미지를 선택하거나 여기에 드래그하세요.
              </span>
              <span className="mt-1 font-mono text-xs text-muted-foreground">
                JPG, JPEG, PNG
              </span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3" aria-hidden="true">
          <span className="h-px flex-1 bg-border" />
          <span className="text-xs font-medium text-muted-foreground">또는</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <Field data-invalid={invalid || undefined}>
          <FieldLabel htmlFor="circuit-description">회로 설명</FieldLabel>
          <Textarea
            id="circuit-description"
            rows={6}
            value={text}
            onChange={(event) => onTextChange(event.target.value)}
            aria-invalid={invalid || undefined}
            placeholder={
              '회로에 대한 설명을 입력해주세요.\n예: 5V 전원에 220Ω 저항과 LED가 직렬로 연결된 회로'
            }
            className="min-h-36 p-3.5 text-sm leading-relaxed md:text-sm"
          />
          <FieldDescription>
            사진과 설명을 함께 입력하면 더 정확하게 분석할 수 있습니다.
          </FieldDescription>
          {error ? <FieldError>{error}</FieldError> : null}
        </Field>
      </CardContent>

      <CardFooter className="border-t border-border bg-muted/30 px-5 py-4 sm:px-6">
        <Button
          size="lg"
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className="h-11 w-full px-5 text-[15px] hover:bg-primary/90 sm:w-auto sm:min-w-52"
        >
          {isAnalyzing ? (
            <>
              <Spinner data-icon="inline-start" />
              분석 중...
            </>
          ) : (
            <>
              <Sparkles data-icon="inline-start" />
              회로 분석하기
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
