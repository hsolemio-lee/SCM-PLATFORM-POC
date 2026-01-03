// src/components/charts/FPChart.tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { line: 'Line 1', efficiency: 92, color: '#00FFFF' },
  { line: 'Line 2', efficiency: 87, color: '#0088AA' },
  { line: 'Line 3', efficiency: 95, color: '#4FFFFF' },
  { line: 'Line 4', efficiency: 78, color: '#1e5a8f' },
];

export default function FPChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" horizontal={false} />
        <XAxis type="number" domain={[0, 100]} stroke="#ffffff60" fontSize={11} />
        <YAxis dataKey="line" type="category" stroke="#ffffff60" fontSize={11} width={50} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#0a0a0f',
            border: '1px solid #1e3a5f',
            borderRadius: '6px',
            fontSize: '12px',
          }}
          labelStyle={{ color: '#ffffff' }}
          formatter={(value) => [`${value}%`, 'Efficiency']}
        />
        <Bar dataKey="efficiency" radius={[0, 4, 4, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
