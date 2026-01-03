import { useSCM } from '../context/SCMContext';
import KPICard from '../components/common/KPICard';
import LiveSolverLog from '../components/common/LiveSolverLog';
import ForecastChart from '../components/visualizations/ForecastChart';

export default function DemandPlanning() {
  const { solverOutputs, solverStatus, logs, expandedLog, setExpandedLog } = useSCM();
  const { forecasts, kpis } = solverOutputs.dp;

  return (
    <div className="space-y-6">
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

      {/* Main Visualization */}
      <ForecastChart data={forecasts} />

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
