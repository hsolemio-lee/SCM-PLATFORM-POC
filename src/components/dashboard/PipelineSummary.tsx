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
