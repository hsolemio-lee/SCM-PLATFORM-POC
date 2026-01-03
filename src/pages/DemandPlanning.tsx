// src/pages/DemandPlanning.tsx
import { useState } from 'react';
import { useSCM } from '../context/SCMContext';
import KPICard from '../components/common/KPICard';
import LiveSolverLog from '../components/common/LiveSolverLog';
import ForecastChart from '../components/visualizations/ForecastChart';
import SolverSelector from '../components/common/SolverSelector';
import DataTabs from '../components/common/DataTabs';
import DataTable from '../components/common/DataTable';
import { solverOptions } from '../mocks/solvers';
import { stageTableData } from '../mocks/tableData';

export default function DemandPlanning() {
  const { solverOutputs, solverStatus, logs, expandedLog, setExpandedLog, selectedSolver, setSelectedSolver } = useSCM();
  const { forecasts, kpis } = solverOutputs.dp;
  const [activeTab, setActiveTab] = useState<'input' | 'output'>('output');

  const tableData = stageTableData.dp;
  const isRunning = solverStatus.dp === 'running';

  return (
    <div className="space-y-6">
      {/* Solver Selection & Tabs */}
      <div className="flex items-center justify-between">
        <SolverSelector
          options={solverOptions.dp}
          selectedId={selectedSolver.dp}
          onSelect={(id) => setSelectedSolver('dp', id)}
          disabled={isRunning}
        />
        <DataTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

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

      {/* Main Content - Chart or Table based on tab */}
      {activeTab === 'output' ? (
        <ForecastChart data={forecasts} />
      ) : (
        <DataTable
          data={tableData.input}
          columns={tableData.inputColumns}
        />
      )}

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
