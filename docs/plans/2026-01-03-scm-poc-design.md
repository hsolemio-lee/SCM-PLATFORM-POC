# Nexprime SCM POC - Architecture Design

## Overview

Frontend prototype visualizing SCM solver data flow: DP → MP → FP → TP.
Each solver dashboard shows KPIs, visualizations, and a live streaming log.

## Key Decisions

| Aspect | Decision |
|--------|----------|
| Navigation | Pipeline header with clickable stage nodes |
| Dashboard Layout | Three-section: KPIs → Visualization → Collapsible Log |
| Run Interaction | Floating Action Button (bottom-right) |
| Data Flow Indicators | Animated connections + badge counters |
| State Management | React Context (SCMContext) |
| Routing | React Router (`/dp`, `/mp`, `/fp`, `/tp`) |
| Log Streaming | Realistic pacing (200-800ms delays, 8-15 sec total) |
| Initial State | Pre-populated with sample data |
| Styling | Dark mode, Cyan (#00FFFF) + Deep Blue accents |

## Tech Stack

- React + Vite + TypeScript
- Tailwind CSS + Shadcn UI
- Recharts + Framer Motion
- Lucide React icons

## Project Structure

```
src/
├── main.tsx
├── App.tsx
├── context/
│   └── SCMContext.tsx
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── FloatingRunButton.tsx
│   ├── common/
│   │   ├── KPICard.tsx
│   │   └── LiveSolverLog.tsx
│   └── visualizations/
│       ├── LineChart.tsx
│       ├── StackedBar.tsx
│       ├── GanttChart.tsx
│       └── RouteMap.tsx
├── pages/
│   ├── DemandPlanning.tsx
│   ├── MasterPlanning.tsx
│   ├── FactoryPlanning.tsx
│   └── TransportPlanning.tsx
└── mocks/
    ├── data.ts
    └── logs.ts
```

## State Management

```typescript
type SolverStage = 'dp' | 'mp' | 'fp' | 'tp';
type SolverStatus = 'idle' | 'running' | 'complete';

interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
}

interface SCMState {
  solverStatus: Record<SolverStage, SolverStatus>;
  solverOutputs: {
    dp: DemandForecast[];
    mp: MasterPlan;
    fp: ProductionSchedule[];
    tp: TransportRoutes[];
  };
  logs: Record<SolverStage, LogEntry[]>;
  runSolver: (stage: SolverStage) => void;
  resetDemo: () => void;
}
```

### runSolver() Behavior

1. Sets `solverStatus[stage]` to `'running'`
2. Auto-expands log panel
3. Streams log entries with 200-800ms random delays
4. After 8-15 seconds, sets status to `'complete'`
5. Triggers pipeline animation
6. Updates badge counters

### Data Flow Enforcement

- MP requires DP complete
- FP requires MP complete
- TP requires FP complete

## Pipeline Header

```
┌─────────────────────────────────────────────────────────────────────────┐
│  NEXPRIME SCM                                                           │
│     ●────────●────────●────────●                                       │
│    DP       MP       FP       TP                                       │
│   [12]     [8]      [24]     [15]                                      │
└─────────────────────────────────────────────────────────────────────────┘
```

### Node States

- `idle`: Dim cyan outline
- `running`: Pulsing animation, bright cyan fill
- `complete`: Solid cyan fill with checkmark

### Connection Animation

- Default: Dim dashed line
- On transfer: Animated particles flowing left→right
- After transfer: Solid bright line

## Dashboard Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│  KPI CARDS                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│  │ Metric 1 │  │ Metric 2 │  │ Metric 3 │  │ Metric 4 │               │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘               │
├─────────────────────────────────────────────────────────────────────────┤
│  MAIN VISUALIZATION (full width)                                        │
├─────────────────────────────────────────────────────────────────────────┤
│  LIVE SOLVER LOG (collapsible)                               [▼ Hide]  │
│  │ 14:23:01 [INFO] Processing...                                       │
└─────────────────────────────────────────────────────────────────────────┘
                                                              ┌─────────┐
                                                              │  ▶ RUN  │
                                                              └─────────┘
```

## Solver Visualizations

| Stage | Chart Type | Content |
|-------|------------|---------|
| DP | Line Chart | Forecast vs Actual with confidence interval |
| MP | Stacked Bar | Supply vs Demand by plant |
| FP | Gantt Chart | Production schedule by line |
| TP | Route Map | Vehicle routes with stops |

## Live Solver Log

### Styling

```css
.solver-log {
  background: #0a0a0a;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
}
```

### Color Coding

- `[INFO]` → Cyan (#00FFFF)
- `[WARN]` → Amber (#FFBF00)
- `[ERROR]` → Red (#FF4444)
- Timestamp → Gray (#666666)
- Message → White (#EEEEEE)

### Streaming Behavior

- New entries appear at bottom
- Auto-scroll keeps latest visible
- Fade-in animation (150ms)
- Random delay: 200-800ms between entries
- Total runtime: 8-15 seconds

## Floating Action Button

### States

| State | Appearance |
|-------|------------|
| Ready | Solid cyan, "▶ Run DP", subtle pulse |
| Disabled | Dim gray, tooltip: "Complete DP first" |
| Running | Spinner, "Running...", non-clickable |
| Complete | Checkmark briefly, returns to Ready |

### Styling

```css
.fab {
  background: linear-gradient(135deg, #00FFFF, #0088AA);
  box-shadow: 0 4px 20px rgba(0, 255, 255, 0.3);
  position: fixed;
  bottom: 24px;
  right: 24px;
}
```

## Mock Data

### Solver Outputs (Pre-populated)

```typescript
mockSolverOutputs = {
  dp: {
    forecasts: [...],  // 12 months × multiple SKUs
    kpis: { accuracy: 94.2, coverage: 100, mape: 5.8 }
  },
  mp: {
    plans: [...],
    kpis: { serviceLevel: 98.1, inventoryTurns: 12.4, fillRate: 97.5 }
  },
  fp: {
    schedule: [...],
    kpis: { oee: 87.3, setupTime: 45, throughput: 2400 }
  },
  tp: {
    routes: [...],
    kpis: { totalDistance: 450, vehicleUtilization: 89, onTimeDelivery: 96.2 }
  }
}
```

### Log Messages (Per Solver)

- **DP**: "AI Model Training... Iteration 5/10... Loss: 0.024"
- **MP**: "Balancing Supply and Demand...", "Resolving resource constraints"
- **FP**: "Genetic Algorithm started...", "Optimal sequence found at Generation 45"
- **TP**: "VRP Solver initializing...", "Route optimization for 15 vehicles"
