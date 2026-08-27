import { NextResponse } from 'next/server'

// 한국어 프롬프트 - 전자공학 전문가 + 초보자 친화적 구조화 분석
const buildSystemPrompt = (hasImage: boolean, hasText: boolean): string => {
  const inputContext = hasImage && hasText
    ? '회로 사진과 회로 설명 텍스트를 함께 참고해서'
    : hasImage
    ? '회로 사진을 분석해서'
    : '회로 설명 텍스트를 분석해서'

  return `너는 세계 최고 수준의 전자공학 교수야. 전자공학 초보자(대학교 1~2학년 수준)가 처음 보는 회로를 완전히 이해할 수 있도록 친절하고 명확하게 설명해줘.

사용자가 제출한 입력을 ${inputContext} 반드시 아래 JSON 형식으로만 응답해줘.

[중요 규칙]
1. 절대로 JSON 이외의 텍스트, 마크다운 코드블록(\`\`\`), 부연 설명을 출력하지 마.
2. 회로와 전혀 무관한 일반 사진(풍경, 인물, 음식, 동물 등)인 경우:
   {"isNotCircuit": true}
3. 회로 관련 입력이라면 아래 전체 JSON 스키마를 완전히 채워서 반환해.

[출력 JSON 스키마]
{
  "summary": "이 회로가 무엇을 하는 회로인지 2~3문장으로 전체 설명. 핵심 부품과 목적을 포함해.",
  "summaryHighlight": "summary에서 가장 핵심이 되는 한 문장만 그대로 발췌해. 반드시 summary의 일부여야 해.",
  "parts": [
    {
      "ref": "회로 기호 (R1, D1, C1, U1 등. 불명확하면 '부품1'처럼 순서로 표기)",
      "name": "부품 한국어 명칭 (저항, LED, 커패시터, 트랜지스터, IC, 콘덴서 등)",
      "tag": "이 부품의 핵심 기능 2~4글자 (예: 전류 제한, 빛 출력, 전압 안정화, 신호 처리)",
      "generalRole": "이 부품이 일반적으로 전자 회로에서 담당하는 역할을 초보자가 이해하기 쉽게 1~2문장으로 설명.",
      "circuitRole": "이 특정 회로에서 이 부품이 어떤 역할을 하는지 구체적으로 1~2문장으로 설명."
    }
  ],
  "flow": [
    {
      "title": "신호 흐름 단계 제목 (예: 전원 입력, 저항 통과, LED 점등)",
      "detail": "이 단계에서 무슨 일이 일어나는지 1문장으로 설명"
    }
  ],
  "principle": [
    "전체 동작 원리를 설명하는 첫 번째 문단. 전원부터 출력까지 순서대로 서술.",
    "회로의 의미와 설계 의도를 설명하는 두 번째 문단. 왜 이런 설계인지, 어떤 효과가 있는지."
  ],
  "cautions": [
    "사진 해상도나 가려진 부분 때문에 정확히 파악 못한 내용",
    "실제 제작/실험 시 주의해야 할 사항",
    "AI가 추정한 값이 실제와 다를 수 있는 부분"
  ],
  "blurry": false
}

[추가 지침]
- parts 배열: 회로에서 보이는 주요 부품을 모두 포함 (최소 2개, 최대 8개)
- flow 배열: 신호/전류 흐름을 순서대로 3~6단계로 나눠서 표현
- principle 배열: 반드시 2개 이상의 문단으로 구성
- cautions 배열: 2~4개 항목으로 구성
- blurry: 이미지가 흐리거나 일부 부품이 식별 불가능하면 true
- 모든 텍스트는 반드시 한국어로 작성
- 숫자 값(저항값 Ω, 커패시터 용량 μF, 전압 V)이 명확히 보이면 반드시 포함`
}

export async function POST(request: Request) {
  const startTime = Date.now()

  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      console.error('[analyze] GEMINI_API_KEY not set')
      return NextResponse.json(
        {
          status: 'error',
          errorCode: 'MISSING_API_KEY',
          message: 'GEMINI_API_KEY가 설정되지 않았습니다. .env 파일을 확인해주세요.',
        },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { image, text } = body as { image?: string | null; text?: string }

    const hasImage = Boolean(image && image.startsWith('data:image/'))
    const hasText = Boolean(text && text.trim().length > 0)

    if (!hasImage && !hasText) {
      return NextResponse.json(
        {
          status: 'error',
          errorCode: 'EMPTY_INPUT',
          message: '회로 사진을 업로드하거나 회로 설명을 입력해주세요.',
        },
        { status: 400 }
      )
    }

    console.log(`[analyze] Request: hasImage=${hasImage}, hasText=${hasText}`)

    const systemPrompt = buildSystemPrompt(hasImage, hasText)
    const contentsParts: Array<Record<string, unknown>> = []

    // 텍스트 파트 구성
    let promptText = systemPrompt
    if (hasText && text) {
      promptText += `\n\n[사용자가 입력한 회로 설명]:\n${text.trim()}`
    }
    contentsParts.push({ text: promptText })

    // 이미지 파트 구성 (멀티모달)
    if (hasImage && image) {
      const matches = image.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/)
      if (matches && matches.length === 3) {
        const mimeType = matches[1]
        const base64Data = matches[2]
        contentsParts.push({
          inline_data: {
            mime_type: mimeType,
            data: base64Data,
          },
        })
        console.log(`[analyze] Image attached: mimeType=${mimeType}, size=${Math.round(base64Data.length / 1024)}KB`)
      }
    }

    // Gemini 2.5 Flash API 호출 (JSON 모드)
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`

    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: contentsParts }],
        generationConfig: {
          response_mime_type: 'application/json',
          temperature: 0.15,
          maxOutputTokens: 4096,
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
        ],
      }),
    })

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text()
      console.error(`[analyze] Gemini API error ${geminiResponse.status}:`, errorText)

      // 할당량 초과 처리
      if (geminiResponse.status === 429) {
        return NextResponse.json(
          {
            status: 'error',
            errorCode: 'RATE_LIMIT',
            message: 'AI 서비스 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.',
          },
          { status: 429 }
        )
      }

      return NextResponse.json(
        {
          status: 'error',
          errorCode: 'ANALYSIS_FAILED',
          message: 'Gemini AI 분석에 실패했습니다. 잠시 후 다시 시도해주세요.',
        },
        { status: 500 }
      )
    }

    const geminiData = await geminiResponse.json()
    const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text

    if (!rawText) {
      console.error('[analyze] Empty response from Gemini:', JSON.stringify(geminiData))
      return NextResponse.json(
        {
          status: 'error',
          errorCode: 'ANALYSIS_FAILED',
          message: 'AI 응답이 비어있습니다. 다시 시도해주세요.',
        },
        { status: 500 }
      )
    }

    // JSON 파싱 (마크다운 코드블록 등 방어적 제거)
    let parsedResult: Record<string, unknown>
    try {
      const cleanedText = rawText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim()
      parsedResult = JSON.parse(cleanedText)
    } catch (parseError) {
      console.error('[analyze] JSON parse failed. Raw text:', rawText.slice(0, 500))
      console.error('[analyze] Parse error:', parseError)
      return NextResponse.json(
        {
          status: 'error',
          errorCode: 'ANALYSIS_FAILED',
          message: 'AI 응답 데이터를 처리하는 중 오류가 발생했습니다. 다시 시도해주세요.',
        },
        { status: 500 }
      )
    }

    // 비회로 이미지 판별
    if (parsedResult.isNotCircuit === true) {
      console.log('[analyze] Not a circuit image detected')
      return NextResponse.json(
        {
          status: 'error',
          errorCode: 'NOT_CIRCUIT_IMAGE',
          message: '업로드한 이미지에서 회로를 확인하지 못했습니다.',
          subMessage: '회로도 또는 회로 기판이 보이는 사진을 다시 업로드해주세요.',
        },
        { status: 400 }
      )
    }

    // 필수 필드 검증 및 기본값 보정
    const result = {
      summary: typeof parsedResult.summary === 'string' ? parsedResult.summary : '회로 분석이 완료되었습니다.',
      summaryHighlight: typeof parsedResult.summaryHighlight === 'string' ? parsedResult.summaryHighlight : null,
      parts: Array.isArray(parsedResult.parts) ? parsedResult.parts : [],
      flow: Array.isArray(parsedResult.flow) ? parsedResult.flow : null,
      principle: Array.isArray(parsedResult.principle) ? parsedResult.principle : null,
      cautions: Array.isArray(parsedResult.cautions) ? parsedResult.cautions : [],
      blurry: parsedResult.blurry === true,
    }

    const elapsed = Date.now() - startTime
    console.log(`[analyze] Success in ${elapsed}ms. Parts: ${result.parts.length}, Flow steps: ${result.flow?.length ?? 0}`)

    return NextResponse.json({ status: 'success', data: result })
  } catch (error) {
    const elapsed = Date.now() - startTime
    console.error(`[analyze] Unhandled error after ${elapsed}ms:`, error)
    return NextResponse.json(
      {
        status: 'error',
        errorCode: 'SERVER_ERROR',
        message: '서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      },
      { status: 500 }
    )
  }
}
