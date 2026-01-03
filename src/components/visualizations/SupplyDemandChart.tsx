import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MasterPlanItem } from '../../types';

interface SupplyDemandChartProps {
  data: MasterPlanItem[];
}

export default function SupplyDemandChart({ data }: SupplyDemandChartProps) {
  const chartData = data.map(item => ({
    plant: item.plant,
    supply: item.supply,
    demand: item.demand,
    gap: item.gap,
    utilization: Math.round(item.utilization * 100),
  }));

  return (
    <div className="bg-nexprime-dark border border-nexprime-blue/30 rounded-lg p-4">
      <h3 className="text-white/80 font-medium mb-4">Supply vs Demand by Plant</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} barGap={0}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
          <XAxis dataKey="plant" stroke="#ffffff60" fontSize={12} />
          <YAxis stroke="#ffffff60" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0a0a0f',
              border: '1px solid #1e3a5f',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#ffffff' }}
            formatter={(value, name) => {
              const formattedValue = typeof value === 'number' ? value.toLocaleString() : '0';
              const nameStr = String(name || '');
              const formattedName = nameStr ? nameStr.charAt(0).toUpperCase() + nameStr.slice(1) : '';
              return [formattedValue, formattedName];
            }}
          />
          <Legend />
          <Bar dataKey="supply" fill="#00FFFF" name="Supply" radius={[4, 4, 0, 0]} />
          <Bar dataKey="demand" fill="#0088AA" name="Demand" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      {/* Utilization indicators */}
      <div className="mt-4 flex gap-4 justify-center">
        {chartData.map(item => (
          <div key={item.plant} className="text-center">
            <div className="text-xs text-white/40">{item.plant}</div>
            <div className={`text-sm font-mono ${item.utilization > 100 ? 'text-red-400' : 'text-nexprime-cyan'}`}>
              {item.utilization}% util
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
