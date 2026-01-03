// src/components/charts/MPChart.tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { plant: 'Plant A', supply: 1200, demand: 1100 },
  { plant: 'Plant B', supply: 900, demand: 950 },
  { plant: 'Plant C', supply: 1400, demand: 1300 },
  { plant: 'Plant D', supply: 800, demand: 850 },
];

export default function MPChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} barGap={0}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
        <XAxis dataKey="plant" stroke="#ffffff60" fontSize={11} />
        <YAxis stroke="#ffffff60" fontSize={11} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#0a0a0f',
            border: '1px solid #1e3a5f',
            borderRadius: '6px',
            fontSize: '12px',
          }}
          labelStyle={{ color: '#ffffff' }}
        />
        <Legend wrapperStyle={{ fontSize: '11px' }} />
        <Bar dataKey="supply" fill="#00FFFF" name="Supply" radius={[3, 3, 0, 0]} />
        <Bar dataKey="demand" fill="#0088AA" name="Demand" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
