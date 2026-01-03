// src/pages/FactoryPlanning.tsx
import { useState } from 'react';
import { useSCM } from '../context/SCMContext';
import KPICard from '../components/common/KPICard';
import LiveSolverLog from '../components/common/LiveSolverLog';
import GanttChart from '../components/visualizations/GanttChart';
import SolverSelector from '../components/common/SolverSelector';
import DataTabs from '../components/common/DataTabs';
import DataTable from '../components/common/DataTable';
import { solverOptions } from '../mocks/solvers';
import { stageTableData } from '../mocks/tableData';

export default function FactoryPlanning() {
  const { solverOutputs, solverStatus, logs, expandedLog, setExpandedLog, selectedSolver, setSelectedSolver } = useSCM();
  const { schedule, kpis } = solverOutputs.fp;
  const [activeTab, setActiveTab] = useState<'input' | 'output'>('output');

  const tableData = stageTableData.fp;
  const isRunning = solverStatus.fp === 'running';

  return (
    <div className="space-y-6">
      {/* Solver Selection & Tabs */}
      <div className="flex items-center justify-between">
        <SolverSelector
          options={solverOptions.fp}
          selectedId={selectedSolver.fp}
          onSelect={(id) => setSelectedSolver('fp', id)}
          disabled={isRunning}
        />
        <DataTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

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

      {/* Main Content */}
      {activeTab === 'output' ? (
        <GanttChart data={schedule} />
      ) : (
        <DataTable
          data={tableData.input}
          columns={tableData.inputColumns}
        />
      )}

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
