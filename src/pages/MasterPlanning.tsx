// src/pages/MasterPlanning.tsx
import { useState } from 'react';
import { useSCM } from '../context/SCMContext';
import KPICard from '../components/common/KPICard';
import LiveSolverLog from '../components/common/LiveSolverLog';
import SupplyDemandChart from '../components/visualizations/SupplyDemandChart';
import SolverSelector from '../components/common/SolverSelector';
import DataTabs from '../components/common/DataTabs';
import DataTable from '../components/common/DataTable';
import { solverOptions } from '../mocks/solvers';
import { stageTableData } from '../mocks/tableData';

export default function MasterPlanning() {
  const { solverOutputs, solverStatus, logs, expandedLog, setExpandedLog, selectedSolver, setSelectedSolver } = useSCM();
  const { plans, kpis } = solverOutputs.mp;
  const [activeTab, setActiveTab] = useState<'input' | 'output'>('output');

  const tableData = stageTableData.mp;
  const isRunning = solverStatus.mp === 'running';

  return (
    <div className="space-y-6">
      {/* Solver Selection & Tabs */}
      <div className="flex items-center justify-between">
        <SolverSelector
          options={solverOptions.mp}
          selectedId={selectedSolver.mp}
          onSelect={(id) => setSelectedSolver('mp', id)}
          disabled={isRunning}
        />
        <DataTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard
          label="Service Level"
          value={kpis.serviceLevel}
          suffix="%"
          trend="up"
          trendValue="+0.5%"
        />
        <KPICard
          label="Inventory Turns"
          value={kpis.inventoryTurns}
          suffix="x"
          trend="up"
          trendValue="+1.2"
        />
        <KPICard
          label="Fill Rate"
          value={kpis.fillRate}
          suffix="%"
          trend="neutral"
        />
        <KPICard
          label="Plants Balanced"
          value={plans.length}
          trend="neutral"
        />
      </div>

      {/* Main Content */}
      {activeTab === 'output' ? (
        <SupplyDemandChart data={plans} />
      ) : (
        <DataTable
          data={tableData.input}
          columns={tableData.inputColumns}
        />
      )}

      {/* Live Solver Log */}
      <LiveSolverLog
        stage="mp"
        logs={logs.mp}
        status={solverStatus.mp}
        isExpanded={expandedLog === 'mp'}
        onToggle={() => setExpandedLog(expandedLog === 'mp' ? null : 'mp')}
      />
    </div>
  );
}
