
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface NutritionData {
  week_start: string;
  week_end: string;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  meal_count: number;
  avg_daily_calories: number;
}

interface NutritionChartProps {
  data: NutritionData[];
}

const NutritionChart = ({ data }: NutritionChartProps) => {
  const chartData = data.map(week => ({
    period: format(parseISO(week.week_start), 'dd/MM', { locale: ptBR }),
    Proteína: Number(week.total_protein),
    Carboidratos: Number(week.total_carbs),
    Gordura: Number(week.total_fat),
    calories: week.total_calories,
    meals: week.meal_count
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-foodcam-darker border border-foodcam-gray/20 p-3 rounded-lg shadow-lg">
          <p className="font-semibold mb-2">Semana de {label}</p>
          <p className="text-sm text-green-400">Proteína: {data.Proteína}g</p>
          <p className="text-sm text-blue-400">Carboidratos: {data.Carboidratos}g</p>
          <p className="text-sm text-yellow-400">Gordura: {data.Gordura}g</p>
          <p className="text-sm text-foodcam-gray mt-1">
            {data.calories} kcal • {data.meals} refeições
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-foodcam-darker/50 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Macronutrientes por Semana</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="period" 
            stroke="#9CA3AF"
            fontSize={12}
          />
          <YAxis 
            stroke="#9CA3AF"
            fontSize={12}
            label={{ value: 'Gramas', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="Proteína" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} />
          <Bar dataKey="Carboidratos" stackId="a" fill="#3B82F6" radius={[0, 0, 0, 0]} />
          <Bar dataKey="Gordura" stackId="a" fill="#F59E0B" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NutritionChart;
