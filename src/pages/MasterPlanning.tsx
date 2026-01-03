import { useSCM } from '../context/SCMContext';
import KPICard from '../components/common/KPICard';
import LiveSolverLog from '../components/common/LiveSolverLog';
import SupplyDemandChart from '../components/visualizations/SupplyDemandChart';

export default function MasterPlanning() {
  const { solverOutputs, solverStatus, logs, expandedLog, setExpandedLog } = useSCM();
  const { plans, kpis } = solverOutputs.mp;

  return (
    <div className="space-y-6">
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

      {/* Main Visualization */}
      <SupplyDemandChart data={plans} />

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
