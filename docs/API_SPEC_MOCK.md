# 회로 분석 AI API Mock 스키마 정의서 (API Specification)

> **문서 정보**
> - **프로젝트명**: 회로 분석 AI (Circuit Analysis AI) - 프론트엔드 MVP
> - **기반 문서**: [PRD.md](file:///c:/ai/PRD.md), [DEVELOPMENT_PLAN.md](file:///c:/ai/docs/DEVELOPMENT_PLAN.md)
> - **작성일**: 2026-08-27
> - **관리 경로**: [`docs/API_SPEC_MOCK.md`](file:///c:/ai/docs/API_SPEC_MOCK.md)

---

## 1. 개요

본 문서는 프론트엔드 MVP 프로토타입 단계 이후, 추후 실제 AI 모델(예: Vision LLM) 및 백엔드 서버와 연동 시 사용하게 될 **API 요청 및 응답 데이터 구조(JSON Schema)**를 정의합니다.

---

## 2. API Endpoint

### `POST /api/v1/analyze-circuit`

- **설명**: 회로 이미지 파일(Multipart Data) 또는 회로 설명 텍스트를 전달받아 AI 모델 분석 결과를 반환합니다.
- **Content-Type**: `multipart/form-data` 또는 `application/json`

---

## 3. Request Payload

```json
{
  "image": "File (binary data, optional - JPG, JPEG, PNG)",
  "description": "5V 전원에 220Ω 저항과 LED가 직렬로 연결된 회로 (optional string)",
  "demoScenario": "success | partial | blurry | not-circuit | failed (optional string)"
}
```

---

## 4. Response Payload Schema

### A. 분석 성공 (`200 OK`)

```json
{
  "status": "success",
  "data": {
    "summary": "이 회로는 5V 전원을 사용해 LED를 구동하는 기본적인 LED 회로입니다.",
    "summaryHighlight": "저항은 LED에 과도한 전류가 흐르는 것을 막고, LED는 전류가 흐르면 빛을 출력합니다.",
    "parts": [
      {
        "ref": "R1",
        "name": "저항",
        "tag": "전류 제한",
        "generalRole": "회로에 흐르는 전류를 제한하거나 전압을 분배합니다.",
        "circuitRole": "LED에 너무 많은 전류가 흐르는 것을 막아 LED를 보호합니다."
      },
      {
        "ref": "D1",
        "name": "LED",
        "tag": "빛 출력",
        "generalRole": "전류가 흐르면 빛을 내는 반도체 부품입니다.",
        "circuitRole": "회로가 동작하고 있음을 빛으로 표시합니다."
      }
    ],
    "flow": [
      { "title": "5V 입력", "detail": "전원에서 회로로 전압이 공급됩니다." },
      { "title": "저항에서 전류 제한", "detail": "R1이 전류의 크기를 낮춥니다." },
      { "title": "LED로 전류 전달", "detail": "제한된 전류가 D1으로 흐릅니다." },
      { "title": "LED 점등", "detail": "전기에너지가 빛으로 바뀝니다." }
    ],
    "principle": [
      "전원에서 공급된 5V 전압이 회로로 들어오면 먼저 R1 저항을 통과합니다. 저항은 LED가 감당할 수 있는 수준으로 전류를 제한합니다.",
      "이후 전류가 LED를 통과하면서 LED 내부의 반도체에서 빛이 발생합니다."
    ],
    "cautions": [
      "IC의 정확한 모델명은 이미지에서 확인하기 어렵습니다.",
      "일부 배선이 가려져 있어 실제 연결 관계와 차이가 있을 수 있습니다."
    ],
    "blurry": false
  }
}
```

### B. 예외/오류 응답 (`400 Bad Request` / `422 Unprocessable Entity`)

#### 회로가 아닌 이미지 (`NOT_CIRCUIT_IMAGE`)
```json
{
  "status": "error",
  "errorCode": "NOT_CIRCUIT_IMAGE",
  "message": "업로드한 이미지에서 회로를 확인하지 못했습니다.",
  "subMessage": "회로도 또는 회로 기판이 보이는 사진을 다시 업로드해주세요."
}
```

#### 분석 실패 (`ANALYSIS_FAILED`)
```json
{
  "status": "error",
  "errorCode": "ANALYSIS_FAILED",
  "message": "회로 분석에 실패했습니다.",
  "subMessage": "잠시 후 다시 시도해주세요."
}
```
