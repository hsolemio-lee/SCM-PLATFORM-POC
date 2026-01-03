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
