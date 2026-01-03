import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, ComposedChart, Line } from 'recharts';
import { DemandForecast } from '../../types';

interface ForecastChartProps {
  data: DemandForecast[];
}

export default function ForecastChart({ data }: ForecastChartProps) {
  const chartData = data.map(item => ({
    month: item.month,
    forecast: item.forecast,
    actual: item.actual,
    upper: item.forecast * (1 + (1 - item.confidence) / 2),
    lower: item.forecast * (1 - (1 - item.confidence) / 2),
  }));

  return (
    <div className="bg-nexprime-dark border border-nexprime-blue/30 rounded-lg p-4">
      <h3 className="text-white/80 font-medium mb-4">Forecast vs Actual Demand</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
          <XAxis dataKey="month" stroke="#ffffff60" fontSize={12} />
          <YAxis stroke="#ffffff60" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0a0a0f',
              border: '1px solid #1e3a5f',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#ffffff' }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="upper"
            stroke="none"
            fill="#00FFFF"
            fillOpacity={0.1}
            name="Confidence Band"
          />
          <Area
            type="monotone"
            dataKey="lower"
            stroke="none"
            fill="#0a0a0f"
            fillOpacity={1}
          />
          <Line
            type="monotone"
            dataKey="forecast"
            stroke="#00FFFF"
            strokeWidth={2}
            dot={{ fill: '#00FFFF', r: 4 }}
            name="AI Forecast"
          />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#ffffff"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: '#ffffff', r: 4 }}
            name="Actual"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
