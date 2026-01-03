# Dashboard Enhancement Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 대시보드 콘텐츠 강화 - 2열 레이아웃, 대시보드 진입점, 차트/테이블 토글, 파이프라인 요약 헤더, 타임라인 추가

**Architecture:** SCMContext에 activityLog 추가, Header에 진입점 추가, MainSolverView를 2열 레이아웃으로 변경, 새 컴포넌트(PipelineSummary, OutputPanel, ActivityTimeline) 생성

**Tech Stack:** React, TypeScript, Tailwind CSS, Lucide React

---

## Task 1: SCMContext에 Activity Log 추가

**Files:**
- Modify: `src/types/index.ts`
- Modify: `src/context/SCMContext.tsx`

**Step 1: types/index.ts에 ActivityEvent 타입 추가**

```typescript
// src/types/index.ts 끝에 추가
export interface ActivityEvent {
  id: string;
  stage: SolverStage;
  type: 'start' | 'complete';
  timestamp: Date;
}
```

**Step 2: SCMContext에 activityLog 상태 및 로직 추가**

```typescript
// SCMContextType 인터페이스에 추가
activityLog: ActivityEvent[];

// SCMProvider 내부에 상태 추가
const [activityLog, setActivityLog] = useState<ActivityEvent[]>([]);

// addActivityEvent 헬퍼 함수 추가
const addActivityEvent = useCallback((stage: SolverStage, type: 'start' | 'complete') => {
  const event: ActivityEvent = {
    id: `${stage}-${type}-${Date.now()}`,
    stage,
    type,
    timestamp: new Date(),
  };
  setActivityLog(prev => [event, ...prev].slice(0, 10)); // 최대 10개 유지
}, []);

// runSolver 함수 내부 수정 - 시작 시 이벤트 추가
// 기존: setSolverStatus(prev => ({ ...prev, [stage]: 'running' }));
// 다음 줄에 추가: addActivityEvent(stage, 'start');

// runSolver 함수 내부 수정 - 완료 시 이벤트 추가
// 기존: setSolverStatus(prev => ({ ...prev, [stage]: 'complete' }));
// 다음 줄에 추가: addActivityEvent(stage, 'complete');

// Provider value에 activityLog 추가
```

**Step 3: 빌드 확인**

Run: `npm run build`
Expected: 성공

**Step 4: Commit**

```bash
git add src/types/index.ts src/context/SCMContext.tsx
git commit -m "feat: add activity log to SCMContext"
```

---

## Task 2: Header에 대시보드 진입점 추가

**Files:**
- Modify: `src/components/layout/Header.tsx`

**Step 1: Header 수정**

```typescript
// 기존 import에 추가
import { Home } from 'lucide-react';

// Logo 섹션을 다음으로 교체
{/* Logo with Dashboard Link */}
<NavLink to="/" className="flex items-center gap-3 group">
  <div className={`
    p-2 rounded-lg transition-colors
    ${location.pathname === '/'
      ? 'bg-nexprime-cyan/20 text-nexprime-cyan'
      : 'text-white/40 hover:text-white/60 hover:bg-white/5'
    }
  `}>
    <Home size={20} />
  </div>
  <div className="flex items-center gap-2">
    <span className="text-nexprime-cyan font-bold text-xl tracking-wider group-hover:text-nexprime-cyan/80 transition-colors">
      NEXPRIME
    </span>
    <span className="text-white/60 text-sm group-hover:text-white/80 transition-colors">
      SCM
    </span>
  </div>
</NavLink>
```

**Step 2: 빌드 확인**

Run: `npm run build`
Expected: 성공

**Step 3: Commit**

```bash
git add src/components/layout/Header.tsx
git commit -m "feat: add dashboard entry points to header"
```

---

## Task 3: PipelineSummary 컴포넌트 생성

**Files:**
- Create: `src/components/dashboard/PipelineSummary.tsx`

**Step 1: 컴포넌트 생성**

```typescript
// src/components/dashboard/PipelineSummary.tsx
import { Play, Check, Circle, Loader2 } from 'lucide-react';
import { useSCM } from '../../context/SCMContext';
import { stageOrder } from '../../mocks/data';
import { SolverStage, SolverStatus } from '../../types';

const stageNames: Record<SolverStage, string> = {
  dp: 'DP',
  mp: 'MP',
  fp: 'FP',
  tp: 'TP',
};

const statusLabels: Record<SolverStatus, string> = {
  idle: '대기',
  running: '실행중',
  complete: '완료',
};

export default function PipelineSummary() {
  const { solverStatus, runAllSolvers, isRunningAll } = useSCM();

  const completedCount = stageOrder.filter(stage => solverStatus[stage] === 'complete').length;
  const progress = (completedCount / stageOrder.length) * 100;

  const getStatusIcon = (status: SolverStatus) => {
    switch (status) {
      case 'complete':
        return <Check size={14} className="text-green-400" />;
      case 'running':
        return <Loader2 size={14} className="text-nexprime-cyan animate-spin" />;
      default:
        return <Circle size={14} className="text-white/30" />;
    }
  };

  return (
    <div className="bg-nexprime-dark border border-nexprime-blue/30 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-medium">Pipeline Progress</h3>
        <button
          onClick={runAllSolvers}
          disabled={isRunningAll}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors
            ${!isRunningAll
              ? 'bg-gradient-to-r from-nexprime-cyan to-nexprime-blue text-nexprime-darker hover:opacity-90'
              : 'bg-white/10 text-white/30 cursor-not-allowed'
            }
          `}
        >
          <Play size={16} />
          {isRunningAll ? 'Running...' : 'Run All'}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-white/10 rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-nexprime-cyan to-nexprime-blue transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Stage Indicators */}
      <div className="flex items-center justify-between">
        {stageOrder.map((stage, index) => (
          <div key={stage} className="flex items-center">
            <div className="flex items-center gap-2">
              {getStatusIcon(solverStatus[stage])}
              <span className={`text-sm ${
                solverStatus[stage] === 'complete' ? 'text-green-400' :
                solverStatus[stage] === 'running' ? 'text-nexprime-cyan' :
                'text-white/50'
              }`}>
                {stageNames[stage]} ({statusLabels[solverStatus[stage]]})
              </span>
            </div>
            {index < stageOrder.length - 1 && (
              <div className={`w-8 h-0.5 mx-3 ${
                solverStatus[stage] === 'complete' ? 'bg-nexprime-cyan' : 'bg-white/20'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Step 2: 빌드 확인**

Run: `npm run build`
Expected: 성공

**Step 3: Commit**

```bash
git add src/components/dashboard/PipelineSummary.tsx
git commit -m "feat: add PipelineSummary component"
```

---

## Task 4: OutputPanel 컴포넌트 생성 (차트/테이블 토글)

**Files:**
- Create: `src/components/dashboard/OutputPanel.tsx`

**Step 1: 컴포넌트 생성**

```typescript
// src/components/dashboard/OutputPanel.tsx
import { useState } from 'react';
import { BarChart3, Table } from 'lucide-react';
import { SolverStage } from '../../types';
import { stageTableData } from '../../mocks/tableData';
import DataTable from '../common/DataTable';

// Stage별 차트 컴포넌트 import
import DPChart from '../charts/DPChart';
import MPChart from '../charts/MPChart';
import FPChart from '../charts/FPChart';
import TPChart from '../charts/TPChart';

interface OutputPanelProps {
  stage: SolverStage;
}

const chartComponents: Record<SolverStage, React.ComponentType> = {
  dp: DPChart,
  mp: MPChart,
  fp: FPChart,
  tp: TPChart,
};

export default function OutputPanel({ stage }: OutputPanelProps) {
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');

  const ChartComponent = chartComponents[stage];
  const tableData = stageTableData[stage].output;

  return (
    <div className="bg-nexprime-dark border border-nexprime-blue/30 rounded-lg overflow-hidden h-80">
      {/* Header with Toggle */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-nexprime-blue/20">
        <span className="text-white/70 text-sm font-medium">Output</span>
        <div className="flex gap-1">
          <button
            onClick={() => setViewMode('chart')}
            className={`p-1.5 rounded transition-colors ${
              viewMode === 'chart'
                ? 'bg-nexprime-cyan/20 text-nexprime-cyan'
                : 'text-white/40 hover:text-white/60'
            }`}
            title="Chart View"
          >
            <BarChart3 size={16} />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded transition-colors ${
              viewMode === 'table'
                ? 'bg-nexprime-cyan/20 text-nexprime-cyan'
                : 'text-white/40 hover:text-white/60'
            }`}
            title="Table View"
          >
            <Table size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 h-[calc(100%-44px)] overflow-auto">
        {viewMode === 'chart' ? (
          <ChartComponent />
        ) : (
          <DataTable
            columns={tableData.columns}
            data={tableData.rows}
            maxHeight="100%"
          />
        )}
      </div>
    </div>
  );
}
```

**Step 2: 빌드 확인**

Run: `npm run build`
Expected: 성공

**Step 3: Commit**

```bash
git add src/components/dashboard/OutputPanel.tsx
git commit -m "feat: add OutputPanel with chart/table toggle"
```

---

## Task 5: ActivityTimeline 컴포넌트 생성

**Files:**
- Create: `src/components/dashboard/ActivityTimeline.tsx`

**Step 1: 컴포넌트 생성**

```typescript
// src/components/dashboard/ActivityTimeline.tsx
import { Play, Check, Loader2 } from 'lucide-react';
import { useSCM } from '../../context/SCMContext';
import { ActivityEvent, SolverStage } from '../../types';

const stageNames: Record<SolverStage, string> = {
  dp: 'DP',
  mp: 'MP',
  fp: 'FP',
  tp: 'TP',
};

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);

  if (diffSec < 10) return '방금 전';
  if (diffSec < 60) return `${diffSec}초 전`;
  if (diffMin < 60) return `${diffMin}분 전`;
  return `${Math.floor(diffMin / 60)}시간 전`;
}

function getEventIcon(event: ActivityEvent, isLatestStart: boolean) {
  if (event.type === 'complete') {
    return <Check size={14} className="text-green-400" />;
  }
  if (isLatestStart) {
    return <Loader2 size={14} className="text-nexprime-cyan animate-spin" />;
  }
  return <Play size={14} className="text-nexprime-cyan" />;
}

export default function ActivityTimeline() {
  const { activityLog, solverStatus } = useSCM();

  // 최근 5개만 표시
  const recentEvents = activityLog.slice(0, 5);

  // 현재 실행 중인 stage 확인
  const runningStage = Object.entries(solverStatus).find(
    ([, status]) => status === 'running'
  )?.[0] as SolverStage | undefined;

  if (recentEvents.length === 0) {
    return (
      <div className="bg-nexprime-dark border border-nexprime-blue/30 rounded-lg p-3">
        <h4 className="text-white/70 text-sm font-medium mb-2">Recent Activity</h4>
        <p className="text-white/30 text-xs">아직 활동이 없습니다</p>
      </div>
    );
  }

  return (
    <div className="bg-nexprime-dark border border-nexprime-blue/30 rounded-lg p-3">
      <h4 className="text-white/70 text-sm font-medium mb-3">Recent Activity</h4>
      <div className="space-y-3">
        {recentEvents.map((event, index) => {
          const isLatestStart = event.type === 'start' &&
            event.stage === runningStage &&
            index === 0;

          return (
            <div key={event.id} className="flex items-start gap-2">
              <div className="mt-0.5">
                {getEventIcon(event, isLatestStart)}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${
                  event.type === 'complete' ? 'text-green-400' : 'text-nexprime-cyan'
                }`}>
                  {stageNames[event.stage]} {event.type === 'start' ? '시작' : '완료'}
                </p>
                <p className="text-white/30 text-xs">
                  {getRelativeTime(event.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

**Step 2: 빌드 확인**

Run: `npm run build`
Expected: 성공

**Step 3: Commit**

```bash
git add src/components/dashboard/ActivityTimeline.tsx
git commit -m "feat: add ActivityTimeline component"
```

---

## Task 6: MainSolverView 2열 레이아웃으로 수정

**Files:**
- Modify: `src/components/dashboard/MainSolverView.tsx`

**Step 1: MainSolverView 전체 교체**

```typescript
// src/components/dashboard/MainSolverView.tsx
import { Play } from 'lucide-react';
import { SolverStage } from '../../types';
import { useSCM } from '../../context/SCMContext';
import { stageLabels } from '../../mocks/data';
import { solverOptions } from '../../mocks/solvers';
import CompactKPIs from './CompactKPIs';
import OutputPanel from './OutputPanel';
import LiveSolverLog from '../common/LiveSolverLog';

interface MainSolverViewProps {
  stage: SolverStage;
}

export default function MainSolverView({ stage }: MainSolverViewProps) {
  const { solverStatus, logs, runSolver, canRunSolver, selectedSolver } = useSCM();

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

      {/* Two Column Layout: Chart/Table + Log */}
      <div className="grid grid-cols-2 gap-4">
        {/* Left: Output Panel (Chart/Table) */}
        <OutputPanel stage={stage} />

        {/* Right: Live Log */}
        <div className="h-80">
          <LiveSolverLog
            stage={stage}
            logs={logs[stage]}
            status={status}
            isExpanded={true}
            onToggle={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
```

**Step 2: 빌드 확인**

Run: `npm run build`
Expected: 성공

**Step 3: Commit**

```bash
git add src/components/dashboard/MainSolverView.tsx
git commit -m "feat: update MainSolverView to 2-column layout"
```

---

## Task 7: Dashboard 페이지 수정

**Files:**
- Modify: `src/pages/Dashboard.tsx`

**Step 1: Dashboard에 PipelineSummary와 ActivityTimeline 추가**

```typescript
// src/pages/Dashboard.tsx
import { useState, useEffect } from 'react';
import { SolverStage } from '../types';
import { useSCM } from '../context/SCMContext';
import { stageOrder } from '../mocks/data';
import PipelineSummary from '../components/dashboard/PipelineSummary';
import SolverCard from '../components/dashboard/SolverCard';
import MainSolverView from '../components/dashboard/MainSolverView';
import ActivityTimeline from '../components/dashboard/ActivityTimeline';

export default function Dashboard() {
  const {
    solverStatus,
    logs,
    runSolver,
    canRunSolver,
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
      {/* Pipeline Summary Header */}
      <PipelineSummary />

      {/* Main Layout */}
      <div className="flex gap-4 h-[calc(100%-100px)]">
        {/* Main Area */}
        <div className="flex-1 min-w-0">
          <MainSolverView stage={selectedStage} />
        </div>

        {/* Sidebar */}
        <div className="w-64 flex flex-col gap-3 flex-shrink-0">
          {/* Solver Cards */}
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

          {/* Activity Timeline */}
          <div className="mt-auto">
            <ActivityTimeline />
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: 빌드 확인**

Run: `npm run build`
Expected: 성공

**Step 3: Commit**

```bash
git add src/pages/Dashboard.tsx
git commit -m "feat: integrate PipelineSummary and ActivityTimeline in Dashboard"
```

---

## Task 8: Final Verification

**Step 1: Build 확인**

Run: `npm run build`
Expected: 성공, 에러 없음

**Step 2: Lint 확인**

Run: `npm run lint`
Expected: 에러 없음 (warning은 허용)

**Step 3: Dev Server 테스트**

Run: `timeout 5 npm run dev`
Expected: 서버 시작 성공

**Step 4: 기능 체크리스트**
- [ ] 로고 클릭 시 대시보드로 이동
- [ ] 홈 아이콘 클릭 시 대시보드로 이동
- [ ] 파이프라인 요약 헤더 표시
- [ ] Run All 버튼 동작
- [ ] 차트/테이블 토글 동작
- [ ] 2열 레이아웃 (차트 + 로그)
- [ ] 타임라인 표시
- [ ] 솔버 실행 시 타임라인 업데이트
