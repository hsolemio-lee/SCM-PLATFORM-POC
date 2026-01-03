import { useSCM } from '../context/SCMContext';
import KPICard from '../components/common/KPICard';
import LiveSolverLog from '../components/common/LiveSolverLog';
import RouteMap from '../components/visualizations/RouteMap';

export default function TransportPlanning() {
  const { solverOutputs, solverStatus, logs, expandedLog, setExpandedLog } = useSCM();
  const { routes, kpis } = solverOutputs.tp;

  return (
    <div className="space-y-6">
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

      {/* Main Visualization */}
      <RouteMap data={routes} />

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
