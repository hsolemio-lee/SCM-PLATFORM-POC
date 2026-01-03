# Solver Selection & Input/Output Viewer Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 각 Stage에서 솔버를 선택하고 Input/Output 데이터를 테이블로 확인할 수 있는 기능 구현

**Architecture:** Types 확장 → Mock 데이터 생성 → 공통 컴포넌트 구현 → Context 확장 → 페이지 업데이트

**Tech Stack:** React, TypeScript, Tailwind CSS

---

### Task 1: Types 확장

**Files:**
- Modify: `src/types/index.ts`

**Step 1: SolverOption 인터페이스 추가**

```typescript
// src/types/index.ts 끝에 추가
export interface SolverOption {
  id: string;
  name: string;
  description: string;
}

export interface StageTableData {
  input: Record<string, unknown>[];
  output: Record<string, unknown>[];
  inputColumns: { key: string; label: string }[];
  outputColumns: { key: string; label: string }[];
}
```

**Step 2: TypeScript 컴파일 확인**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/types/index.ts
git commit -m "feat: add SolverOption and StageTableData types"
```

---

### Task 2: 솔버 옵션 Mock 데이터

**Files:**
- Create: `src/mocks/solvers.ts`

**Step 1: 솔버 옵션 데이터 생성**

```typescript
// src/mocks/solvers.ts
import { SolverOption, SolverStage } from '../types';

export const solverOptions: Record<SolverStage, SolverOption[]> = {
  dp: [
    { id: 'prophet', name: 'Prophet', description: 'Facebook 시계열 예측' },
    { id: 'arima', name: 'ARIMA', description: '자기회귀 이동평균 모델' },
    { id: 'xgboost', name: 'XGBoost', description: '그래디언트 부스팅 회귀' },
    { id: 'lstm', name: 'LSTM', description: '장단기 메모리 신경망' },
    { id: 'holt-winters', name: 'Holt-Winters', description: '지수 평활법' },
  ],
  mp: [
    { id: 'nexprime-response', name: 'Nexprime SCM Response', description: 'Nexprime 수요 대응 최적화' },
    { id: 'nexprime-sequencer', name: 'Nexprime SCM Sequencer', description: 'Nexprime 순서 최적화' },
    { id: 'linear-programming', name: 'Linear Programming', description: '선형 계획법' },
    { id: 'genetic-algorithm', name: 'Genetic Algorithm', description: '유전 알고리즘' },
    { id: 'milp', name: 'MILP', description: '혼합정수 선형계획법' },
    { id: 'constraint-programming', name: 'Constraint Programming', description: '제약 프로그래밍' },
  ],
  fp: [
    { id: 'neh', name: 'NEH Heuristic', description: 'Nawaz-Enscore-Ham 휴리스틱' },
    { id: 'genetic-algorithm', name: 'Genetic Algorithm', description: '유전 알고리즘' },
    { id: 'tabu-search', name: 'Tabu Search', description: '타부 탐색' },
    { id: 'ant-colony', name: 'Ant Colony', description: '개미 군집 최적화' },
    { id: 'simulated-annealing', name: 'Simulated Annealing', description: '담금질 기법' },
  ],
  tp: [
    { id: 'clarke-wright', name: 'Clarke-Wright', description: '절약 알고리즘' },
    { id: 'nearest-neighbor', name: 'Nearest Neighbor', description: '최근접 이웃 알고리즘' },
    { id: '2-opt', name: '2-opt', description: '2-opt 개선 알고리즘' },
    { id: 'genetic-algorithm', name: 'Genetic Algorithm', description: '유전 알고리즘' },
    { id: 'simulated-annealing', name: 'Simulated Annealing', description: '담금질 기법' },
  ],
};

export const defaultSolvers: Record<SolverStage, string> = {
  dp: 'prophet',
  mp: 'nexprime-response',
  fp: 'genetic-algorithm',
  tp: 'clarke-wright',
};
```

**Step 2: TypeScript 컴파일 확인**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/mocks/solvers.ts
git commit -m "feat: add solver options mock data"
```

---

### Task 3: 솔버별 로그 메시지 데이터

**Files:**
- Modify: `src/mocks/logs.ts`

**Step 1: 기존 로그를 솔버별 구조로 변경**

```typescript
// src/mocks/logs.ts
import { SolverStage } from '../types';

export const solverLogMessages: Record<SolverStage, Record<string, string[]>> = {
  dp: {
    prophet: [
      '[INFO] Initializing Prophet model...',
      '[INFO] Loading historical data: 2,847 records',
      '[INFO] Fitting seasonal components...',
      '[INFO] Detecting changepoints...',
      '[INFO] Adding holiday effects...',
      '[INFO] Training model... 25%',
      '[INFO] Training model... 50%',
      '[INFO] Training model... 75%',
      '[INFO] Training model... 100%',
      '[INFO] Cross-validation started...',
      '[INFO] Fold 1/5 complete. MAPE: 6.2%',
      '[INFO] Fold 2/5 complete. MAPE: 5.8%',
      '[INFO] Fold 3/5 complete. MAPE: 5.5%',
      '[INFO] Fold 4/5 complete. MAPE: 5.9%',
      '[INFO] Fold 5/5 complete. MAPE: 5.6%',
      '[INFO] Average MAPE: 5.8%',
      '[INFO] Generating forecasts for next 12 months...',
      '[INFO] Prophet forecast completed successfully.',
    ],
    arima: [
      '[INFO] Initializing ARIMA model...',
      '[INFO] Loading time series data...',
      '[INFO] Checking stationarity (ADF test)...',
      '[WARN] Series is non-stationary. Differencing required.',
      '[INFO] Applying first-order differencing...',
      '[INFO] Auto-selecting ARIMA parameters...',
      '[INFO] Testing ARIMA(1,1,0)... AIC: 2345.2',
      '[INFO] Testing ARIMA(1,1,1)... AIC: 2312.8',
      '[INFO] Testing ARIMA(2,1,1)... AIC: 2298.4',
      '[INFO] Best model: ARIMA(2,1,1)',
      '[INFO] Fitting final model...',
      '[INFO] Estimating parameters...',
      '[INFO] Model diagnostics: Ljung-Box p=0.42',
      '[INFO] Generating forecasts...',
      '[INFO] ARIMA forecast completed. MAPE: 6.1%',
    ],
    xgboost: [
      '[INFO] Initializing XGBoost Regressor...',
      '[INFO] Feature engineering started...',
      '[INFO] Creating lag features (1-12 months)...',
      '[INFO] Creating rolling mean features...',
      '[INFO] Creating seasonal indicators...',
      '[INFO] Feature matrix: 2847 x 45',
      '[INFO] Splitting train/validation sets...',
      '[INFO] Training with 500 trees...',
      '[INFO] Tree 100/500... RMSE: 245.3',
      '[INFO] Tree 200/500... RMSE: 198.7',
      '[INFO] Tree 300/500... RMSE: 167.2',
      '[INFO] Tree 400/500... RMSE: 152.8',
      '[INFO] Tree 500/500... RMSE: 145.1',
      '[INFO] Early stopping not triggered.',
      '[INFO] Validation MAPE: 5.4%',
      '[INFO] XGBoost forecast completed successfully.',
    ],
    lstm: [
      '[INFO] Initializing LSTM Neural Network...',
      '[INFO] Preprocessing sequences...',
      '[INFO] Sequence length: 12 timesteps',
      '[INFO] Building model architecture...',
      '[INFO] LSTM layers: 2 x 64 units',
      '[INFO] Compiling with Adam optimizer...',
      '[INFO] Training Epoch 1/50... Loss: 0.145',
      '[INFO] Training Epoch 10/50... Loss: 0.087',
      '[INFO] Training Epoch 20/50... Loss: 0.052',
      '[INFO] Training Epoch 30/50... Loss: 0.038',
      '[INFO] Training Epoch 40/50... Loss: 0.029',
      '[INFO] Training Epoch 50/50... Loss: 0.024',
      '[INFO] Validation loss: 0.031',
      '[INFO] LSTM forecast completed. MAPE: 5.7%',
    ],
    'holt-winters': [
      '[INFO] Initializing Holt-Winters model...',
      '[INFO] Detecting seasonality pattern...',
      '[INFO] Seasonality: multiplicative (period=12)',
      '[INFO] Estimating alpha (level)...',
      '[INFO] Estimating beta (trend)...',
      '[INFO] Estimating gamma (seasonal)...',
      '[INFO] Optimizing smoothing parameters...',
      '[INFO] Alpha=0.32, Beta=0.08, Gamma=0.15',
      '[INFO] Fitting model to historical data...',
      '[INFO] Generating forecasts...',
      '[INFO] Holt-Winters forecast completed. MAPE: 6.3%',
    ],
  },
  mp: {
    'nexprime-response': [
      '[INFO] Nexprime SCM Response 솔버 초기화...',
      '[INFO] 수요 예측 데이터 로딩 중...',
      '[INFO] 공장 용량 제약 조건 로딩...',
      '[INFO] Nexprime 알고리즘 시작...',
      '[INFO] 수요-공급 균형 분석 중...',
      '[INFO] Plant A 최적화 진행 중...',
      '[INFO] Plant B 최적화 진행 중...',
      '[WARN] Plant B 용량 초과. 대안 평가 중...',
      '[INFO] Plant C 최적화 진행 중...',
      '[INFO] Plant D 최적화 진행 중...',
      '[INFO] 재고 최적화 수행 중...',
      '[INFO] 서비스 레벨 목표: 98% 달성',
      '[INFO] Nexprime Response 솔버 완료.',
    ],
    'nexprime-sequencer': [
      '[INFO] Nexprime SCM Sequencer 시작...',
      '[INFO] 생산 순서 최적화 모듈 초기화...',
      '[INFO] 주문 우선순위 분석 중...',
      '[INFO] 자원 할당 최적화 중...',
      '[INFO] Sequencing iteration 1/20...',
      '[INFO] Sequencing iteration 10/20...',
      '[INFO] Sequencing iteration 20/20...',
      '[INFO] 최적 순서 도출 완료.',
      '[INFO] 리드타임 단축: 15%',
      '[INFO] Nexprime Sequencer 완료.',
    ],
    'linear-programming': [
      '[INFO] Linear Programming solver initializing...',
      '[INFO] Building constraint matrix...',
      '[INFO] Variables: 248, Constraints: 156',
      '[INFO] Solving with Simplex method...',
      '[INFO] Iteration 1... Objective: 1,450,000',
      '[INFO] Iteration 25... Objective: 1,120,000',
      '[INFO] Iteration 50... Objective: 985,000',
      '[INFO] Iteration 75... Objective: 912,000',
      '[INFO] Optimal solution found at iteration 82.',
      '[INFO] LP solver completed successfully.',
    ],
    'genetic-algorithm': [
      '[INFO] Genetic Algorithm for MP starting...',
      '[INFO] Population size: 100',
      '[INFO] Generation 1... Best fitness: 0.58',
      '[INFO] Generation 20... Best fitness: 0.72',
      '[INFO] Generation 40... Best fitness: 0.81',
      '[INFO] Generation 60... Best fitness: 0.88',
      '[INFO] Generation 80... Best fitness: 0.92',
      '[INFO] Convergence at generation 85.',
      '[INFO] GA solver completed.',
    ],
    milp: [
      '[INFO] MILP solver initializing...',
      '[INFO] Integer variables: 45',
      '[INFO] Continuous variables: 203',
      '[INFO] Applying branch and bound...',
      '[INFO] Node 1... Gap: 15.2%',
      '[INFO] Node 50... Gap: 8.4%',
      '[INFO] Node 100... Gap: 3.1%',
      '[INFO] Node 150... Gap: 0.5%',
      '[INFO] Optimal solution found.',
      '[INFO] MILP solver completed.',
    ],
    'constraint-programming': [
      '[INFO] Constraint Programming solver starting...',
      '[INFO] Defining constraint model...',
      '[INFO] Propagating constraints...',
      '[INFO] Search strategy: first-fail',
      '[INFO] Exploring search space...',
      '[INFO] Solution 1 found. Cost: 1,250,000',
      '[INFO] Solution 2 found. Cost: 1,180,000',
      '[INFO] Solution 3 found. Cost: 1,020,000',
      '[INFO] Optimal solution found. Cost: 985,000',
      '[INFO] CP solver completed.',
    ],
  },
  fp: {
    neh: [
      '[INFO] NEH Heuristic starting...',
      '[INFO] Sorting jobs by total processing time...',
      '[INFO] Inserting job 1/24...',
      '[INFO] Inserting job 12/24...',
      '[INFO] Inserting job 24/24...',
      '[INFO] Initial schedule makespan: 845 min',
      '[INFO] Applying local search...',
      '[INFO] Improved makespan: 812 min',
      '[INFO] NEH completed. OEE: 86.5%',
    ],
    'genetic-algorithm': [
      '[INFO] Genetic Algorithm initializing...',
      '[INFO] Initial population: 100 schedules',
      '[INFO] Generation 1... Best fitness: 0.65',
      '[INFO] Generation 10... Best fitness: 0.72',
      '[INFO] Generation 20... Best fitness: 0.78',
      '[INFO] Generation 30... Best fitness: 0.83',
      '[WARN] Local optimum detected. Mutation boost...',
      '[INFO] Generation 40... Best fitness: 0.86',
      '[INFO] Generation 45... Best fitness: 0.87',
      '[INFO] Convergence achieved.',
      '[INFO] GA completed. OEE: 87.3%',
    ],
    'tabu-search': [
      '[INFO] Tabu Search initializing...',
      '[INFO] Tabu list size: 20',
      '[INFO] Iteration 1... Makespan: 890',
      '[INFO] Iteration 50... Makespan: 835',
      '[INFO] Iteration 100... Makespan: 802',
      '[INFO] Best solution found at iteration 87.',
      '[INFO] Tabu Search completed. OEE: 87.8%',
    ],
    'ant-colony': [
      '[INFO] Ant Colony Optimization starting...',
      '[INFO] Ants: 50, Pheromone decay: 0.1',
      '[INFO] Iteration 1... Best tour: 920',
      '[INFO] Iteration 25... Best tour: 845',
      '[INFO] Iteration 50... Best tour: 810',
      '[INFO] Pheromone trails converged.',
      '[INFO] ACO completed. OEE: 87.1%',
    ],
    'simulated-annealing': [
      '[INFO] Simulated Annealing starting...',
      '[INFO] Initial temperature: 1000',
      '[INFO] Cooling rate: 0.995',
      '[INFO] T=1000... Energy: 920',
      '[INFO] T=500... Energy: 852',
      '[INFO] T=100... Energy: 815',
      '[INFO] T=10... Energy: 808',
      '[INFO] Frozen state reached.',
      '[INFO] SA completed. OEE: 87.5%',
    ],
  },
  tp: {
    'clarke-wright': [
      '[INFO] Clarke-Wright Savings Algorithm starting...',
      '[INFO] Building savings matrix...',
      '[INFO] Sorting savings...',
      '[INFO] Merging routes by savings...',
      '[INFO] Route 1 constructed: 4 stops',
      '[INFO] Route 2 constructed: 3 stops',
      '[INFO] Route 3 constructed: 5 stops',
      '[INFO] Total distance: 450 km',
      '[INFO] Clarke-Wright completed.',
    ],
    'nearest-neighbor': [
      '[INFO] Nearest Neighbor algorithm starting...',
      '[INFO] Starting from depot...',
      '[INFO] Adding customer A (12 km)',
      '[INFO] Adding customer B (8 km)',
      '[INFO] Adding customer C (15 km)...',
      '[INFO] Initial routes constructed.',
      '[INFO] Total distance: 485 km',
      '[INFO] Nearest Neighbor completed.',
    ],
    '2-opt': [
      '[INFO] 2-opt Improvement starting...',
      '[INFO] Initial solution loaded...',
      '[INFO] 2-opt iteration 1... Distance: 480',
      '[INFO] 2-opt iteration 5... Distance: 465',
      '[INFO] 2-opt iteration 10... Distance: 452',
      '[INFO] No further improvements found.',
      '[INFO] 2-opt completed. Distance: 450 km',
    ],
    'genetic-algorithm': [
      '[INFO] GA for VRP starting...',
      '[INFO] Population: 80 solutions',
      '[INFO] Generation 1... Best: 520 km',
      '[INFO] Generation 25... Best: 475 km',
      '[INFO] Generation 50... Best: 455 km',
      '[INFO] Generation 75... Best: 448 km',
      '[INFO] Convergence achieved.',
      '[INFO] GA VRP completed. Distance: 448 km',
    ],
    'simulated-annealing': [
      '[INFO] SA for VRP starting...',
      '[INFO] Temperature: 1000',
      '[INFO] T=1000... Distance: 510',
      '[INFO] T=500... Distance: 472',
      '[INFO] T=100... Distance: 455',
      '[INFO] Cooling complete.',
      '[INFO] SA VRP completed. Distance: 451 km',
    ],
  },
};

// 기존 호환성을 위한 기본 로그 (deprecated)
export const legacySolverLogMessages: Record<string, string[]> = {
  dp: solverLogMessages.dp.prophet,
  mp: solverLogMessages.mp['nexprime-response'],
  fp: solverLogMessages.fp['genetic-algorithm'],
  tp: solverLogMessages.tp['clarke-wright'],
};
```

**Step 2: TypeScript 컴파일 확인**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/mocks/logs.ts
git commit -m "feat: add solver-specific log messages"
```

---

### Task 4: Input/Output 테이블 데이터 생성

**Files:**
- Create: `src/mocks/tableData.ts`

**Step 1: 100+ 행의 테이블 데이터 생성**

```typescript
// src/mocks/tableData.ts
import { StageTableData, SolverStage } from '../types';

// Helper to generate random data
const generateDPInputData = () => {
  const products = ['SKU-001', 'SKU-002', 'SKU-003', 'SKU-004', 'SKU-005'];
  const regions = ['Seoul', 'Busan', 'Daegu', 'Incheon', 'Gwangju'];
  const data = [];

  for (let month = 1; month <= 12; month++) {
    for (let day = 1; day <= 28; day += 7) {
      for (const product of products) {
        const region = regions[Math.floor(Math.random() * regions.length)];
        data.push({
          date: `2024-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
          product,
          sales: Math.floor(800 + Math.random() * 600),
          region,
          channel: Math.random() > 0.5 ? 'Online' : 'Offline',
        });
      }
    }
  }
  return data.slice(0, 120);
};

const generateDPOutputData = () => {
  const products = ['SKU-001', 'SKU-002', 'SKU-003', 'SKU-004', 'SKU-005'];
  const data = [];

  for (let month = 1; month <= 12; month++) {
    for (const product of products) {
      data.push({
        month: `2025-${String(month).padStart(2, '0')}`,
        product,
        forecast: Math.floor(1000 + Math.random() * 800),
        lowerBound: Math.floor(900 + Math.random() * 600),
        upperBound: Math.floor(1200 + Math.random() * 900),
        confidence: (0.85 + Math.random() * 0.1).toFixed(2),
      });
    }
  }
  return data.slice(0, 120);
};

const generateMPInputData = () => {
  const plants = ['Plant A', 'Plant B', 'Plant C', 'Plant D'];
  const products = ['SKU-001', 'SKU-002', 'SKU-003', 'SKU-004', 'SKU-005'];
  const data = [];

  for (const plant of plants) {
    for (const product of products) {
      for (let week = 1; week <= 8; week++) {
        data.push({
          plant,
          product,
          week: `W${week}`,
          demand: Math.floor(500 + Math.random() * 500),
          capacity: Math.floor(600 + Math.random() * 400),
          inventory: Math.floor(100 + Math.random() * 200),
        });
      }
    }
  }
  return data.slice(0, 120);
};

const generateMPOutputData = () => {
  const plants = ['Plant A', 'Plant B', 'Plant C', 'Plant D'];
  const products = ['SKU-001', 'SKU-002', 'SKU-003', 'SKU-004', 'SKU-005'];
  const data = [];

  for (const plant of plants) {
    for (const product of products) {
      for (let week = 1; week <= 8; week++) {
        const supply = Math.floor(500 + Math.random() * 500);
        const demand = Math.floor(450 + Math.random() * 500);
        data.push({
          plant,
          product,
          week: `W${week}`,
          supply,
          demand,
          gap: supply - demand,
          utilization: (0.8 + Math.random() * 0.25).toFixed(2),
        });
      }
    }
  }
  return data.slice(0, 120);
};

const generateFPInputData = () => {
  const lines = ['Line 1', 'Line 2', 'Line 3', 'Line 4'];
  const products = ['SKU-001', 'SKU-002', 'SKU-003', 'SKU-004', 'SKU-005'];
  const data = [];

  for (let order = 1; order <= 30; order++) {
    const line = lines[Math.floor(Math.random() * lines.length)];
    const product = products[Math.floor(Math.random() * products.length)];
    data.push({
      orderId: `ORD-${String(order).padStart(4, '0')}`,
      line,
      product,
      quantity: Math.floor(200 + Math.random() * 400),
      dueDate: `2025-01-${String(10 + Math.floor(order / 3)).padStart(2, '0')}`,
      priority: Math.random() > 0.7 ? 'High' : Math.random() > 0.4 ? 'Medium' : 'Low',
      setupTime: Math.floor(15 + Math.random() * 30),
    });
  }

  // Add more rows
  for (let i = 0; i < 90; i++) {
    const line = lines[Math.floor(Math.random() * lines.length)];
    const product = products[Math.floor(Math.random() * products.length)];
    data.push({
      orderId: `ORD-${String(31 + i).padStart(4, '0')}`,
      line,
      product,
      quantity: Math.floor(200 + Math.random() * 400),
      dueDate: `2025-01-${String(15 + Math.floor(i / 10)).padStart(2, '0')}`,
      priority: Math.random() > 0.7 ? 'High' : Math.random() > 0.4 ? 'Medium' : 'Low',
      setupTime: Math.floor(15 + Math.random() * 30),
    });
  }
  return data.slice(0, 120);
};

const generateFPOutputData = () => {
  const lines = ['Line 1', 'Line 2', 'Line 3', 'Line 4'];
  const products = ['SKU-001', 'SKU-002', 'SKU-003', 'SKU-004', 'SKU-005'];
  const data = [];

  for (let i = 0; i < 120; i++) {
    const line = lines[Math.floor(Math.random() * lines.length)];
    const product = products[Math.floor(Math.random() * products.length)];
    const startHour = 6 + Math.floor(Math.random() * 10);
    const duration = 1 + Math.floor(Math.random() * 3);
    data.push({
      scheduleId: `SCH-${String(i + 1).padStart(4, '0')}`,
      line,
      product,
      startTime: `${String(startHour).padStart(2, '0')}:00`,
      endTime: `${String(startHour + duration).padStart(2, '0')}:00`,
      quantity: Math.floor(200 + Math.random() * 400),
      status: Math.random() > 0.2 ? 'Scheduled' : 'Pending',
    });
  }
  return data;
};

const generateTPInputData = () => {
  const vehicles = ['V01', 'V02', 'V03', 'V04', 'V05'];
  const customers = [];
  for (let i = 1; i <= 30; i++) {
    customers.push(`Customer ${String.fromCharCode(64 + i)}`);
  }

  const data = [];
  for (let i = 0; i < 120; i++) {
    const customer = customers[i % customers.length];
    data.push({
      orderId: `SHIP-${String(i + 1).padStart(4, '0')}`,
      customer,
      address: `${Math.floor(100 + Math.random() * 900)} ${['Main St', 'Oak Ave', 'Park Rd', 'Lake Dr'][Math.floor(Math.random() * 4)]}`,
      weight: Math.floor(50 + Math.random() * 200),
      volume: (0.5 + Math.random() * 2).toFixed(2),
      timeWindow: `${8 + Math.floor(Math.random() * 4)}:00-${14 + Math.floor(Math.random() * 4)}:00`,
      priority: Math.random() > 0.8 ? 'Express' : 'Standard',
    });
  }
  return data;
};

const generateTPOutputData = () => {
  const vehicles = ['V01', 'V02', 'V03', 'V04', 'V05'];
  const data = [];

  for (let i = 0; i < 120; i++) {
    const vehicle = vehicles[i % vehicles.length];
    const stopNum = Math.floor(Math.random() * 8) + 1;
    data.push({
      routeId: `ROUTE-${String(i + 1).padStart(4, '0')}`,
      vehicle,
      stopNumber: stopNum,
      customer: `Customer ${String.fromCharCode(65 + (i % 26))}`,
      arrivalTime: `${8 + Math.floor(stopNum * 1.2)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      distance: (5 + Math.random() * 25).toFixed(1),
      load: (0.6 + Math.random() * 0.35).toFixed(2),
    });
  }
  return data;
};

export const stageTableData: Record<SolverStage, StageTableData> = {
  dp: {
    input: generateDPInputData(),
    output: generateDPOutputData(),
    inputColumns: [
      { key: 'date', label: 'Date' },
      { key: 'product', label: 'Product' },
      { key: 'sales', label: 'Sales' },
      { key: 'region', label: 'Region' },
      { key: 'channel', label: 'Channel' },
    ],
    outputColumns: [
      { key: 'month', label: 'Month' },
      { key: 'product', label: 'Product' },
      { key: 'forecast', label: 'Forecast' },
      { key: 'lowerBound', label: 'Lower' },
      { key: 'upperBound', label: 'Upper' },
      { key: 'confidence', label: 'Conf.' },
    ],
  },
  mp: {
    input: generateMPInputData(),
    output: generateMPOutputData(),
    inputColumns: [
      { key: 'plant', label: 'Plant' },
      { key: 'product', label: 'Product' },
      { key: 'week', label: 'Week' },
      { key: 'demand', label: 'Demand' },
      { key: 'capacity', label: 'Capacity' },
      { key: 'inventory', label: 'Inventory' },
    ],
    outputColumns: [
      { key: 'plant', label: 'Plant' },
      { key: 'product', label: 'Product' },
      { key: 'week', label: 'Week' },
      { key: 'supply', label: 'Supply' },
      { key: 'demand', label: 'Demand' },
      { key: 'gap', label: 'Gap' },
      { key: 'utilization', label: 'Util.' },
    ],
  },
  fp: {
    input: generateFPInputData(),
    output: generateFPOutputData(),
    inputColumns: [
      { key: 'orderId', label: 'Order ID' },
      { key: 'line', label: 'Line' },
      { key: 'product', label: 'Product' },
      { key: 'quantity', label: 'Qty' },
      { key: 'dueDate', label: 'Due Date' },
      { key: 'priority', label: 'Priority' },
      { key: 'setupTime', label: 'Setup' },
    ],
    outputColumns: [
      { key: 'scheduleId', label: 'Schedule ID' },
      { key: 'line', label: 'Line' },
      { key: 'product', label: 'Product' },
      { key: 'startTime', label: 'Start' },
      { key: 'endTime', label: 'End' },
      { key: 'quantity', label: 'Qty' },
      { key: 'status', label: 'Status' },
    ],
  },
  tp: {
    input: generateTPInputData(),
    output: generateTPOutputData(),
    inputColumns: [
      { key: 'orderId', label: 'Order ID' },
      { key: 'customer', label: 'Customer' },
      { key: 'address', label: 'Address' },
      { key: 'weight', label: 'Weight' },
      { key: 'volume', label: 'Volume' },
      { key: 'timeWindow', label: 'Time Window' },
      { key: 'priority', label: 'Priority' },
    ],
    outputColumns: [
      { key: 'routeId', label: 'Route ID' },
      { key: 'vehicle', label: 'Vehicle' },
      { key: 'stopNumber', label: 'Stop #' },
      { key: 'customer', label: 'Customer' },
      { key: 'arrivalTime', label: 'Arrival' },
      { key: 'distance', label: 'Dist(km)' },
      { key: 'load', label: 'Load' },
    ],
  },
};
```

**Step 2: TypeScript 컴파일 확인**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/mocks/tableData.ts
git commit -m "feat: add input/output table data (100+ rows per stage)"
```

---

### Task 5: DataTable 컴포넌트 구현

**Files:**
- Create: `src/components/common/DataTable.tsx`

**Step 1: 범용 테이블 컴포넌트 구현**

```typescript
// src/components/common/DataTable.tsx
import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface Column {
  key: string;
  label: string;
}

interface DataTableProps {
  data: Record<string, unknown>[];
  columns: Column[];
  maxHeight?: string;
}

export default function DataTable({ data, columns, maxHeight = '400px' }: DataTableProps) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      const comparison = aVal < bVal ? -1 : 1;
      return sortDir === 'asc' ? comparison : -comparison;
    });
  }, [data, sortKey, sortDir]);

  return (
    <div className="bg-nexprime-dark border border-nexprime-blue/30 rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-nexprime-blue/30 flex justify-between items-center">
        <span className="text-white/60 text-sm">Total {data.length} rows</span>
      </div>
      <div className="overflow-auto" style={{ maxHeight }}>
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-nexprime-darker">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="px-4 py-3 text-left text-white/60 font-medium cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {sortKey === col.key && (
                      sortDir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, idx) => (
              <tr
                key={idx}
                className="border-t border-nexprime-blue/10 hover:bg-nexprime-blue/5 transition-colors"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-2 text-white/80">
                    {String(row[col.key] ?? '-')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

**Step 2: TypeScript 컴파일 확인**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/components/common/DataTable.tsx
git commit -m "feat: implement DataTable component with sorting"
```

---

### Task 6: SolverSelector 컴포넌트 구현

**Files:**
- Create: `src/components/common/SolverSelector.tsx`

**Step 1: 드롭다운 솔버 선택 컴포넌트 구현**

```typescript
// src/components/common/SolverSelector.tsx
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { SolverOption } from '../../types';

interface SolverSelectorProps {
  options: SolverOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  disabled?: boolean;
}

export default function SolverSelector({ options, selectedId, onSelect, disabled }: SolverSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(o => o.id === selectedId);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors
          ${disabled
            ? 'bg-nexprime-darker border-nexprime-blue/20 text-white/40 cursor-not-allowed'
            : 'bg-nexprime-dark border-nexprime-blue/30 text-white hover:border-nexprime-cyan'
          }
        `}
      >
        <span className="text-sm font-medium">Solver:</span>
        <span className="text-nexprime-cyan">{selectedOption?.name || 'Select'}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-nexprime-darker border border-nexprime-blue/30 rounded-lg shadow-xl z-50 overflow-hidden">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                onSelect(option.id);
                setIsOpen(false);
              }}
              className={`
                w-full px-4 py-3 text-left hover:bg-nexprime-blue/10 transition-colors
                ${option.id === selectedId ? 'bg-nexprime-blue/20' : ''}
              `}
            >
              <div className="text-white font-medium">{option.name}</div>
              <div className="text-white/50 text-xs mt-0.5">{option.description}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

**Step 2: TypeScript 컴파일 확인**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/components/common/SolverSelector.tsx
git commit -m "feat: implement SolverSelector dropdown component"
```

---

### Task 7: DataTabs 컴포넌트 구현

**Files:**
- Create: `src/components/common/DataTabs.tsx`

**Step 1: Input/Output 탭 컴포넌트 구현**

```typescript
// src/components/common/DataTabs.tsx
interface DataTabsProps {
  activeTab: 'input' | 'output';
  onTabChange: (tab: 'input' | 'output') => void;
}

export default function DataTabs({ activeTab, onTabChange }: DataTabsProps) {
  return (
    <div className="flex gap-1 bg-nexprime-darker rounded-lg p-1">
      <button
        onClick={() => onTabChange('input')}
        className={`
          px-4 py-2 rounded-md text-sm font-medium transition-colors
          ${activeTab === 'input'
            ? 'bg-nexprime-blue/30 text-nexprime-cyan'
            : 'text-white/60 hover:text-white hover:bg-nexprime-blue/10'
          }
        `}
      >
        Input
      </button>
      <button
        onClick={() => onTabChange('output')}
        className={`
          px-4 py-2 rounded-md text-sm font-medium transition-colors
          ${activeTab === 'output'
            ? 'bg-nexprime-blue/30 text-nexprime-cyan'
            : 'text-white/60 hover:text-white hover:bg-nexprime-blue/10'
          }
        `}
      >
        Output
      </button>
    </div>
  );
}
```

**Step 2: TypeScript 컴파일 확인**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/components/common/DataTabs.tsx
git commit -m "feat: implement DataTabs component"
```

---

### Task 8: SCMContext 확장

**Files:**
- Modify: `src/context/SCMContext.tsx`

**Step 1: selectedSolver 상태 및 setSelectedSolver 함수 추가**

기존 파일에 다음 변경사항 적용:

1. Import 추가:
```typescript
import { solverOptions, defaultSolvers } from '../mocks/solvers';
import { solverLogMessages } from '../mocks/logs';
```

2. SCMContextType 인터페이스에 추가:
```typescript
selectedSolver: Record<SolverStage, string>;
setSelectedSolver: (stage: SolverStage, solverId: string) => void;
```

3. SCMProvider 내부에 상태 추가:
```typescript
const [selectedSolver, setSelectedSolverState] = useState<Record<SolverStage, string>>(defaultSolvers);

const setSelectedSolver = useCallback((stage: SolverStage, solverId: string) => {
  setSelectedSolverState(prev => ({ ...prev, [stage]: solverId }));
}, []);
```

4. runSolver 함수에서 선택된 솔버의 로그 사용:
```typescript
const messages = solverLogMessages[stage][selectedSolver[stage]] || [];
```

5. Provider value에 추가:
```typescript
selectedSolver,
setSelectedSolver,
```

**Step 2: TypeScript 컴파일 확인**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/context/SCMContext.tsx
git commit -m "feat: add solver selection to SCMContext"
```

---

### Task 9: DemandPlanning 페이지 업데이트

**Files:**
- Modify: `src/pages/DemandPlanning.tsx`

**Step 1: 솔버 선택 및 탭 UI 추가**

```typescript
// src/pages/DemandPlanning.tsx
import { useState } from 'react';
import { useSCM } from '../context/SCMContext';
import KPICard from '../components/common/KPICard';
import LiveSolverLog from '../components/common/LiveSolverLog';
import ForecastChart from '../components/visualizations/ForecastChart';
import SolverSelector from '../components/common/SolverSelector';
import DataTabs from '../components/common/DataTabs';
import DataTable from '../components/common/DataTable';
import { solverOptions } from '../mocks/solvers';
import { stageTableData } from '../mocks/tableData';

export default function DemandPlanning() {
  const { solverOutputs, solverStatus, logs, expandedLog, setExpandedLog, selectedSolver, setSelectedSolver } = useSCM();
  const { forecasts, kpis } = solverOutputs.dp;
  const [activeTab, setActiveTab] = useState<'input' | 'output'>('output');

  const tableData = stageTableData.dp;
  const isRunning = solverStatus.dp === 'running';

  return (
    <div className="space-y-6">
      {/* Solver Selection & Tabs */}
      <div className="flex items-center justify-between">
        <SolverSelector
          options={solverOptions.dp}
          selectedId={selectedSolver.dp}
          onSelect={(id) => setSelectedSolver('dp', id)}
          disabled={isRunning}
        />
        <DataTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard
          label="Forecast Accuracy"
          value={kpis.accuracy}
          suffix="%"
          trend="up"
          trendValue="+2.1% vs last month"
        />
        <KPICard
          label="SKU Coverage"
          value={kpis.coverage}
          suffix="%"
          trend="neutral"
        />
        <KPICard
          label="MAPE"
          value={kpis.mape}
          suffix="%"
          trend="down"
          trendValue="-0.8%"
        />
        <KPICard
          label="Forecasts Generated"
          value={forecasts.length}
          trend="up"
          trendValue="+3 new SKUs"
        />
      </div>

      {/* Main Content - Chart or Table based on tab */}
      {activeTab === 'output' ? (
        <ForecastChart data={forecasts} />
      ) : (
        <DataTable
          data={tableData.input}
          columns={tableData.inputColumns}
        />
      )}

      {/* Live Solver Log */}
      <LiveSolverLog
        stage="dp"
        logs={logs.dp}
        status={solverStatus.dp}
        isExpanded={expandedLog === 'dp'}
        onToggle={() => setExpandedLog(expandedLog === 'dp' ? null : 'dp')}
      />
    </div>
  );
}
```

**Step 2: TypeScript 컴파일 확인**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/pages/DemandPlanning.tsx
git commit -m "feat: add solver selection and data tabs to DemandPlanning"
```

---

### Task 10: MasterPlanning 페이지 업데이트

**Files:**
- Modify: `src/pages/MasterPlanning.tsx`

**Step 1: 동일한 패턴으로 업데이트**

```typescript
// src/pages/MasterPlanning.tsx
import { useState } from 'react';
import { useSCM } from '../context/SCMContext';
import KPICard from '../components/common/KPICard';
import LiveSolverLog from '../components/common/LiveSolverLog';
import SupplyDemandChart from '../components/visualizations/SupplyDemandChart';
import SolverSelector from '../components/common/SolverSelector';
import DataTabs from '../components/common/DataTabs';
import DataTable from '../components/common/DataTable';
import { solverOptions } from '../mocks/solvers';
import { stageTableData } from '../mocks/tableData';

export default function MasterPlanning() {
  const { solverOutputs, solverStatus, logs, expandedLog, setExpandedLog, selectedSolver, setSelectedSolver } = useSCM();
  const { plans, kpis } = solverOutputs.mp;
  const [activeTab, setActiveTab] = useState<'input' | 'output'>('output');

  const tableData = stageTableData.mp;
  const isRunning = solverStatus.mp === 'running';

  return (
    <div className="space-y-6">
      {/* Solver Selection & Tabs */}
      <div className="flex items-center justify-between">
        <SolverSelector
          options={solverOptions.mp}
          selectedId={selectedSolver.mp}
          onSelect={(id) => setSelectedSolver('mp', id)}
          disabled={isRunning}
        />
        <DataTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard
          label="Service Level"
          value={kpis.serviceLevel}
          suffix="%"
          trend="up"
          trendValue="+0.5%"
        />
        <KPICard
          label="Inventory Turns"
          value={kpis.inventoryTurns}
          suffix="x"
          trend="up"
          trendValue="+1.2"
        />
        <KPICard
          label="Fill Rate"
          value={kpis.fillRate}
          suffix="%"
          trend="neutral"
        />
        <KPICard
          label="Plants Balanced"
          value={plans.length}
          trend="neutral"
        />
      </div>

      {/* Main Content */}
      {activeTab === 'output' ? (
        <SupplyDemandChart data={plans} />
      ) : (
        <DataTable
          data={tableData.input}
          columns={tableData.inputColumns}
        />
      )}

      {/* Live Solver Log */}
      <LiveSolverLog
        stage="mp"
        logs={logs.mp}
        status={solverStatus.mp}
        isExpanded={expandedLog === 'mp'}
        onToggle={() => setExpandedLog(expandedLog === 'mp' ? null : 'mp')}
      />
    </div>
  );
}
```

**Step 2: TypeScript 컴파일 확인**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/pages/MasterPlanning.tsx
git commit -m "feat: add solver selection and data tabs to MasterPlanning"
```

---

### Task 11: FactoryPlanning 페이지 업데이트

**Files:**
- Modify: `src/pages/FactoryPlanning.tsx`

**Step 1: 동일한 패턴으로 업데이트**

```typescript
// src/pages/FactoryPlanning.tsx
import { useState } from 'react';
import { useSCM } from '../context/SCMContext';
import KPICard from '../components/common/KPICard';
import LiveSolverLog from '../components/common/LiveSolverLog';
import GanttChart from '../components/visualizations/GanttChart';
import SolverSelector from '../components/common/SolverSelector';
import DataTabs from '../components/common/DataTabs';
import DataTable from '../components/common/DataTable';
import { solverOptions } from '../mocks/solvers';
import { stageTableData } from '../mocks/tableData';

export default function FactoryPlanning() {
  const { solverOutputs, solverStatus, logs, expandedLog, setExpandedLog, selectedSolver, setSelectedSolver } = useSCM();
  const { schedule, kpis } = solverOutputs.fp;
  const [activeTab, setActiveTab] = useState<'input' | 'output'>('output');

  const tableData = stageTableData.fp;
  const isRunning = solverStatus.fp === 'running';

  return (
    <div className="space-y-6">
      {/* Solver Selection & Tabs */}
      <div className="flex items-center justify-between">
        <SolverSelector
          options={solverOptions.fp}
          selectedId={selectedSolver.fp}
          onSelect={(id) => setSelectedSolver('fp', id)}
          disabled={isRunning}
        />
        <DataTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard
          label="OEE"
          value={kpis.oee}
          suffix="%"
          trend="up"
          trendValue="+3.2%"
        />
        <KPICard
          label="Avg Setup Time"
          value={kpis.setupTime}
          suffix=" min"
          trend="down"
          trendValue="-5 min"
        />
        <KPICard
          label="Daily Throughput"
          value={kpis.throughput}
          suffix=" units"
          trend="up"
          trendValue="+150"
        />
        <KPICard
          label="Production Orders"
          value={schedule.length}
          trend="neutral"
        />
      </div>

      {/* Main Content */}
      {activeTab === 'output' ? (
        <GanttChart data={schedule} />
      ) : (
        <DataTable
          data={tableData.input}
          columns={tableData.inputColumns}
        />
      )}

      {/* Live Solver Log */}
      <LiveSolverLog
        stage="fp"
        logs={logs.fp}
        status={solverStatus.fp}
        isExpanded={expandedLog === 'fp'}
        onToggle={() => setExpandedLog(expandedLog === 'fp' ? null : 'fp')}
      />
    </div>
  );
}
```

**Step 2: TypeScript 컴파일 확인**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/pages/FactoryPlanning.tsx
git commit -m "feat: add solver selection and data tabs to FactoryPlanning"
```

---

### Task 12: TransportPlanning 페이지 업데이트

**Files:**
- Modify: `src/pages/TransportPlanning.tsx`

**Step 1: 동일한 패턴으로 업데이트**

```typescript
// src/pages/TransportPlanning.tsx
import { useState } from 'react';
import { useSCM } from '../context/SCMContext';
import KPICard from '../components/common/KPICard';
import LiveSolverLog from '../components/common/LiveSolverLog';
import RouteMap from '../components/visualizations/RouteMap';
import SolverSelector from '../components/common/SolverSelector';
import DataTabs from '../components/common/DataTabs';
import DataTable from '../components/common/DataTable';
import { solverOptions } from '../mocks/solvers';
import { stageTableData } from '../mocks/tableData';

export default function TransportPlanning() {
  const { solverOutputs, solverStatus, logs, expandedLog, setExpandedLog, selectedSolver, setSelectedSolver } = useSCM();
  const { routes, kpis } = solverOutputs.tp;
  const [activeTab, setActiveTab] = useState<'input' | 'output'>('output');

  const tableData = stageTableData.tp;
  const isRunning = solverStatus.tp === 'running';

  return (
    <div className="space-y-6">
      {/* Solver Selection & Tabs */}
      <div className="flex items-center justify-between">
        <SolverSelector
          options={solverOptions.tp}
          selectedId={selectedSolver.tp}
          onSelect={(id) => setSelectedSolver('tp', id)}
          disabled={isRunning}
        />
        <DataTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard
          label="Total Distance"
          value={kpis.totalDistance}
          suffix=" km"
          trend="down"
          trendValue="-45km"
        />
        <KPICard
          label="Vehicle Utilization"
          value={kpis.vehicleUtilization}
          suffix="%"
          trend="up"
          trendValue="+5%"
        />
        <KPICard
          label="On-Time Delivery"
          value={kpis.onTimeDelivery}
          suffix="%"
          trend="up"
          trendValue="+1.2%"
        />
        <KPICard
          label="Active Routes"
          value={routes.length}
          trend="neutral"
        />
      </div>

      {/* Main Content */}
      {activeTab === 'output' ? (
        <RouteMap data={routes} />
      ) : (
        <DataTable
          data={tableData.input}
          columns={tableData.inputColumns}
        />
      )}

      {/* Live Solver Log */}
      <LiveSolverLog
        stage="tp"
        logs={logs.tp}
        status={solverStatus.tp}
        isExpanded={expandedLog === 'tp'}
        onToggle={() => setExpandedLog(expandedLog === 'tp' ? null : 'tp')}
      />
    </div>
  );
}
```

**Step 2: TypeScript 컴파일 확인**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/pages/TransportPlanning.tsx
git commit -m "feat: add solver selection and data tabs to TransportPlanning"
```

---

### Task 13: Final Verification

**Step 1: 전체 빌드 확인**

Run: `npm run build`
Expected: Build successful

**Step 2: 린트 확인**

Run: `npm run lint`
Expected: No errors (warnings OK)

**Step 3: 개발 서버 확인**

Run: `npm run dev`
Expected: Server starts successfully

**Step 4: 기능 테스트 체크리스트**
- [ ] 각 페이지에서 솔버 드롭다운 표시됨
- [ ] 솔버 변경 후 Run 시 해당 솔버 로그 스트리밍됨
- [ ] Input 탭 클릭 시 테이블 표시됨
- [ ] Output 탭 클릭 시 시각화 표시됨
- [ ] 테이블 정렬 동작함
- [ ] 솔버 실행 중 드롭다운 비활성화됨

**Step 5: Commit**

```bash
git add -A
git commit -m "chore: final verification complete"
```
