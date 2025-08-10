import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MaxRecord } from '@/lib/storage';
import { format } from 'date-fns';

interface ProgressChartProps {
  records: MaxRecord[];
}

export function ProgressChart({ records }: ProgressChartProps) {
  if (records.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-muted/50 rounded-lg border border-dashed border-border">
        <p className="text-muted-foreground">No data to display</p>
      </div>
    );
  }

  const chartData = records.map(record => ({
    date: format(new Date(record.date), 'MMM dd'),
    weight: record.weight,
    fullDate: record.date,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-card">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-lg font-semibold text-primary">
            {payload[0].value} kg
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="date" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}