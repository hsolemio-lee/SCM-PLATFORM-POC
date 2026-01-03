// src/pages/TransportPlanning.tsx
import { useState } from 'react';
import { useSCM } from '../context/SCMContext';
import KPICard from '../components/common/KPICard';
import LiveSolverLog from '../components/common/LiveSolverLog';
import RouteMap from '../components/visualizations/RouteMap';
import SolverSelector from '../components/common/SolverSelector';
import DataTabs from '../components/common/DataTabs';
import DataTable from '../components/common/DataTable';
import { solverOptions } from '../mocks/solvers';
import { stageTableData } from '../mocks/tableData';

export default function TransportPlanning() {
  const { solverOutputs, solverStatus, logs, expandedLog, setExpandedLog, selectedSolver, setSelectedSolver } = useSCM();
  const { routes, kpis } = solverOutputs.tp;
  const [activeTab, setActiveTab] = useState<'input' | 'output'>('output');

  const tableData = stageTableData.tp;
  const isRunning = solverStatus.tp === 'running';

  return (
    <div className="space-y-6">
      {/* Solver Selection & Tabs */}
      <div className="flex items-center justify-between">
        <SolverSelector
          options={solverOptions.tp}
          selectedId={selectedSolver.tp}
          onSelect={(id) => setSelectedSolver('tp', id)}
          disabled={isRunning}
        />
        <DataTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard
          label="Total Distance"
          value={kpis.totalDistance}
          suffix=" km"
          trend="down"
          trendValue="-45km"
        />
        <KPICard
          label="Vehicle Utilization"
          value={kpis.vehicleUtilization}
          suffix="%"
          trend="up"
          trendValue="+5%"
        />
        <KPICard
          label="On-Time Delivery"
          value={kpis.onTimeDelivery}
          suffix="%"
          trend="up"
          trendValue="+1.2%"
        />
        <KPICard
          label="Active Routes"
          value={routes.length}
          trend="neutral"
        />
      </div>

      {/* Main Content */}
      {activeTab === 'output' ? (
        <RouteMap data={routes} />
      ) : (
        <DataTable
          data={tableData.input}
          columns={tableData.inputColumns}
        />
      )}

      {/* Live Solver Log */}
      <LiveSolverLog
        stage="tp"
        logs={logs.tp}
        status={solverStatus.tp}
        isExpanded={expandedLog === 'tp'}
        onToggle={() => setExpandedLog(expandedLog === 'tp' ? null : 'tp')}
      />
    </div>
  );
}
