# Solver Selection & Input/Output Viewer Design

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 각 Stage(DP, MP, FP, TP)에서 여러 솔버 중 하나를 선택하고, Input/Output 데이터를 테이블로 확인할 수 있는 기능 추가

**Architecture:** 페이지 상단에 솔버 드롭다운과 Input/Output 탭을 배치. 솔버 변경 시 로그 메시지만 달라지고(POC 단순화), 탭 전환으로 시각화와 데이터 테이블 간 전환.

**Tech Stack:** React, TypeScript, Tailwind CSS (기존 스택 유지)

---

## 1. 페이지 레이아웃

```
┌─────────────────────────────────────────────────────────────┐
│ ┌─────────────────────┐  ┌─────────────────────────────┐   │
│ │ Solver: [Prophet ▼] │  │ [Input]  [Output (활성)]    │   │
│ └─────────────────────┘  └─────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│  │ KPI 1   │ │ KPI 2   │ │ KPI 3   │ │ KPI 4   │           │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘           │
├─────────────────────────────────────────────────────────────┤
│  [Output 탭] → 기존 시각화 (Chart/Gantt/Map)               │
│  [Input 탭]  → DataTable (100+ 행)                         │
├─────────────────────────────────────────────────────────────┤
│  Live Solver Log                                            │
└─────────────────────────────────────────────────────────────┘
```

## 2. 솔버 구성

| Stage | 솔버 옵션 |
|-------|----------|
| **DP** | Prophet, ARIMA, XGBoost, LSTM, Holt-Winters |
| **MP** | Nexprime SCM Response, Nexprime SCM Sequencer, Linear Programming, Genetic Algorithm, MILP, Constraint Programming |
| **FP** | NEH Heuristic, Genetic Algorithm, Tabu Search, Ant Colony, Simulated Annealing |
| **TP** | Clarke-Wright, Nearest Neighbor, 2-opt, Genetic Algorithm, Simulated Annealing |

## 3. Input/Output 데이터

| Stage | Input 데이터 | Output 데이터 |
|-------|-------------|---------------|
| **DP** | 과거 판매 데이터 (날짜, 제품, 판매량, 지역) | 예측 결과 (월, 제품, 예측값, 신뢰도) |
| **MP** | 수요 예측, 공장 용량, 재고 현황 | 공장별 생산 계획 (공장, 공급량, 수요, Gap) |
| **FP** | 생산 주문, 라인 정보, 셋업 시간 | 생산 스케줄 (라인, 제품, 시작/종료, 수량) |
| **TP** | 배송 주문, 차량 정보, 위치 데이터 | 배송 경로 (차량, 경유지, 거리, 적재율) |

- 각 테이블 100개 이상의 행
- 정렬 가능, 스크롤 지원

## 4. 컴포넌트 구조

```
src/components/
├── common/
│   ├── SolverSelector.tsx      # 드롭다운 솔버 선택
│   ├── DataTabs.tsx            # Input/Output 탭 전환
│   └── DataTable.tsx           # 범용 데이터 테이블
```

### SolverSelector
- 드롭다운 형태
- 현재 선택된 솔버 이름 표시
- 솔버 실행 중 변경 불가 (disabled)

### DataTabs
- "Input" | "Output" 두 개의 탭
- Output이 기본 선택

### DataTable
- 100+ 행 지원
- 고정 높이 + 스크롤
- 컬럼 헤더 클릭 시 정렬
- 행 수 표시 ("총 142개 행")
- Nexprime 다크 테마 스타일

## 5. 상태 관리 (SCMContext 확장)

```typescript
interface SolverOption {
  id: string;           // 예: 'dp-prophet'
  name: string;         // 예: 'Prophet'
  description: string;  // 예: 'Facebook의 시계열 예측 모델'
}

// SCMContext에 추가
selectedSolver: Record<SolverStage, string>;
setSelectedSolver: (stage: SolverStage, solverId: string) => void;
```

## 6. Mock 데이터

### 솔버별 로그 메시지
```typescript
// mocks/solverLogs.ts
const solverLogMessages = {
  dp: {
    'prophet': ['Initializing Prophet model...', ...],
    'arima': ['Running ARIMA(1,1,1) model...', ...],
    // ...
  },
  mp: {
    'nexprime-response': ['Nexprime SCM Response 솔버 초기화...', ...],
    'nexprime-sequencer': ['Nexprime SCM Sequencer 시작...', ...],
    // ...
  },
  // fp, tp...
};
```

### Input/Output 테이블 데이터
```typescript
// mocks/tableData.ts
const stageTableData = {
  dp: {
    input: [...],   // 100+ rows
    output: [...],  // 100+ rows
  },
  // mp, fp, tp...
};
```

## 7. 동작 흐름

1. 페이지 진입 → 기본 솔버 선택됨, Output 탭 활성
2. 솔버 드롭다운에서 다른 솔버 선택 → 선택 상태 변경
3. Run 버튼 클릭 → 선택된 솔버의 로그 메시지가 스트리밍
4. Input 탭 클릭 → 시각화 대신 Input 테이블 표시
5. Output 탭 클릭 → 다시 시각화 표시
