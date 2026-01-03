// src/components/charts/TPChart.tsx
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'On Time', value: 75, color: '#00FFFF' },
  { name: 'Early', value: 15, color: '#4FFFFF' },
  { name: 'Delayed', value: 10, color: '#0088AA' },
];

export default function TPChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={70}
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: '#0a0a0f',
            border: '1px solid #1e3a5f',
            borderRadius: '6px',
            fontSize: '12px',
          }}
          formatter={(value) => [`${value}%`, 'Deliveries']}
        />
        <Legend
          wrapperStyle={{ fontSize: '11px' }}
          formatter={(value) => <span style={{ color: '#ffffff80' }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
