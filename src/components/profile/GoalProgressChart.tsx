
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface GoalProgressData {
  date_day: string;
  calories_consumed: number;
  calories_goal: number;
  goal_percentage: number;
}

interface GoalProgressChartProps {
  data: GoalProgressData[];
}

const GoalProgressChart = ({ data }: GoalProgressChartProps) => {
  const chartData = data.map(day => ({
    day: format(parseISO(day.date_day), 'dd/MM', { locale: ptBR }),
    consumed: day.calories_consumed,
    goal: day.calories_goal,
    percentage: Number(day.goal_percentage)
  }));

  const avgGoal = data.length > 0 ? data[0].calories_goal : 2000;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-foodcam-darker border border-foodcam-gray/20 p-3 rounded-lg shadow-lg">
          <p className="font-semibold mb-2">{label}</p>
          <p className="text-sm text-foodcam-blue">Consumido: {data.consumed} kcal</p>
          <p className="text-sm text-foodcam-gray">Meta: {data.goal} kcal</p>
          <p className="text-sm text-green-400">Progresso: {data.percentage}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-foodcam-darker/50 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Progresso de Metas (7 dias)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="day" 
            stroke="#9CA3AF"
            fontSize={12}
          />
          <YAxis 
            stroke="#9CA3AF"
            fontSize={12}
            label={{ value: 'Calorias', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={avgGoal} stroke="#6B7280" strokeDasharray="5 5" label="Meta" />
          <Line 
            type="monotone" 
            dataKey="consumed" 
            stroke="#3B82F6" 
            strokeWidth={3}
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GoalProgressChart;
