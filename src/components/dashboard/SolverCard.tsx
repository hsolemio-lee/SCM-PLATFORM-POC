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
