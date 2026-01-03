import { useSCM } from '../context/SCMContext';
import KPICard from '../components/common/KPICard';
import LiveSolverLog from '../components/common/LiveSolverLog';
import GanttChart from '../components/visualizations/GanttChart';

export default function FactoryPlanning() {
  const { solverOutputs, solverStatus, logs, expandedLog, setExpandedLog } = useSCM();
  const { schedule, kpis } = solverOutputs.fp;

  return (
    <div className="space-y-6">
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

      {/* Main Visualization */}
      <GanttChart data={schedule} />

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
