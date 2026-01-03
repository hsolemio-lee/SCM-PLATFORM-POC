// src/components/dashboard/CompactKPIs.tsx
import { SolverStage } from '../../types';
import { useSCM } from '../../context/SCMContext';

interface CompactKPIsProps {
  stage: SolverStage;
}

export default function CompactKPIs({ stage }: CompactKPIsProps) {
  const { solverOutputs } = useSCM();

  const kpiConfigs: Record<SolverStage, { label: string; value: number | string; suffix: string }[]> = {
    dp: [
      { label: 'Accuracy', value: solverOutputs.dp.kpis.accuracy, suffix: '%' },
      { label: 'Coverage', value: solverOutputs.dp.kpis.coverage, suffix: '%' },
      { label: 'MAPE', value: solverOutputs.dp.kpis.mape, suffix: '%' },
    ],
    mp: [
      { label: 'Service', value: solverOutputs.mp.kpis.serviceLevel, suffix: '%' },
      { label: 'Turns', value: solverOutputs.mp.kpis.inventoryTurns, suffix: 'x' },
      { label: 'Fill', value: solverOutputs.mp.kpis.fillRate, suffix: '%' },
    ],
    fp: [
      { label: 'OEE', value: solverOutputs.fp.kpis.oee, suffix: '%' },
      { label: 'Setup', value: solverOutputs.fp.kpis.setupTime, suffix: 'm' },
      { label: 'Thru', value: solverOutputs.fp.kpis.throughput, suffix: '' },
    ],
    tp: [
      { label: 'Dist', value: solverOutputs.tp.kpis.totalDistance, suffix: 'km' },
      { label: 'Util', value: solverOutputs.tp.kpis.vehicleUtilization, suffix: '%' },
      { label: 'OTD', value: solverOutputs.tp.kpis.onTimeDelivery, suffix: '%' },
    ],
  };

  const kpis = kpiConfigs[stage];

  return (
    <div className="flex gap-3">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className="flex-1 bg-nexprime-dark border border-nexprime-blue/30 rounded-lg p-3 text-center"
        >
          <div className="text-nexprime-cyan text-lg font-bold">
            {kpi.value}{kpi.suffix}
          </div>
          <div className="text-white/50 text-xs">{kpi.label}</div>
        </div>
      ))}
    </div>
  );
}
