# Comprehensive Dashboard Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 전체 솔버 흐름을 한 화면에서 확인하고 실행할 수 있는 종합 대시보드 구현

**Architecture:** Dashboard 페이지를 홈(/)으로 설정. 메인+사이드 레이아웃으로 선택된 솔버를 크게 표시, 나머지는 사이드바에 축소형으로 표시. SCMContext에 runAllSolvers 기능 추가.

**Tech Stack:** React, TypeScript, Tailwind CSS

---

### Task 1: SCMContext에 runAllSolvers 기능 추가

**Files:**
- Modify: `src/context/SCMContext.tsx`

**Step 1: SCMContextType 인터페이스 확장**

```typescript
// 기존 인터페이스에 추가
interface SCMContextType {
  // ... existing ...
  runAllSolvers: () => void;
  isRunningAll: boolean;
}
```

**Step 2: 상태 및 함수 추가**

```typescript
const [isRunningAll, setIsRunningAll] = useState(false);

const runAllSolvers = useCallback(() => {
  if (isRunningAll) return;

  setIsRunningAll(true);

  const stages: SolverStage[] = ['dp', 'mp', 'fp', 'tp'];
  let currentIndex = 0;

  const runNextStage = () => {
    if (currentIndex >= stages.length) {
      setIsRunningAll(false);
      return;
    }

    const stage = stages[currentIndex];

    // Set up completion listener
    const checkCompletion = setInterval(() => {
      // We need to check via ref since state might be stale
      if (!runningRef.current[stage]) {
        clearInterval(checkCompletion);
        currentIndex++;
        setTimeout(runNextStage, 500); // Small delay before next
      }
    }, 100);

    runSolver(stage);
  };

  runNextStage();
}, [isRunningAll, runSolver]);
```

**Step 3: Provider value에 추가**

```typescript
value={{
  // ... existing ...
  runAllSolvers,
  isRunningAll,
}}
```

**Step 4: TypeScript 컴파일 확인**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 5: Commit**

```bash
git add src/context/SCMContext.tsx
git commit -m "feat: add runAllSolvers functionality to SCMContext"
```

---

### Task 2: SolverCard 컴포넌트 (사이드바용)

**Files:**
- Create: `src/components/dashboard/SolverCard.tsx`

**Step 1: 컴포넌트 구현**

```typescript
// src/components/dashboard/SolverCard.tsx
import { Play } from 'lucide-react';
import { SolverStage, SolverStatus, LogEntry } from '../../types';
import { stageLabels } from '../../mocks/data';

interface SolverCardProps {
  stage: SolverStage;
  status: SolverStatus;
  logs: LogEntry[];
  isSelected: boolean;
  canRun: boolean;
  onSelect: () => void;
  onRun: () => void;
}

const statusColors = {
  idle: 'bg-white/40',
  running: 'bg-nexprime-cyan animate-pulse',
  complete: 'bg-green-400',
};

export default function SolverCard({
  stage,
  status,
  logs,
  isSelected,
  canRun,
  onSelect,
  onRun,
}: SolverCardProps) {
  const recentLogs = logs.slice(-3);

  return (
    <div
      onClick={onSelect}
      className={`
        p-3 rounded-lg border cursor-pointer transition-all
        ${isSelected
          ? 'border-nexprime-cyan bg-nexprime-blue/20'
          : 'border-nexprime-blue/30 bg-nexprime-dark hover:border-nexprime-blue/50'
        }
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${statusColors[status]}`} />
          <span className="text-white font-medium text-sm">
            {stage.toUpperCase()}
          </span>
        </div>
        <span className="text-white/40 text-xs">
          {stageLabels[stage]}
        </span>
      </div>

      {/* Log Preview */}
      <div className="bg-nexprime-darker rounded p-2 mb-2 h-16 overflow-hidden">
        {recentLogs.length > 0 ? (
          <div className="space-y-0.5">
            {recentLogs.map((log) => (
              <div key={log.id} className="text-xs font-mono text-white/60 truncate">
                [{log.level}] {log.message}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-white/30 italic">No logs yet</div>
        )}
      </div>

      {/* Run Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRun();
        }}
        disabled={!canRun || status === 'running'}
        className={`
          w-full flex items-center justify-center gap-1 py-1.5 rounded text-xs font-medium transition-colors
          ${canRun && status !== 'running'
            ? 'bg-nexprime-cyan/20 text-nexprime-cyan hover:bg-nexprime-cyan/30'
            : 'bg-white/5 text-white/30 cursor-not-allowed'
          }
        `}
      >
        <Play size={12} />
        Run
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
git add src/components/dashboard/SolverCard.tsx
git commit -m "feat: add SolverCard component for dashboard sidebar"
```

---

### Task 3: CompactKPIs 컴포넌트

**Files:**
- Create: `src/components/dashboard/CompactKPIs.tsx`

**Step 1: 컴포넌트 구현**

```typescript
// src/components/dashboard/CompactKPIs.tsx
import { SolverStage } from '../../types';
import { useSCM } from '../../context/SCMContext';

interface CompactKPIsProps {
  stage: SolverStage;
}

export default function CompactKPIs({ stage }: CompactKPIsProps) {
  const { solverOutputs } = useSCM();

  const kpiConfigs: Record<SolverStage, { label: string; value: number | string; suffix: string }[]> = {
    dp: [
      { label: 'Accuracy', value: solverOutputs.dp.kpis.accuracy, suffix: '%' },
      { label: 'Coverage', value: solverOutputs.dp.kpis.coverage, suffix: '%' },
      { label: 'MAPE', value: solverOutputs.dp.kpis.mape, suffix: '%' },
    ],
    mp: [
      { label: 'Service', value: solverOutputs.mp.kpis.serviceLevel, suffix: '%' },
      { label: 'Turns', value: solverOutputs.mp.kpis.inventoryTurns, suffix: 'x' },
      { label: 'Fill', value: solverOutputs.mp.kpis.fillRate, suffix: '%' },
    ],
    fp: [
      { label: 'OEE', value: solverOutputs.fp.kpis.oee, suffix: '%' },
      { label: 'Setup', value: solverOutputs.fp.kpis.setupTime, suffix: 'm' },
      { label: 'Thru', value: solverOutputs.fp.kpis.throughput, suffix: '' },
    ],
    tp: [
      { label: 'Dist', value: solverOutputs.tp.kpis.totalDistance, suffix: 'km' },
      { label: 'Util', value: solverOutputs.tp.kpis.vehicleUtilization, suffix: '%' },
      { label: 'OTD', value: solverOutputs.tp.kpis.onTimeDelivery, suffix: '%' },
    ],
  };

  const kpis = kpiConfigs[stage];

  return (
    <div className="flex gap-3">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className="flex-1 bg-nexprime-dark border border-nexprime-blue/30 rounded-lg p-3 text-center"
        >
          <div className="text-nexprime-cyan text-lg font-bold">
            {kpi.value}{kpi.suffix}
          </div>
          <div className="text-white/50 text-xs">{kpi.label}</div>
        </div>
      ))}
    </div>
  );
}
```

**Step 2: TypeScript 컴파일 확인**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/components/dashboard/CompactKPIs.tsx
git commit -m "feat: add CompactKPIs component for dashboard"
```

---

### Task 4: CompactVisualization 컴포넌트

**Files:**
- Create: `src/components/dashboard/CompactVisualization.tsx`

**Step 1: 컴포넌트 구현**

```typescript
// src/components/dashboard/CompactVisualization.tsx
import { SolverStage } from '../../types';
import { useSCM } from '../../context/SCMContext';
import ForecastChart from '../visualizations/ForecastChart';
import SupplyDemandChart from '../visualizations/SupplyDemandChart';
import GanttChart from '../visualizations/GanttChart';
import RouteMap from '../visualizations/RouteMap';

interface CompactVisualizationProps {
  stage: SolverStage;
}

export default function CompactVisualization({ stage }: CompactVisualizationProps) {
  const { solverOutputs } = useSCM();

  return (
    <div className="h-40 overflow-hidden">
      {stage === 'dp' && <ForecastChart data={solverOutputs.dp.forecasts} />}
      {stage === 'mp' && <SupplyDemandChart data={solverOutputs.mp.plans} />}
      {stage === 'fp' && <GanttChart data={solverOutputs.fp.schedule} />}
      {stage === 'tp' && <RouteMap data={solverOutputs.tp.routes} />}
    </div>
  );
}
```

**Step 2: TypeScript 컴파일 확인**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/components/dashboard/CompactVisualization.tsx
git commit -m "feat: add CompactVisualization component for dashboard"
```

---

### Task 5: MainSolverView 컴포넌트

**Files:**
- Create: `src/components/dashboard/MainSolverView.tsx`

**Step 1: 컴포넌트 구현**

```typescript
// src/components/dashboard/MainSolverView.tsx
import { Play } from 'lucide-react';
import { SolverStage } from '../../types';
import { useSCM } from '../../context/SCMContext';
import { stageLabels } from '../../mocks/data';
import { solverOptions } from '../../mocks/solvers';
import CompactKPIs from './CompactKPIs';
import CompactVisualization from './CompactVisualization';
import LiveSolverLog from '../common/LiveSolverLog';

interface MainSolverViewProps {
  stage: SolverStage;
}

export default function MainSolverView({ stage }: MainSolverViewProps) {
  const { solverStatus, logs, runSolver, canRunSolver, selectedSolver, expandedLog, setExpandedLog } = useSCM();

  const status = solverStatus[stage];
  const currentSolver = solverOptions[stage].find(s => s.id === selectedSolver[stage]);
  const canRun = canRunSolver(stage);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-xl font-bold">
            {stage.toUpperCase()} - {stageLabels[stage]}
          </h2>
          <p className="text-white/50 text-sm">
            Solver: {currentSolver?.name || 'Unknown'}
          </p>
        </div>
        <button
          onClick={() => runSolver(stage)}
          disabled={!canRun || status === 'running'}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
            ${canRun && status !== 'running'
              ? 'bg-nexprime-cyan text-nexprime-darker hover:bg-nexprime-cyan/80'
              : 'bg-white/10 text-white/30 cursor-not-allowed'
            }
          `}
        >
          <Play size={16} />
          Run {stage.toUpperCase()}
        </button>
      </div>

      {/* Compact KPIs */}
      <CompactKPIs stage={stage} />

      {/* Compact Visualization */}
      <div className="bg-nexprime-dark border border-nexprime-blue/30 rounded-lg p-3">
        <CompactVisualization stage={stage} />
      </div>

      {/* Large Log Area */}
      <div className="flex-1">
        <LiveSolverLog
          stage={stage}
          logs={logs[stage]}
          status={status}
          isExpanded={true}
          onToggle={() => {}}
        />
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
git add src/components/dashboard/MainSolverView.tsx
git commit -m "feat: add MainSolverView component for dashboard"
```

---

### Task 6: Dashboard 페이지 생성

**Files:**
- Create: `src/pages/Dashboard.tsx`

**Step 1: 페이지 구현**

```typescript
// src/pages/Dashboard.tsx
import { useState, useEffect } from 'react';
import { Play } from 'lucide-react';
import { SolverStage } from '../types';
import { useSCM } from '../context/SCMContext';
import { stageOrder } from '../mocks/data';
import SolverCard from '../components/dashboard/SolverCard';
import MainSolverView from '../components/dashboard/MainSolverView';

export default function Dashboard() {
  const {
    solverStatus,
    logs,
    runSolver,
    canRunSolver,
    runAllSolvers,
    isRunningAll,
  } = useSCM();

  const [selectedStage, setSelectedStage] = useState<SolverStage>('dp');

  // Auto-switch to running solver
  useEffect(() => {
    const runningStage = stageOrder.find(stage => solverStatus[stage] === 'running');
    if (runningStage) {
      setSelectedStage(runningStage);
    }
  }, [solverStatus]);

  const sidebarStages = stageOrder.filter(stage => stage !== selectedStage);

  return (
    <div className="h-[calc(100vh-120px)]">
      {/* Run All Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={runAllSolvers}
          disabled={isRunningAll}
          className={`
            flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors
            ${!isRunningAll
              ? 'bg-gradient-to-r from-nexprime-cyan to-nexprime-blue text-nexprime-darker hover:opacity-90'
              : 'bg-white/10 text-white/30 cursor-not-allowed'
            }
          `}
        >
          <Play size={18} />
          {isRunningAll ? 'Running Pipeline...' : 'Run All Pipeline'}
        </button>
      </div>

      {/* Main Layout */}
      <div className="flex gap-4 h-full">
        {/* Main Area */}
        <div className="flex-1 min-w-0">
          <MainSolverView stage={selectedStage} />
        </div>

        {/* Sidebar */}
        <div className="w-64 space-y-3 flex-shrink-0">
          {sidebarStages.map(stage => (
            <SolverCard
              key={stage}
              stage={stage}
              status={solverStatus[stage]}
              logs={logs[stage]}
              isSelected={false}
              canRun={canRunSolver(stage)}
              onSelect={() => setSelectedStage(stage)}
              onRun={() => runSolver(stage)}
            />
          ))}
        </div>
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
git add src/pages/Dashboard.tsx
git commit -m "feat: add Dashboard page"
```

---

### Task 7: 라우팅 업데이트 (App.tsx)

**Files:**
- Modify: `src/App.tsx`

**Step 1: Dashboard import 및 라우트 변경**

```typescript
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SCMProvider } from './context/SCMContext';
import Header from './components/layout/Header';
import FloatingRunButton from './components/layout/FloatingRunButton';
import Dashboard from './pages/Dashboard';
import DemandPlanning from './pages/DemandPlanning';
import MasterPlanning from './pages/MasterPlanning';
import FactoryPlanning from './pages/FactoryPlanning';
import TransportPlanning from './pages/TransportPlanning';

function App() {
  return (
    <SCMProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-nexprime-darker">
          <Header />
          <main className="container mx-auto px-4 py-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dp" element={<DemandPlanning />} />
              <Route path="/mp" element={<MasterPlanning />} />
              <Route path="/fp" element={<FactoryPlanning />} />
              <Route path="/tp" element={<TransportPlanning />} />
            </Routes>
          </main>
          <FloatingRunButton />
        </div>
      </BrowserRouter>
    </SCMProvider>
  );
}

export default App;
```

**Step 2: TypeScript 컴파일 확인**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat: update routing - Dashboard as home page"
```

---

### Task 8: Final Verification

**Step 1: 전체 빌드 확인**

Run: `npm run build`
Expected: Build successful

**Step 2: 린트 확인**

Run: `npm run lint`
Expected: No errors (warnings OK)

**Step 3: 개발 서버 확인**

Run: `npm run dev`
Expected: Server starts, Dashboard shows at http://localhost:5173/

**Step 4: 기능 테스트 체크리스트**
- [ ] 홈(/)에서 Dashboard 표시됨
- [ ] 사이드바 카드 클릭 시 메인 전환
- [ ] Run All 클릭 시 DP→MP→FP→TP 순차 실행
- [ ] 실행 중인 솔버로 자동 전환
- [ ] 각 개별 Run 버튼 동작
- [ ] /dp, /mp, /fp, /tp 기존 페이지 정상 동작

**Step 5: Commit**

```bash
git add -A
git commit -m "chore: final verification complete"
```
