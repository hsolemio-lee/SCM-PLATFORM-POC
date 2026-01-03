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
