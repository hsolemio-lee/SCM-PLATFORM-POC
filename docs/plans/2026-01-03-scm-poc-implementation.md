# Nexprime SCM POC Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a React frontend POC demonstrating SCM solver data flow (DP → MP → FP → TP) with live streaming logs and visualizations.

**Architecture:** Single-page React app with React Router for stage navigation, React Context for global state, and mock data simulating solver outputs. Each stage dashboard shows KPIs, a visualization chart, and a terminal-style log viewer.

**Tech Stack:** React 18 + Vite + TypeScript, Tailwind CSS, Shadcn UI, Recharts, Framer Motion, Lucide React

---

## Task 1: Project Scaffold

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/index.css`

**Step 1: Initialize Vite React TypeScript project**

Run:
```bash
npm create vite@latest . -- --template react-ts
```

Expected: Project files created, prompts may ask to overwrite - accept.

**Step 2: Install dependencies**

Run:
```bash
npm install react-router-dom recharts framer-motion lucide-react clsx tailwind-merge
npm install -D tailwindcss postcss autoprefixer @types/node
npx tailwindcss init -p
```

Expected: Dependencies installed, tailwind.config.js created.

**Step 3: Configure Tailwind**

Replace `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nexprime': {
          'cyan': '#00FFFF',
          'cyan-dim': '#0088AA',
          'blue': '#1e3a5f',
          'dark': '#0a0a0f',
          'darker': '#050508',
        }
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
      }
    },
  },
  plugins: [],
}
```

**Step 4: Configure base CSS**

Replace `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
}

body {
  @apply bg-nexprime-darker text-white min-h-screen;
}
```

**Step 5: Verify setup**

Run:
```bash
npm run dev
```

Expected: Dev server starts at localhost:5173, page loads with default Vite content.

**Step 6: Commit**

Run:
```bash
git add -A && git commit -m "chore: initialize Vite React TypeScript project with Tailwind"
```

---

## Task 2: Project Structure Setup

**Files:**
- Create: `src/context/SCMContext.tsx`
- Create: `src/components/layout/Header.tsx`
- Create: `src/components/layout/FloatingRunButton.tsx`
- Create: `src/components/common/KPICard.tsx`
- Create: `src/components/common/LiveSolverLog.tsx`
- Create: `src/pages/DemandPlanning.tsx`
- Create: `src/pages/MasterPlanning.tsx`
- Create: `src/pages/FactoryPlanning.tsx`
- Create: `src/pages/TransportPlanning.tsx`
- Create: `src/mocks/data.ts`
- Create: `src/mocks/logs.ts`
- Create: `src/types/index.ts`

**Step 1: Create folder structure**

Run:
```bash
mkdir -p src/context src/components/layout src/components/common src/components/visualizations src/pages src/mocks src/types
```

**Step 2: Create types file**

Create `src/types/index.ts`:

```typescript
export type SolverStage = 'dp' | 'mp' | 'fp' | 'tp';
export type SolverStatus = 'idle' | 'running' | 'complete';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
}

export interface DemandForecast {
  month: string;
  product: string;
  forecast: number;
  actual: number;
  confidence: number;
}

export interface MasterPlanItem {
  plant: string;
  supply: number;
  demand: number;
  gap: number;
  utilization: number;
}

export interface ProductionScheduleItem {
  id: string;
  line: string;
  product: string;
  start: string;
  end: string;
  quantity: number;
  color: string;
}

export interface TransportRoute {
  vehicle: string;
  stops: string[];
  distance: number;
  load: number;
  coordinates: { lat: number; lng: number }[];
}

export interface SolverKPIs {
  dp: { accuracy: number; coverage: number; mape: number };
  mp: { serviceLevel: number; inventoryTurns: number; fillRate: number };
  fp: { oee: number; setupTime: number; throughput: number };
  tp: { totalDistance: number; vehicleUtilization: number; onTimeDelivery: number };
}

export interface SolverOutputs {
  dp: { forecasts: DemandForecast[]; kpis: SolverKPIs['dp'] };
  mp: { plans: MasterPlanItem[]; kpis: SolverKPIs['mp'] };
  fp: { schedule: ProductionScheduleItem[]; kpis: SolverKPIs['fp'] };
  tp: { routes: TransportRoute[]; kpis: SolverKPIs['tp'] };
}
```

**Step 3: Create placeholder files**

Create empty placeholder files for each component:

`src/context/SCMContext.tsx`:
```typescript
export {}; // Placeholder
```

`src/components/layout/Header.tsx`:
```typescript
export default function Header() {
  return <header>Header</header>;
}
```

`src/components/layout/FloatingRunButton.tsx`:
```typescript
export default function FloatingRunButton() {
  return <button>Run</button>;
}
```

`src/components/common/KPICard.tsx`:
```typescript
export default function KPICard() {
  return <div>KPI</div>;
}
```

`src/components/common/LiveSolverLog.tsx`:
```typescript
export default function LiveSolverLog() {
  return <div>Log</div>;
}
```

`src/pages/DemandPlanning.tsx`:
```typescript
export default function DemandPlanning() {
  return <div>Demand Planning</div>;
}
```

`src/pages/MasterPlanning.tsx`:
```typescript
export default function MasterPlanning() {
  return <div>Master Planning</div>;
}
```

`src/pages/FactoryPlanning.tsx`:
```typescript
export default function FactoryPlanning() {
  return <div>Factory Planning</div>;
}
```

`src/pages/TransportPlanning.tsx`:
```typescript
export default function TransportPlanning() {
  return <div>Transport Planning</div>;
}
```

`src/mocks/data.ts`:
```typescript
export {}; // Placeholder
```

`src/mocks/logs.ts`:
```typescript
export {}; // Placeholder
```

**Step 4: Commit**

Run:
```bash
git add -A && git commit -m "chore: add project folder structure and placeholder files"
```

---

## Task 3: Mock Data

**Files:**
- Modify: `src/mocks/data.ts`
- Modify: `src/mocks/logs.ts`

**Step 1: Create mock solver outputs**

Replace `src/mocks/data.ts`:

```typescript
import { SolverOutputs } from '../types';

export const mockSolverOutputs: SolverOutputs = {
  dp: {
    forecasts: [
      { month: 'Jan', product: 'SKU-001', forecast: 1200, actual: 1150, confidence: 0.92 },
      { month: 'Feb', product: 'SKU-001', forecast: 1350, actual: 1380, confidence: 0.89 },
      { month: 'Mar', product: 'SKU-001', forecast: 1500, actual: 1420, confidence: 0.91 },
      { month: 'Apr', product: 'SKU-001', forecast: 1400, actual: 1450, confidence: 0.88 },
      { month: 'May', product: 'SKU-001', forecast: 1600, actual: 1580, confidence: 0.93 },
      { month: 'Jun', product: 'SKU-001', forecast: 1750, actual: 1700, confidence: 0.90 },
      { month: 'Jul', product: 'SKU-001', forecast: 1800, actual: 1850, confidence: 0.87 },
      { month: 'Aug', product: 'SKU-001', forecast: 1650, actual: 1620, confidence: 0.91 },
      { month: 'Sep', product: 'SKU-001', forecast: 1550, actual: 1500, confidence: 0.89 },
      { month: 'Oct', product: 'SKU-001', forecast: 1700, actual: 1680, confidence: 0.92 },
      { month: 'Nov', product: 'SKU-001', forecast: 1900, actual: 1950, confidence: 0.88 },
      { month: 'Dec', product: 'SKU-001', forecast: 2100, actual: 2050, confidence: 0.90 },
    ],
    kpis: { accuracy: 94.2, coverage: 100, mape: 5.8 },
  },
  mp: {
    plans: [
      { plant: 'Plant A', supply: 5000, demand: 4800, gap: 200, utilization: 0.96 },
      { plant: 'Plant B', supply: 3500, demand: 3800, gap: -300, utilization: 1.08 },
      { plant: 'Plant C', supply: 4200, demand: 4000, gap: 200, utilization: 0.95 },
      { plant: 'Plant D', supply: 2800, demand: 2600, gap: 200, utilization: 0.93 },
    ],
    kpis: { serviceLevel: 98.1, inventoryTurns: 12.4, fillRate: 97.5 },
  },
  fp: {
    schedule: [
      { id: '1', line: 'Line 1', product: 'SKU-001', start: '06:00', end: '10:30', quantity: 500, color: '#00FFFF' },
      { id: '2', line: 'Line 1', product: 'SKU-002', start: '11:00', end: '14:00', quantity: 300, color: '#0088AA' },
      { id: '3', line: 'Line 1', product: 'SKU-003', start: '14:30', end: '18:00', quantity: 400, color: '#1e3a5f' },
      { id: '4', line: 'Line 2', product: 'SKU-002', start: '06:00', end: '09:30', quantity: 350, color: '#0088AA' },
      { id: '5', line: 'Line 2', product: 'SKU-001', start: '10:00', end: '15:00', quantity: 600, color: '#00FFFF' },
      { id: '6', line: 'Line 2', product: 'SKU-004', start: '15:30', end: '18:00', quantity: 250, color: '#4FFFFF' },
      { id: '7', line: 'Line 3', product: 'SKU-003', start: '06:00', end: '12:00', quantity: 700, color: '#1e3a5f' },
      { id: '8', line: 'Line 3', product: 'SKU-001', start: '12:30', end: '18:00', quantity: 650, color: '#00FFFF' },
    ],
    kpis: { oee: 87.3, setupTime: 45, throughput: 2400 },
  },
  tp: {
    routes: [
      {
        vehicle: 'V01',
        stops: ['Warehouse', 'Customer A', 'Customer B', 'Customer C'],
        distance: 124,
        load: 0.85,
        coordinates: [
          { lat: 37.5665, lng: 126.9780 },
          { lat: 37.5100, lng: 127.0300 },
          { lat: 37.4800, lng: 127.0500 },
          { lat: 37.4500, lng: 127.1000 },
        ],
      },
      {
        vehicle: 'V02',
        stops: ['Warehouse', 'Customer D', 'Customer E'],
        distance: 98,
        load: 0.72,
        coordinates: [
          { lat: 37.5665, lng: 126.9780 },
          { lat: 37.5900, lng: 126.9200 },
          { lat: 37.6200, lng: 126.8800 },
        ],
      },
      {
        vehicle: 'V03',
        stops: ['Warehouse', 'Customer F', 'Customer G', 'Customer H', 'Customer I'],
        distance: 156,
        load: 0.91,
        coordinates: [
          { lat: 37.5665, lng: 126.9780 },
          { lat: 37.5400, lng: 126.9500 },
          { lat: 37.5200, lng: 126.9000 },
          { lat: 37.4900, lng: 126.8500 },
          { lat: 37.4600, lng: 126.8200 },
        ],
      },
    ],
    kpis: { totalDistance: 450, vehicleUtilization: 89, onTimeDelivery: 96.2 },
  },
};

export const stageLabels: Record<string, string> = {
  dp: 'Demand Planning',
  mp: 'Master Planning',
  fp: 'Factory Planning',
  tp: 'Transport Planning',
};

export const stageOrder: ('dp' | 'mp' | 'fp' | 'tp')[] = ['dp', 'mp', 'fp', 'tp'];
```

**Step 2: Create mock log messages**

Replace `src/mocks/logs.ts`:

```typescript
export const solverLogMessages: Record<string, string[]> = {
  dp: [
    '[INFO] Initializing demand sensing module...',
    '[INFO] Loading 24 months of historical sales data...',
    '[INFO] Data loaded: 2,847 SKU records across 12 regions',
    '[WARN] Missing data detected for APAC-3 region, applying interpolation...',
    '[INFO] Preprocessing complete. Starting feature extraction...',
    '[INFO] Extracting seasonality patterns...',
    '[INFO] Detecting promotional effects...',
    '[INFO] AI Model Training... Epoch 1/10... Loss: 0.142',
    '[INFO] AI Model Training... Epoch 2/10... Loss: 0.098',
    '[INFO] AI Model Training... Epoch 3/10... Loss: 0.067',
    '[INFO] AI Model Training... Epoch 4/10... Loss: 0.045',
    '[INFO] AI Model Training... Epoch 5/10... Loss: 0.032',
    '[INFO] AI Model Training... Epoch 6/10... Loss: 0.028',
    '[INFO] AI Model Training... Epoch 7/10... Loss: 0.025',
    '[INFO] AI Model Training... Epoch 8/10... Loss: 0.024',
    '[INFO] AI Model Training... Epoch 9/10... Loss: 0.023',
    '[INFO] AI Model Training... Epoch 10/10... Loss: 0.022',
    '[INFO] Model validation complete. MAPE: 5.8%',
    '[INFO] Generating forecasts for next 12 months...',
    '[INFO] Demand sensing analysis completed successfully.',
    '[INFO] Output: 12 monthly forecasts generated with 94.2% accuracy',
  ],
  mp: [
    '[INFO] Master Planning solver initializing...',
    '[INFO] Loading demand forecasts from DP module...',
    '[INFO] Demand data received: 12 forecasts across 4 product families',
    '[INFO] Loading plant capacity constraints...',
    '[INFO] Loading inventory policies...',
    '[INFO] Building supply-demand balance model...',
    '[INFO] Balancing Supply and Demand for Plant A...',
    '[INFO] Balancing Supply and Demand for Plant B...',
    '[WARN] Plant B capacity exceeded by 8%. Evaluating alternatives...',
    '[INFO] Balancing Supply and Demand for Plant C...',
    '[INFO] Balancing Supply and Demand for Plant D...',
    '[INFO] Resolving resource constraints...',
    '[INFO] Optimizing inventory positions...',
    '[INFO] Running linear programming solver...',
    '[INFO] LP iteration 1/50... Objective: 1,245,000',
    '[INFO] LP iteration 25/50... Objective: 987,000',
    '[INFO] LP iteration 50/50... Objective: 892,000',
    '[INFO] Optimal solution found.',
    '[INFO] Service level target achieved: 98.1%',
    '[INFO] Master plan generated successfully.',
  ],
  fp: [
    '[INFO] Factory Planning solver starting...',
    '[INFO] Loading master plan from MP module...',
    '[INFO] Production orders received: 24 orders across 4 lines',
    '[INFO] Loading machine setup matrices...',
    '[INFO] Loading production rate tables...',
    '[INFO] Genetic Algorithm initializing...',
    '[INFO] Initial population generated: 100 chromosomes',
    '[INFO] Generation 1... Best fitness: 0.65',
    '[INFO] Generation 10... Best fitness: 0.72',
    '[INFO] Generation 20... Best fitness: 0.78',
    '[INFO] Generation 30... Best fitness: 0.83',
    '[WARN] Local optimum detected. Applying mutation boost...',
    '[INFO] Generation 35... Best fitness: 0.85',
    '[INFO] Generation 40... Best fitness: 0.86',
    '[INFO] Generation 45... Best fitness: 0.87',
    '[INFO] Convergence achieved at Generation 45',
    '[INFO] Optimal production sequence found.',
    '[INFO] Validating schedule against constraints...',
    '[INFO] Schedule validated. OEE: 87.3%',
    '[INFO] Production schedule generated successfully.',
  ],
  tp: [
    '[INFO] Transportation Planning solver initializing...',
    '[INFO] Loading production schedule from FP module...',
    '[INFO] Shipment orders received: 15 deliveries',
    '[INFO] Loading vehicle fleet data: 5 vehicles available',
    '[INFO] Loading customer location data...',
    '[INFO] Building distance matrix...',
    '[INFO] VRP Solver starting...',
    '[INFO] Applying Clarke-Wright savings algorithm...',
    '[INFO] Initial routes constructed: 5 routes',
    '[INFO] Route optimization in progress...',
    '[INFO] 2-opt improvement iteration 1...',
    '[INFO] 2-opt improvement iteration 2...',
    '[INFO] 2-opt improvement iteration 3...',
    '[WARN] Vehicle V04 capacity constraint violated. Reassigning...',
    '[INFO] Route rebalancing complete.',
    '[INFO] Applying time window constraints...',
    '[INFO] Final optimization pass...',
    '[INFO] Routes optimized. Total distance: 450km',
    '[INFO] Vehicle utilization: 89%',
    '[INFO] Transportation plan generated successfully.',
  ],
};
```

**Step 3: Verify no TypeScript errors**

Run:
```bash
npx tsc --noEmit
```

Expected: No errors (or only unused variable warnings which are OK).

**Step 4: Commit**

Run:
```bash
git add -A && git commit -m "feat: add mock data for solver outputs and log messages"
```

---

## Task 4: SCM Context

**Files:**
- Modify: `src/context/SCMContext.tsx`

**Step 1: Implement SCMContext**

Replace `src/context/SCMContext.tsx`:

```typescript
import { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';
import { SolverStage, SolverStatus, LogEntry, SolverOutputs } from '../types';
import { mockSolverOutputs, stageOrder } from '../mocks/data';
import { solverLogMessages } from '../mocks/logs';

interface SCMContextType {
  solverStatus: Record<SolverStage, SolverStatus>;
  solverOutputs: SolverOutputs;
  logs: Record<SolverStage, LogEntry[]>;
  runSolver: (stage: SolverStage) => void;
  canRunSolver: (stage: SolverStage) => boolean;
  resetDemo: () => void;
  expandedLog: SolverStage | null;
  setExpandedLog: (stage: SolverStage | null) => void;
}

const SCMContext = createContext<SCMContextType | null>(null);

export function useSCM() {
  const context = useContext(SCMContext);
  if (!context) {
    throw new Error('useSCM must be used within SCMProvider');
  }
  return context;
}

interface SCMProviderProps {
  children: ReactNode;
}

export function SCMProvider({ children }: SCMProviderProps) {
  const [solverStatus, setSolverStatus] = useState<Record<SolverStage, SolverStatus>>({
    dp: 'complete',
    mp: 'complete',
    fp: 'complete',
    tp: 'complete',
  });

  const [solverOutputs] = useState<SolverOutputs>(mockSolverOutputs);

  const [logs, setLogs] = useState<Record<SolverStage, LogEntry[]>>({
    dp: [],
    mp: [],
    fp: [],
    tp: [],
  });

  const [expandedLog, setExpandedLog] = useState<SolverStage | null>(null);

  const runningRef = useRef<Record<SolverStage, boolean>>({
    dp: false,
    mp: false,
    fp: false,
    tp: false,
  });

  const canRunSolver = useCallback((stage: SolverStage): boolean => {
    const stageIndex = stageOrder.indexOf(stage);
    if (stageIndex === 0) return true;
    const previousStage = stageOrder[stageIndex - 1];
    return solverStatus[previousStage] === 'complete';
  }, [solverStatus]);

  const runSolver = useCallback((stage: SolverStage) => {
    if (!canRunSolver(stage) || runningRef.current[stage]) return;

    runningRef.current[stage] = true;

    // Clear previous logs and set running
    setLogs(prev => ({ ...prev, [stage]: [] }));
    setSolverStatus(prev => ({ ...prev, [stage]: 'running' }));
    setExpandedLog(stage);

    const messages = solverLogMessages[stage];
    let index = 0;

    const streamLog = () => {
      if (index >= messages.length) {
        setSolverStatus(prev => ({ ...prev, [stage]: 'complete' }));
        runningRef.current[stage] = false;
        return;
      }

      const message = messages[index];
      const level = message.includes('[WARN]') ? 'WARN' : message.includes('[ERROR]') ? 'ERROR' : 'INFO';
      const now = new Date();
      const timestamp = now.toTimeString().split(' ')[0];

      const entry: LogEntry = {
        id: `${stage}-${index}-${Date.now()}`,
        timestamp,
        level,
        message: message.replace(/\[(INFO|WARN|ERROR)\]\s*/, ''),
      };

      setLogs(prev => ({
        ...prev,
        [stage]: [...prev[stage], entry],
      }));

      index++;
      const delay = 200 + Math.random() * 600; // 200-800ms
      setTimeout(streamLog, delay);
    };

    streamLog();
  }, [canRunSolver]);

  const resetDemo = useCallback(() => {
    Object.keys(runningRef.current).forEach(key => {
      runningRef.current[key as SolverStage] = false;
    });
    setSolverStatus({
      dp: 'complete',
      mp: 'complete',
      fp: 'complete',
      tp: 'complete',
    });
    setLogs({ dp: [], mp: [], fp: [], tp: [] });
    setExpandedLog(null);
  }, []);

  return (
    <SCMContext.Provider
      value={{
        solverStatus,
        solverOutputs,
        logs,
        runSolver,
        canRunSolver,
        resetDemo,
        expandedLog,
        setExpandedLog,
      }}
    >
      {children}
    </SCMContext.Provider>
  );
}
```

**Step 2: Verify no TypeScript errors**

Run:
```bash
npx tsc --noEmit
```

Expected: No errors.

**Step 3: Commit**

Run:
```bash
git add -A && git commit -m "feat: implement SCMContext with solver state management"
```

---

## Task 5: App Shell with Router

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/main.tsx`

**Step 1: Setup App with Router**

Replace `src/App.tsx`:

```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SCMProvider } from './context/SCMContext';
import Header from './components/layout/Header';
import FloatingRunButton from './components/layout/FloatingRunButton';
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
              <Route path="/" element={<Navigate to="/dp" replace />} />
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

**Step 2: Verify main.tsx is correct**

Check `src/main.tsx` has:

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

**Step 3: Verify app runs**

Run:
```bash
npm run dev
```

Expected: App loads, shows Header and page placeholders, routing works.

**Step 4: Commit**

Run:
```bash
git add -A && git commit -m "feat: setup React Router with page routing"
```

---

## Task 6: Pipeline Header

**Files:**
- Modify: `src/components/layout/Header.tsx`

**Step 1: Implement Header with pipeline navigation**

Replace `src/components/layout/Header.tsx`:

```typescript
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSCM } from '../../context/SCMContext';
import { stageOrder, stageLabels } from '../../mocks/data';
import { SolverStage } from '../../types';

export default function Header() {
  const { solverStatus, solverOutputs } = useSCM();
  const location = useLocation();

  const getBadgeCount = (stage: SolverStage): number => {
    switch (stage) {
      case 'dp':
        return solverOutputs.dp.forecasts.length;
      case 'mp':
        return solverOutputs.mp.plans.length;
      case 'fp':
        return solverOutputs.fp.schedule.length;
      case 'tp':
        return solverOutputs.tp.routes.length;
      default:
        return 0;
    }
  };

  const getNodeClasses = (stage: SolverStage): string => {
    const status = solverStatus[stage];
    const isActive = location.pathname === `/${stage}`;

    const base = 'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 cursor-pointer';

    if (status === 'running') {
      return `${base} bg-nexprime-cyan text-nexprime-darker animate-pulse`;
    }
    if (status === 'complete') {
      return `${base} bg-nexprime-cyan text-nexprime-darker`;
    }
    if (isActive) {
      return `${base} border-2 border-nexprime-cyan text-nexprime-cyan`;
    }
    return `${base} border-2 border-nexprime-cyan/30 text-nexprime-cyan/50`;
  };

  return (
    <header className="bg-nexprime-dark border-b border-nexprime-blue/30">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-nexprime-cyan font-bold text-xl tracking-wider">
              NEXPRIME
            </span>
            <span className="text-white/60 text-sm">SCM</span>
          </div>

          {/* Pipeline Navigation */}
          <nav className="flex items-center gap-2">
            {stageOrder.map((stage, index) => (
              <div key={stage} className="flex items-center">
                <NavLink to={`/${stage}`} className="flex flex-col items-center gap-1">
                  <motion.div
                    className={getNodeClasses(stage)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {stage.toUpperCase()}
                  </motion.div>
                  <span className="text-xs text-white/40">
                    {stageLabels[stage].split(' ')[0]}
                  </span>
                  {solverStatus[stage] === 'complete' && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-xs text-nexprime-cyan font-mono"
                    >
                      [{getBadgeCount(stage)}]
                    </motion.span>
                  )}
                </NavLink>

                {/* Connector Line */}
                {index < stageOrder.length - 1 && (
                  <div className="w-12 h-0.5 mx-2 relative">
                    <div className="absolute inset-0 bg-nexprime-cyan/20" />
                    {solverStatus[stage] === 'complete' && (
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 bg-nexprime-cyan origin-left"
                      />
                    )}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Reset Button */}
          <button
            onClick={() => window.location.reload()}
            className="text-white/40 hover:text-white text-sm transition-colors"
          >
            Reset Demo
          </button>
        </div>
      </div>
    </header>
  );
}
```

**Step 2: Verify header renders correctly**

Run:
```bash
npm run dev
```

Expected: Pipeline header shows with DP/MP/FP/TP nodes, clicking navigates between pages.

**Step 3: Commit**

Run:
```bash
git add -A && git commit -m "feat: implement pipeline header navigation"
```

---

## Task 7: Floating Action Button

**Files:**
- Modify: `src/components/layout/FloatingRunButton.tsx`

**Step 1: Implement FAB**

Replace `src/components/layout/FloatingRunButton.tsx`:

```typescript
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Loader2, Check } from 'lucide-react';
import { useSCM } from '../../context/SCMContext';
import { SolverStage } from '../../types';
import { stageLabels } from '../../mocks/data';

export default function FloatingRunButton() {
  const location = useLocation();
  const { solverStatus, runSolver, canRunSolver } = useSCM();

  const currentStage = location.pathname.slice(1) as SolverStage;
  const status = solverStatus[currentStage];
  const canRun = canRunSolver(currentStage);

  const handleClick = () => {
    if (status === 'running' || !canRun) return;
    runSolver(currentStage);
  };

  const getButtonContent = () => {
    if (status === 'running') {
      return (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Running...</span>
        </>
      );
    }
    return (
      <>
        <Play className="w-5 h-5" />
        <span>Run {currentStage.toUpperCase()}</span>
      </>
    );
  };

  const getTooltip = (): string | null => {
    if (!canRun) {
      const stageIndex = ['dp', 'mp', 'fp', 'tp'].indexOf(currentStage);
      if (stageIndex > 0) {
        const prevStage = ['dp', 'mp', 'fp', 'tp'][stageIndex - 1] as SolverStage;
        return `Complete ${stageLabels[prevStage]} first`;
      }
    }
    return null;
  };

  const tooltip = getTooltip();

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-nexprime-dark border border-nexprime-blue/30 rounded text-sm text-white/70 whitespace-nowrap"
          >
            {tooltip}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={handleClick}
        disabled={status === 'running' || !canRun}
        className={`
          flex items-center gap-2 px-6 py-3 rounded-full font-medium
          transition-all duration-300 shadow-lg
          ${status === 'running'
            ? 'bg-nexprime-cyan/50 text-nexprime-darker cursor-wait'
            : canRun
              ? 'bg-gradient-to-r from-nexprime-cyan to-nexprime-cyan-dim text-nexprime-darker hover:shadow-nexprime-cyan/30 hover:shadow-xl'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }
        `}
        whileHover={canRun && status !== 'running' ? { scale: 1.05 } : {}}
        whileTap={canRun && status !== 'running' ? { scale: 0.95 } : {}}
        animate={status === 'idle' && canRun ? {
          boxShadow: ['0 0 0 0 rgba(0,255,255,0.4)', '0 0 0 10px rgba(0,255,255,0)', '0 0 0 0 rgba(0,255,255,0.4)']
        } : {}}
        transition={status === 'idle' && canRun ? {
          boxShadow: { repeat: Infinity, duration: 2 }
        } : {}}
      >
        {getButtonContent()}
      </motion.button>
    </div>
  );
}
```

**Step 2: Verify FAB works**

Run:
```bash
npm run dev
```

Expected: FAB shows "Run DP" on /dp, clicking shows running state and streams logs.

**Step 3: Commit**

Run:
```bash
git add -A && git commit -m "feat: implement floating action button for solver control"
```

---

## Task 8: KPI Card Component

**Files:**
- Modify: `src/components/common/KPICard.tsx`

**Step 1: Implement KPICard**

Replace `src/components/common/KPICard.tsx`:

```typescript
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: number | string;
  suffix?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export default function KPICard({ label, value, suffix = '', trend, trendValue }: KPICardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      case 'neutral':
        return <Minus className="w-4 h-4 text-white/40" />;
      default:
        return null;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-400';
      case 'down':
        return 'text-red-400';
      default:
        return 'text-white/40';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-nexprime-dark border border-nexprime-blue/30 rounded-lg p-4"
    >
      <div className="text-white/60 text-sm mb-1">{label}</div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-white">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {suffix && <span className="text-nexprime-cyan text-lg">{suffix}</span>}
      </div>
      {trend && (
        <div className={`flex items-center gap-1 mt-2 text-sm ${getTrendColor()}`}>
          {getTrendIcon()}
          {trendValue && <span>{trendValue}</span>}
        </div>
      )}
    </motion.div>
  );
}
```

**Step 2: Commit**

Run:
```bash
git add -A && git commit -m "feat: implement KPI card component"
```

---

## Task 9: Live Solver Log Component

**Files:**
- Modify: `src/components/common/LiveSolverLog.tsx`

**Step 1: Implement LiveSolverLog**

Replace `src/components/common/LiveSolverLog.tsx`:

```typescript
import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Terminal } from 'lucide-react';
import { LogEntry, SolverStage, SolverStatus } from '../../types';

interface LiveSolverLogProps {
  stage: SolverStage;
  logs: LogEntry[];
  status: SolverStatus;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function LiveSolverLog({ stage, logs, status, isExpanded, onToggle }: LiveSolverLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getLevelColor = (level: LogEntry['level']): string => {
    switch (level) {
      case 'INFO':
        return 'text-nexprime-cyan';
      case 'WARN':
        return 'text-amber-400';
      case 'ERROR':
        return 'text-red-400';
      default:
        return 'text-white';
    }
  };

  return (
    <div className="bg-nexprime-dark border border-nexprime-blue/30 rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 bg-nexprime-darker hover:bg-nexprime-dark/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-nexprime-cyan" />
          <span className="text-white/80 font-medium">Live Solver Log</span>
          {status === 'running' && (
            <span className="flex items-center gap-1 text-xs text-nexprime-cyan">
              <span className="w-2 h-2 bg-nexprime-cyan rounded-full animate-pulse" />
              Running
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronDown className="w-5 h-5 text-white/40" />
        ) : (
          <ChevronUp className="w-5 h-5 text-white/40" />
        )}
      </button>

      {/* Log Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              ref={scrollRef}
              className="bg-black/80 p-4 font-mono text-sm max-h-64 overflow-y-auto"
            >
              {logs.length === 0 ? (
                <div className="text-white/30 text-center py-8">
                  Click "Run {stage.toUpperCase()}" to start solver...
                </div>
              ) : (
                <div className="space-y-1">
                  {logs.map((entry) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.15 }}
                      className="flex gap-2"
                    >
                      <span className="text-white/30 shrink-0">{entry.timestamp}</span>
                      <span className={`shrink-0 ${getLevelColor(entry.level)}`}>
                        [{entry.level}]
                      </span>
                      <span className="text-white/90">{entry.message}</span>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Cursor blink when running */}
              {status === 'running' && (
                <div className="mt-2 flex items-center gap-1">
                  <span className="text-white/30">{'>'}</span>
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-2 h-4 bg-nexprime-cyan"
                  />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

**Step 2: Commit**

Run:
```bash
git add -A && git commit -m "feat: implement live solver log component with terminal styling"
```

---

## Task 10: Demand Planning Page (DP)

**Files:**
- Modify: `src/pages/DemandPlanning.tsx`
- Create: `src/components/visualizations/ForecastChart.tsx`

**Step 1: Create Forecast Line Chart**

Create `src/components/visualizations/ForecastChart.tsx`:

```typescript
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, ComposedChart } from 'recharts';
import { DemandForecast } from '../../types';

interface ForecastChartProps {
  data: DemandForecast[];
}

export default function ForecastChart({ data }: ForecastChartProps) {
  const chartData = data.map(item => ({
    month: item.month,
    forecast: item.forecast,
    actual: item.actual,
    upper: item.forecast * (1 + (1 - item.confidence) / 2),
    lower: item.forecast * (1 - (1 - item.confidence) / 2),
  }));

  return (
    <div className="bg-nexprime-dark border border-nexprime-blue/30 rounded-lg p-4">
      <h3 className="text-white/80 font-medium mb-4">Forecast vs Actual Demand</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
          <XAxis dataKey="month" stroke="#ffffff60" fontSize={12} />
          <YAxis stroke="#ffffff60" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0a0a0f',
              border: '1px solid #1e3a5f',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#ffffff' }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="upper"
            stroke="none"
            fill="#00FFFF"
            fillOpacity={0.1}
            name="Confidence Band"
          />
          <Area
            type="monotone"
            dataKey="lower"
            stroke="none"
            fill="#0a0a0f"
            fillOpacity={1}
          />
          <Line
            type="monotone"
            dataKey="forecast"
            stroke="#00FFFF"
            strokeWidth={2}
            dot={{ fill: '#00FFFF', r: 4 }}
            name="AI Forecast"
          />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#ffffff"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: '#ffffff', r: 4 }}
            name="Actual"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
```

**Step 2: Implement Demand Planning Page**

Replace `src/pages/DemandPlanning.tsx`:

```typescript
import { useSCM } from '../context/SCMContext';
import KPICard from '../components/common/KPICard';
import LiveSolverLog from '../components/common/LiveSolverLog';
import ForecastChart from '../components/visualizations/ForecastChart';

export default function DemandPlanning() {
  const { solverOutputs, solverStatus, logs, expandedLog, setExpandedLog } = useSCM();
  const { forecasts, kpis } = solverOutputs.dp;

  return (
    <div className="space-y-6">
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

      {/* Main Visualization */}
      <ForecastChart data={forecasts} />

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

**Step 3: Verify DP page works**

Run:
```bash
npm run dev
```

Navigate to /dp. Expected: KPI cards, forecast chart, and log viewer display correctly.

**Step 4: Commit**

Run:
```bash
git add -A && git commit -m "feat: implement Demand Planning page with forecast chart"
```

---

## Task 11: Master Planning Page (MP)

**Files:**
- Modify: `src/pages/MasterPlanning.tsx`
- Create: `src/components/visualizations/SupplyDemandChart.tsx`

**Step 1: Create Supply/Demand Stacked Bar Chart**

Create `src/components/visualizations/SupplyDemandChart.tsx`:

```typescript
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { MasterPlanItem } from '../../types';

interface SupplyDemandChartProps {
  data: MasterPlanItem[];
}

export default function SupplyDemandChart({ data }: SupplyDemandChartProps) {
  const chartData = data.map(item => ({
    plant: item.plant,
    supply: item.supply,
    demand: item.demand,
    gap: item.gap,
    utilization: Math.round(item.utilization * 100),
  }));

  return (
    <div className="bg-nexprime-dark border border-nexprime-blue/30 rounded-lg p-4">
      <h3 className="text-white/80 font-medium mb-4">Supply vs Demand by Plant</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} barGap={0}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
          <XAxis dataKey="plant" stroke="#ffffff60" fontSize={12} />
          <YAxis stroke="#ffffff60" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0a0a0f',
              border: '1px solid #1e3a5f',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#ffffff' }}
            formatter={(value: number, name: string) => [
              value.toLocaleString(),
              name.charAt(0).toUpperCase() + name.slice(1)
            ]}
          />
          <Legend />
          <Bar dataKey="supply" fill="#00FFFF" name="Supply" radius={[4, 4, 0, 0]} />
          <Bar dataKey="demand" fill="#0088AA" name="Demand" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      {/* Utilization indicators */}
      <div className="mt-4 flex gap-4 justify-center">
        {chartData.map(item => (
          <div key={item.plant} className="text-center">
            <div className="text-xs text-white/40">{item.plant}</div>
            <div className={`text-sm font-mono ${item.utilization > 100 ? 'text-red-400' : 'text-nexprime-cyan'}`}>
              {item.utilization}% util
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Step 2: Implement Master Planning Page**

Replace `src/pages/MasterPlanning.tsx`:

```typescript
import { useSCM } from '../context/SCMContext';
import KPICard from '../components/common/KPICard';
import LiveSolverLog from '../components/common/LiveSolverLog';
import SupplyDemandChart from '../components/visualizations/SupplyDemandChart';

export default function MasterPlanning() {
  const { solverOutputs, solverStatus, logs, expandedLog, setExpandedLog } = useSCM();
  const { plans, kpis } = solverOutputs.mp;

  return (
    <div className="space-y-6">
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

      {/* Main Visualization */}
      <SupplyDemandChart data={plans} />

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

**Step 3: Commit**

Run:
```bash
git add -A && git commit -m "feat: implement Master Planning page with supply/demand chart"
```

---

## Task 12: Factory Planning Page (FP)

**Files:**
- Modify: `src/pages/FactoryPlanning.tsx`
- Create: `src/components/visualizations/GanttChart.tsx`

**Step 1: Create Gantt Chart**

Create `src/components/visualizations/GanttChart.tsx`:

```typescript
import { motion } from 'framer-motion';
import { ProductionScheduleItem } from '../../types';

interface GanttChartProps {
  data: ProductionScheduleItem[];
}

export default function GanttChart({ data }: GanttChartProps) {
  const lines = [...new Set(data.map(item => item.line))].sort();
  const timeSlots = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00'];

  const parseTime = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours + minutes / 60;
  };

  const getPosition = (start: string, end: string) => {
    const startHour = parseTime(start);
    const endHour = parseTime(end);
    const dayStart = 6; // 06:00
    const dayEnd = 18; // 18:00
    const totalHours = dayEnd - dayStart;

    return {
      left: `${((startHour - dayStart) / totalHours) * 100}%`,
      width: `${((endHour - startHour) / totalHours) * 100}%`,
    };
  };

  return (
    <div className="bg-nexprime-dark border border-nexprime-blue/30 rounded-lg p-4">
      <h3 className="text-white/80 font-medium mb-4">Production Schedule</h3>

      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Time axis */}
          <div className="flex border-b border-nexprime-blue/30 pb-2 mb-4 pl-20">
            {timeSlots.map(time => (
              <div key={time} className="flex-1 text-xs text-white/40 text-center">
                {time}
              </div>
            ))}
          </div>

          {/* Gantt rows */}
          <div className="space-y-3">
            {lines.map(line => {
              const lineItems = data.filter(item => item.line === line);
              return (
                <div key={line} className="flex items-center">
                  <div className="w-20 text-sm text-white/60 shrink-0">{line}</div>
                  <div className="flex-1 relative h-8 bg-nexprime-darker rounded">
                    {lineItems.map((item, idx) => {
                      const pos = getPosition(item.start, item.end);
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ scaleX: 0, opacity: 0 }}
                          animate={{ scaleX: 1, opacity: 1 }}
                          transition={{ delay: idx * 0.1 }}
                          className="absolute top-1 bottom-1 rounded cursor-pointer group"
                          style={{
                            left: pos.left,
                            width: pos.width,
                            backgroundColor: item.color,
                            originX: 0,
                          }}
                        >
                          <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-nexprime-darker truncate px-1">
                            {item.product}
                          </div>

                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            <div className="bg-nexprime-darker border border-nexprime-blue/30 rounded px-2 py-1 text-xs whitespace-nowrap">
                              <div className="text-white">{item.product}</div>
                              <div className="text-white/60">{item.start} - {item.end}</div>
                              <div className="text-nexprime-cyan">Qty: {item.quantity}</div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Implement Factory Planning Page**

Replace `src/pages/FactoryPlanning.tsx`:

```typescript
import { useSCM } from '../context/SCMContext';
import KPICard from '../components/common/KPICard';
import LiveSolverLog from '../components/common/LiveSolverLog';
import GanttChart from '../components/visualizations/GanttChart';

export default function FactoryPlanning() {
  const { solverOutputs, solverStatus, logs, expandedLog, setExpandedLog } = useSCM();
  const { schedule, kpis } = solverOutputs.fp;

  return (
    <div className="space-y-6">
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

      {/* Main Visualization */}
      <GanttChart data={schedule} />

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

**Step 3: Commit**

Run:
```bash
git add -A && git commit -m "feat: implement Factory Planning page with Gantt chart"
```

---

## Task 13: Transport Planning Page (TP)

**Files:**
- Modify: `src/pages/TransportPlanning.tsx`
- Create: `src/components/visualizations/RouteMap.tsx`

**Step 1: Create Route Map (SVG-based)**

Create `src/components/visualizations/RouteMap.tsx`:

```typescript
import { motion } from 'framer-motion';
import { TransportRoute } from '../../types';

interface RouteMapProps {
  data: TransportRoute[];
}

const routeColors = ['#00FFFF', '#0088AA', '#4FFFFF', '#1e3a5f'];

export default function RouteMap({ data }: RouteMapProps) {
  // Simplified SVG map - positions are normalized to 0-100 for SVG viewBox
  const normalizeCoords = (routes: TransportRoute[]) => {
    const allCoords = routes.flatMap(r => r.coordinates);
    const minLat = Math.min(...allCoords.map(c => c.lat));
    const maxLat = Math.max(...allCoords.map(c => c.lat));
    const minLng = Math.min(...allCoords.map(c => c.lng));
    const maxLng = Math.max(...allCoords.map(c => c.lng));

    return routes.map(route => ({
      ...route,
      normalizedCoords: route.coordinates.map(coord => ({
        x: ((coord.lng - minLng) / (maxLng - minLng || 1)) * 80 + 10,
        y: ((maxLat - coord.lat) / (maxLat - minLat || 1)) * 80 + 10,
      })),
    }));
  };

  const normalizedRoutes = normalizeCoords(data);

  return (
    <div className="bg-nexprime-dark border border-nexprime-blue/30 rounded-lg p-4">
      <h3 className="text-white/80 font-medium mb-4">Delivery Routes</h3>

      <div className="flex gap-6">
        {/* Map */}
        <div className="flex-1">
          <svg viewBox="0 0 100 100" className="w-full h-64 bg-nexprime-darker rounded-lg">
            {/* Grid */}
            {[20, 40, 60, 80].map(pos => (
              <g key={pos}>
                <line x1={pos} y1="0" x2={pos} y2="100" stroke="#1e3a5f" strokeWidth="0.5" />
                <line x1="0" y1={pos} x2="100" y2={pos} stroke="#1e3a5f" strokeWidth="0.5" />
              </g>
            ))}

            {/* Routes */}
            {normalizedRoutes.map((route, routeIdx) => {
              const pathData = route.normalizedCoords
                .map((coord, i) => `${i === 0 ? 'M' : 'L'} ${coord.x} ${coord.y}`)
                .join(' ');

              return (
                <g key={route.vehicle}>
                  {/* Route line */}
                  <motion.path
                    d={pathData}
                    fill="none"
                    stroke={routeColors[routeIdx % routeColors.length]}
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: routeIdx * 0.3 }}
                  />

                  {/* Stops */}
                  {route.normalizedCoords.map((coord, stopIdx) => (
                    <motion.g
                      key={stopIdx}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: routeIdx * 0.3 + stopIdx * 0.1 }}
                    >
                      <circle
                        cx={coord.x}
                        cy={coord.y}
                        r={stopIdx === 0 ? 4 : 3}
                        fill={stopIdx === 0 ? '#00FFFF' : routeColors[routeIdx % routeColors.length]}
                        stroke="#0a0a0f"
                        strokeWidth="1"
                      />
                    </motion.g>
                  ))}
                </g>
              );
            })}

            {/* Warehouse marker */}
            <motion.g
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <rect
                x={normalizedRoutes[0]?.normalizedCoords[0]?.x - 4 || 46}
                y={normalizedRoutes[0]?.normalizedCoords[0]?.y - 4 || 46}
                width="8"
                height="8"
                fill="#00FFFF"
                stroke="#0a0a0f"
                strokeWidth="1"
              />
            </motion.g>
          </svg>
        </div>

        {/* Legend */}
        <div className="w-48 space-y-3">
          <div className="text-sm text-white/60 mb-2">Routes</div>
          {data.map((route, idx) => (
            <div
              key={route.vehicle}
              className="flex items-center gap-2 p-2 bg-nexprime-darker rounded text-sm"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: routeColors[idx % routeColors.length] }}
              />
              <div className="flex-1">
                <div className="text-white">{route.vehicle}</div>
                <div className="text-white/40 text-xs">
                  {route.stops.length} stops · {route.distance}km
                </div>
              </div>
              <div className="text-nexprime-cyan text-xs">
                {Math.round(route.load * 100)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Implement Transport Planning Page**

Replace `src/pages/TransportPlanning.tsx`:

```typescript
import { useSCM } from '../context/SCMContext';
import KPICard from '../components/common/KPICard';
import LiveSolverLog from '../components/common/LiveSolverLog';
import RouteMap from '../components/visualizations/RouteMap';

export default function TransportPlanning() {
  const { solverOutputs, solverStatus, logs, expandedLog, setExpandedLog } = useSCM();
  const { routes, kpis } = solverOutputs.tp;

  return (
    <div className="space-y-6">
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

      {/* Main Visualization */}
      <RouteMap data={routes} />

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

**Step 3: Commit**

Run:
```bash
git add -A && git commit -m "feat: implement Transport Planning page with route map"
```

---

## Task 14: Final Verification & Polish

**Step 1: Build check**

Run:
```bash
npm run build
```

Expected: Build succeeds with no errors.

**Step 2: Lint check**

Run:
```bash
npm run lint
```

Fix any linting errors if present.

**Step 3: Manual testing checklist**

- [ ] Navigate to /dp, /mp, /fp, /tp via header
- [ ] Click Run button on each page, verify logs stream
- [ ] Verify log colors (INFO=cyan, WARN=amber, ERROR=red)
- [ ] Verify pipeline connections animate when complete
- [ ] Verify badge counts show on header nodes
- [ ] Verify all charts render with data
- [ ] Verify responsive layout on narrow viewport

**Step 4: Final commit**

Run:
```bash
git add -A && git commit -m "chore: final polish and verification"
```

---

## Summary

This plan implements the complete Nexprime SCM POC with:

- **14 tasks** covering project setup through final verification
- **TDD-adjacent approach** (verify build/TypeScript after each task)
- **Incremental commits** for clean git history
- **All components** as specified in the design document

Total estimated implementation: ~2-3 hours for experienced React developer.
