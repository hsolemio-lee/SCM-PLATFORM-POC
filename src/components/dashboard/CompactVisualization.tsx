// src/components/dashboard/CompactVisualization.tsx
import { SolverStage } from '../../types';
import { useSCM } from '../../context/SCMContext';
import ForecastChart from '../visualizations/ForecastChart';
import SupplyDemandChart from '../visualizations/SupplyDemandChart';
import GanttChart from '../visualizations/GanttChart';
import RouteMap from '../visualizations/RouteMap';

interface CompactVisualizationProps {
  stage: SolverStage;
}

export default function CompactVisualization({ stage }: CompactVisualizationProps) {
  const { solverOutputs } = useSCM();

  return (
    <div className="h-40 overflow-hidden">
      {stage === 'dp' && <ForecastChart data={solverOutputs.dp.forecasts} />}
      {stage === 'mp' && <SupplyDemandChart data={solverOutputs.mp.plans} />}
      {stage === 'fp' && <GanttChart data={solverOutputs.fp.schedule} />}
      {stage === 'tp' && <RouteMap data={solverOutputs.tp.routes} />}
    </div>
  );
}
