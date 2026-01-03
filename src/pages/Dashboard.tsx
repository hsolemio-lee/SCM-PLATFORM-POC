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
