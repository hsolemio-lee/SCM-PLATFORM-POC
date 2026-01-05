# Nexprime SCM POC Project Guide

## 1. Project Overview

- **Name:** Nexprime SCM Integrated Platform POC
- **Objective:** Frontend prototype visualizing organic data flow between SCM solvers (DP -> MP -> FP -> TP)
- **Key Flow:** Demand Planning -> Master Planning -> Factory Planning -> Transportation Planning
- **Language:** Korean UI labels and descriptions, English code

## 2. Tech Stack (Frontend Only)

| Category | Technology | Purpose |
|----------|------------|---------|
| Framework | React 18 + Vite 6 | SPA build tooling |
| Language | TypeScript 5.6 | Type safety |
| Styling | Tailwind CSS 3.4 | Utility-first CSS |
| UI Components | Lucide React | Icon library |
| Charts/Viz | Recharts 3.6 | Data visualization |
| Animations | Framer Motion 12 | UI animations |
| Routing | React Router DOM 7 | Client-side routing |
| State | React Context (SCMContext) | Global state management |
| Utilities | clsx, tailwind-merge | Class name utilities |

## 3. Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (Vite)
npm run build        # TypeScript check + production build
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

## 4. Project Structure

```
src/
├── App.tsx                    # Root component with Router setup
├── main.tsx                   # Entry point
├── index.css                  # Global styles + Tailwind directives
├── vite-env.d.ts              # Vite type declarations
│
├── context/
│   └── SCMContext.tsx         # Global state: solver status, logs, outputs
│
├── types/
│   └── index.ts               # TypeScript interfaces and types
│
├── mocks/                     # Mock data (no backend)
│   ├── data.ts                # Solver outputs, stage labels, stage order
│   ├── solvers.ts             # Solver options per stage
│   ├── logs.ts                # Log messages per solver
│   └── tableData.ts           # Input/output table data
│
├── pages/                     # Route-level components
│   ├── Dashboard.tsx          # Main dashboard (/)
│   ├── DemandPlanning.tsx     # DP detail page (/dp)
│   ├── MasterPlanning.tsx     # MP detail page (/mp)
│   ├── FactoryPlanning.tsx    # FP detail page (/fp)
│   └── TransportPlanning.tsx  # TP detail page (/tp)
│
└── components/
    ├── layout/
    │   ├── Header.tsx             # Navigation header with pipeline visualization
    │   └── FloatingRunButton.tsx  # Global run/reset button
    │
    ├── common/                    # Reusable UI components
    │   ├── KPICard.tsx            # KPI display card
    │   ├── LiveSolverLog.tsx      # Terminal-style log viewer
    │   ├── SolverSelector.tsx     # Solver algorithm dropdown
    │   ├── DataTable.tsx          # Generic data table
    │   ├── DataTabs.tsx           # Input/Output tab switcher
    │   └── SyncBadge.tsx          # Sync notification indicator
    │
    ├── charts/                    # Stage-specific chart wrappers
    │   ├── DPChart.tsx            # Demand Planning chart
    │   ├── MPChart.tsx            # Master Planning chart
    │   ├── FPChart.tsx            # Factory Planning chart
    │   └── TPChart.tsx            # Transport Planning chart
    │
    ├── visualizations/            # Rich visualization components
    │   ├── ForecastChart.tsx      # DP: Forecast vs Actual line chart
    │   ├── SupplyDemandChart.tsx  # MP: Supply/Demand bar chart
    │   ├── GanttChart.tsx         # FP: Production schedule Gantt
    │   └── RouteMap.tsx           # TP: Vehicle route visualization
    │
    └── dashboard/                 # Dashboard-specific components
        ├── PipelineSummary.tsx    # Pipeline status overview
        ├── SolverCard.tsx         # Compact solver status card
        ├── MainSolverView.tsx     # Expanded solver detail view
        ├── CompactKPIs.tsx        # Mini KPI display
        ├── CompactVisualization.tsx # Mini chart view
        ├── OutputPanel.tsx        # Output data panel
        └── ActivityTimeline.tsx   # Recent activity log
```

## 5. Core Architecture

### 5.1 State Management (SCMContext)

Central state provider at `src/context/SCMContext.tsx`:

```typescript
interface SCMContextType {
  // Solver execution state
  solverStatus: Record<SolverStage, SolverStatus>;  // 'idle' | 'running' | 'complete'
  solverOutputs: SolverOutputs;                      // Mock output data
  logs: Record<SolverStage, LogEntry[]>;            // Streamed log entries

  // Actions
  runSolver: (stage: SolverStage) => void;          // Execute single solver
  runAllSolvers: () => void;                        // Execute pipeline sequentially
  canRunSolver: (stage: SolverStage) => boolean;    // Check dependencies
  resetDemo: () => void;                            // Reset all state

  // Solver selection
  selectedSolver: Record<SolverStage, string>;      // Selected algorithm per stage
  setSelectedSolver: (stage: SolverStage, id: string) => void;

  // UI state
  expandedLog: SolverStage | null;                  // Currently expanded log panel
  setExpandedLog: (stage: SolverStage | null) => void;

  // Sync tracking
  needsSync: Record<SolverStage, boolean>;          // Stages needing re-run
  lastCompletedStage: SolverStage | null;           // Most recently completed
  activityLog: ActivityEvent[];                     // Activity history
}
```

### 5.2 Routing

| Path | Component | Description |
|------|-----------|-------------|
| `/` | Dashboard | Main overview with all solvers |
| `/dp` | DemandPlanning | Demand Planning detail |
| `/mp` | MasterPlanning | Master Planning detail |
| `/fp` | FactoryPlanning | Factory Planning detail |
| `/tp` | TransportPlanning | Transport Planning detail |

### 5.3 Data Flow

```
[User Action] -> runSolver(stage) -> [Status: running]
                                          |
                                          v
                                   [Stream logs via setTimeout]
                                          |
                                          v
                                   [Status: complete]
                                          |
                                          v
                                   [Mark downstream stages as needsSync]
```

## 6. Type Definitions

### 6.1 Core Types (`src/types/index.ts`)

```typescript
type SolverStage = 'dp' | 'mp' | 'fp' | 'tp';
type SolverStatus = 'idle' | 'running' | 'complete';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
}

interface SolverKPIs {
  dp: { accuracy: number; coverage: number; mape: number };
  mp: { serviceLevel: number; inventoryTurns: number; fillRate: number };
  fp: { oee: number; setupTime: number; throughput: number };
  tp: { totalDistance: number; vehicleUtilization: number; onTimeDelivery: number };
}
```

## 7. Coding Standards & UI Rules

### 7.1 Brand Identity

- **Theme:** Dark Mode base
- **Primary Color:** Cyan (`#00FFFF` / `nexprime-cyan`)
- **Secondary:** Deep Blue (`#1e3a5f` / `nexprime-blue`)
- **Background:** Near-black (`#0a0a0f` / `nexprime-dark`, `#050508` / `nexprime-darker`)
- **Font:** JetBrains Mono / Fira Code for monospace elements

### 7.2 Tailwind Custom Colors

```javascript
// tailwind.config.js
colors: {
  'nexprime': {
    'cyan': '#00FFFF',
    'cyan-dim': '#0088AA',
    'blue': '#1e3a5f',
    'dark': '#0a0a0f',
    'darker': '#050508',
  }
}
```

### 7.3 Component Conventions

1. **File naming:** PascalCase for components (e.g., `LiveSolverLog.tsx`)
2. **Export style:** Default exports for components
3. **Props interface:** Define inline or above component
4. **Hooks:** Use `useSCM()` for global state access

### 7.4 Solver Dashboard Requirements

- **Top:** KPI cards with key metrics per solver
- **Center-Left:** Visualization widgets (charts, Gantt, maps)
- **Center-Right/Bottom:** Live Solver Log (mandatory)
  - Terminal-style UI (black background, monospace font)
  - Timestamp + log level (INFO/WARN/ERROR) + message
  - Auto-scroll with streaming text effect
  - Blinking cursor during execution

### 7.5 Interaction Patterns

- "Run Solver" button triggers loading animation + log streaming
- Pipeline enforces sequential execution (DP -> MP -> FP -> TP)
- Re-running upstream solver marks downstream stages as `needsSync`
- Orange dashed connectors indicate sync-needed state

## 8. Domain Context

### 8.1 SCM Pipeline Stages

| Stage | Full Name | Purpose | Key Output |
|-------|-----------|---------|------------|
| DP | Demand Planning | AI-based demand forecasting | Forecast vs Actual |
| MP | Master Planning | Supply-demand balancing | Plant utilization |
| FP | Factory Planning | Production scheduling | Gantt schedule |
| TP | Transport Planning | Vehicle routing optimization | Route assignments |

### 8.2 Available Solvers

**Demand Planning (DP):**
- Prophet, ARIMA, XGBoost, LSTM, Holt-Winters

**Master Planning (MP):**
- Nexprime SCM Response, Nexprime SCM Sequencer, Linear Programming, Genetic Algorithm, MILP, Constraint Programming

**Factory Planning (FP):**
- NEH Heuristic, Genetic Algorithm, Tabu Search, Ant Colony, Simulated Annealing

**Transport Planning (TP):**
- Clarke-Wright, Nearest Neighbor, 2-opt, Genetic Algorithm, Simulated Annealing

### 8.3 Sample Log Messages

```
DP: "AI Model Training... Iteration 5/10... Loss: 0.024"
    "Demand Sensing analysis completed."

MP: "Balancing Supply and Demand..."
    "Resolving resource constraints for Plant A."

FP: "Genetic Algorithm started..."
    "Optimal sequence found at Generation 45."

TP: "VRP Solver initializing..."
    "Route optimization in progress for 15 vehicles."
```

## 9. Mock Data Management

All mock data is centralized in `src/mocks/`:

- **data.ts:** Output data structures, stage labels, stage order
- **solvers.ts:** Available solver options per stage
- **logs.ts:** Log message sequences per solver algorithm
- **tableData.ts:** Input/output table data for detail views

### 9.1 Adding New Mock Data

1. Define types in `src/types/index.ts`
2. Add data to appropriate mock file
3. Update SCMContext if needed
4. Consume via `useSCM()` hook

## 10. Development Guidelines

### 10.1 Adding a New Solver

1. Add option to `src/mocks/solvers.ts`:
   ```typescript
   { id: 'new-solver', name: 'New Solver', description: 'Description' }
   ```

2. Add log messages to `src/mocks/logs.ts`:
   ```typescript
   'new-solver': ['[INFO] Starting...', '[INFO] Complete.']
   ```

### 10.2 Adding a New Visualization

1. Create component in `src/components/visualizations/`
2. Use Recharts for charts or custom SVG for diagrams
3. Follow existing patterns for responsiveness
4. Integrate with stage detail page

### 10.3 Modifying State

1. Update `SCMContextType` interface
2. Add state in `SCMProvider`
3. Expose via context value object
4. Access via `useSCM()` in components

## 11. Agent Personas (Reference)

See `AGENTS.md` for detailed personas:
- **@frontend:** Architecture and structure
- **@designer:** UI/UX implementation
- **@scm-expert:** Domain validation
- **@poc-speed:** Rapid prototyping

## 12. Documentation

Design and implementation plans are stored in `docs/plans/`:
- Design documents: `*-design.md`
- Implementation plans: `*-implementation.md`

## 13. Known Patterns

### 13.1 Log Streaming Simulation

```typescript
const streamLog = () => {
  if (index >= messages.length) {
    setSolverStatus(prev => ({ ...prev, [stage]: 'complete' }));
    return;
  }

  setLogs(prev => ({
    ...prev,
    [stage]: [...prev[stage], entry],
  }));

  const delay = 200 + Math.random() * 600; // 200-800ms variance
  setTimeout(streamLog, delay);
};
```

### 13.2 Sync Notification Logic

When a solver completes:
1. Clear its own `needsSync` flag
2. Mark all downstream completed stages as `needsSync: true`
3. Display orange dashed connectors in header
4. Show SyncBadge on affected stage nodes
