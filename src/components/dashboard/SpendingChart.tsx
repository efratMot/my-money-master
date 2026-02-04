import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { EXPENSE_CATEGORIES } from '@/types/finance';

interface SpendingChartProps {
  expensesByCategory: Record<string, number>;
}

const COLORS = [
  'hsl(160, 84%, 39%)',
  'hsl(262, 83%, 58%)',
  'hsl(38, 92%, 50%)',
  'hsl(199, 89%, 48%)',
  'hsl(0, 84%, 60%)',
  'hsl(280, 70%, 50%)',
  'hsl(180, 70%, 45%)',
  'hsl(320, 70%, 50%)',
];

export function SpendingChart({ expensesByCategory }: SpendingChartProps) {
  const data = Object.entries(expensesByCategory).map(([category, amount]) => {
    const categoryInfo = EXPENSE_CATEGORIES.find(c => c.value === category);
    return {
      name: categoryInfo?.label || category,
      value: amount,
      icon: categoryInfo?.icon || '📦',
    };
  });

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-lg">
          <p className="text-sm font-medium">{payload[0].payload.icon} {payload[0].name}</p>
          <p className="text-sm text-muted-foreground font-mono">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="gradient-card rounded-xl p-6 border border-border"
    >
      <h3 className="text-lg font-semibold mb-4">Spending Breakdown</h3>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-4">
        {data.slice(0, 6).map((item, index) => (
          <div key={item.name} className="flex items-center gap-2 text-xs">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-muted-foreground truncate">{item.icon} {item.name}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
