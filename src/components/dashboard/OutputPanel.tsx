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
  const tableData = stageTableData[stage];

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
            columns={tableData.outputColumns}
            data={tableData.output}
            maxHeight="100%"
          />
        )}
      </div>
    </div>
  );
}
