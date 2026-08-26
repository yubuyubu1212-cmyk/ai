export type PartItem = {
  ref: string
  name: string
  tag: string
  generalRole: string
  circuitRole: string
}

export type FlowStep = {
  title: string
  detail: string
}

export type AnalysisResult = {
  summary: string | null
  summaryHighlight: string | null
  parts: PartItem[]
  flow: FlowStep[] | null
  principle: string[] | null
  cautions: string[]
  blurry: boolean
}

export type DemoScenario = 'success' | 'partial' | 'blurry' | 'not-circuit' | 'failed'

export const DEMO_SCENARIOS: { value: DemoScenario; label: string }[] = [
  { value: 'success', label: '분석 성공' },
  { value: 'partial', label: '일부만 확인' },
  { value: 'blurry', label: '흐린 사진' },
  { value: 'not-circuit', label: '회로 아님' },
  { value: 'failed', label: '분석 실패' },
]

const parts: PartItem[] = [
  {
    ref: 'R1',
    name: '저항',
    tag: '전류 제한',
    generalRole: '회로에 흐르는 전류를 제한하거나 전압을 분배합니다.',
    circuitRole: 'LED에 너무 많은 전류가 흐르는 것을 막아 LED를 보호합니다.',
  },
  {
    ref: 'D1',
    name: 'LED',
    tag: '빛 출력',
    generalRole: '전류가 흐르면 빛을 내는 반도체 부품입니다.',
    circuitRole: '회로가 동작하고 있음을 빛으로 표시합니다.',
  },
  {
    ref: 'C1',
    name: '커패시터',
    tag: '전압 안정화',
    generalRole: '전기에너지를 일시적으로 저장합니다.',
    circuitRole: '전원에 발생하는 순간적인 노이즈를 줄이는 역할을 합니다.',
  },
  {
    ref: 'U1',
    name: 'IC',
    tag: '신호 처리',
    generalRole: '여러 전자 기능을 하나의 부품에 집적한 회로입니다.',
    circuitRole: '입력 신호를 받아 회로의 주요 동작을 제어하는 것으로 추정됩니다.',
  },
]

const flow: FlowStep[] = [
  { title: '5V 입력', detail: '전원에서 회로로 전압이 공급됩니다.' },
  { title: '저항에서 전류 제한', detail: 'R1이 전류의 크기를 낮춥니다.' },
  { title: 'LED로 전류 전달', detail: '제한된 전류가 D1으로 흐릅니다.' },
  { title: 'LED 점등', detail: '전기에너지가 빛으로 바뀝니다.' },
]

const principle = [
  '전원에서 공급된 5V 전압이 회로로 들어오면 먼저 R1 저항을 통과합니다. 저항은 LED가 감당할 수 있는 수준으로 전류를 제한합니다. 이후 전류가 LED를 통과하면서 LED 내부의 반도체에서 빛이 발생합니다.',
  '즉, 이 회로에서 R1은 LED를 보호하는 역할을 하고, LED는 전기에너지를 빛으로 변환하는 출력 장치 역할을 합니다.',
]

const baseCautions = [
  'IC의 정확한 모델명은 이미지에서 확인하기 어렵습니다.',
  '커패시터의 용량 값은 사진 해상도로 확인하기 어렵습니다.',
  '일부 배선이 가려져 있어 실제 연결 관계와 차이가 있을 수 있습니다.',
]

export function getMockResult(scenario: DemoScenario): AnalysisResult {
  if (scenario === 'partial') {
    return {
      summary:
        '이 회로는 5V 전원으로 동작하는 LED 표시 회로로 보입니다. 저항과 LED는 확인되었지만 일부 연결 관계는 판단하지 못했습니다.',
      summaryHighlight: '저항과 LED는 확인되었지만 일부 연결 관계는 판단하지 못했습니다.',
      parts: parts.slice(0, 2),
      flow: null,
      principle: [
        '확인된 부품을 기준으로 보면, 전원에서 들어온 전압이 R1 저항을 지나 D1 LED로 전달되는 구조로 추정됩니다.',
        '다만 나머지 배선이 확인되지 않아 회로 전체의 동작 순서는 단정하기 어렵습니다.',
      ],
      cautions: [
        '입력된 정보만으로는 부품 간 연결 순서를 확인하기 어렵습니다.',
        '회로 전체가 보이는 사진을 함께 올리면 더 정확하게 분석할 수 있습니다.',
      ],
      blurry: false,
    }
  }

  if (scenario === 'blurry') {
    return {
      summary:
        '이 회로는 5V 전원을 사용해 LED를 구동하는 기본적인 LED 회로입니다. 저항은 LED에 과도한 전류가 흐르는 것을 막고, LED는 전류가 흐르면 빛을 출력합니다.',
      summaryHighlight: '저항은 LED에 과도한 전류가 흐르는 것을 막고, LED는 전류가 흐르면 빛을 출력합니다.',
      parts: parts.slice(0, 3),
      flow,
      principle,
      cautions: baseCautions,
      blurry: true,
    }
  }

  return {
    summary:
      '이 회로는 5V 전원을 사용해 LED를 구동하는 기본적인 LED 회로입니다. 저항은 LED에 과도한 전류가 흐르는 것을 막고, LED는 전류가 흐르면 빛을 출력합니다.',
    summaryHighlight: '저항은 LED에 과도한 전류가 흐르는 것을 막고, LED는 전류가 흐르면 빛을 출력합니다.',
    parts,
    flow,
    principle,
    cautions: baseCautions,
    blurry: false,
  }
}
