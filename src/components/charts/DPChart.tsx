// src/components/charts/DPChart.tsx
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, ComposedChart } from 'recharts';

const data = [
  { month: 'Jan', forecast: 1200, actual: 1150 },
  { month: 'Feb', forecast: 1350, actual: 1300 },
  { month: 'Mar', forecast: 1100, actual: 1180 },
  { month: 'Apr', forecast: 1450, actual: 1400 },
  { month: 'May', forecast: 1600, actual: 1550 },
  { month: 'Jun', forecast: 1500, actual: 1480 },
];

export default function DPChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
        <XAxis dataKey="month" stroke="#ffffff60" fontSize={11} />
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
        <Area
          type="monotone"
          dataKey="forecast"
          fill="#00FFFF"
          fillOpacity={0.1}
          stroke="none"
        />
        <Line
          type="monotone"
          dataKey="forecast"
          stroke="#00FFFF"
          strokeWidth={2}
          dot={{ fill: '#00FFFF', r: 3 }}
          name="Forecast"
        />
        <Line
          type="monotone"
          dataKey="actual"
          stroke="#ffffff"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={{ fill: '#ffffff', r: 3 }}
          name="Actual"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
