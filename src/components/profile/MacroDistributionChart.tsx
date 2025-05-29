
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface MacroDistributionData {
  total_protein_grams: number;
  total_carbs_grams: number;
  total_fat_grams: number;
  protein_percentage: number;
  carbs_percentage: number;
  fat_percentage: number;
}

interface MacroDistributionChartProps {
  data: MacroDistributionData | null;
}

const MacroDistributionChart = ({ data }: MacroDistributionChartProps) => {
  if (!data) {
    return (
      <div className="bg-foodcam-darker/50 rounded-lg p-4 flex items-center justify-center h-[300px]">
        <p className="text-foodcam-gray">Sem dados suficientes para mostrar distribuição</p>
      </div>
    );
  }

  const chartData = [
    {
      name: 'Proteína',
      value: Number(data.protein_percentage),
      grams: Number(data.total_protein_grams),
      color: '#10B981'
    },
    {
      name: 'Carboidratos',
      value: Number(data.carbs_percentage),
      grams: Number(data.total_carbs_grams),
      color: '#3B82F6'
    },
    {
      name: 'Gordura',
      value: Number(data.fat_percentage),
      grams: Number(data.total_fat_grams),
      color: '#F59E0B'
    }
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-foodcam-darker border border-foodcam-gray/20 p-3 rounded-lg shadow-lg">
          <p className="font-semibold">{data.name}</p>
          <p className="text-sm">{data.grams}g ({data.value}%)</p>
        </div>
      );
    }
    return null;
  };

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-foodcam-darker/50 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Distribuição de Macros (7 dias)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MacroDistributionChart;
